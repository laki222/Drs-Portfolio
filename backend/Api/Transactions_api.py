from collections import defaultdict
from flask import Blueprint,  request, jsonify
from sqlalchemy import func
from Api.Database import db
from Model.User import User
from Model.Transaction import CryptoTransaction, TransactionType
from datetime import datetime
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required
import requests
import functools
from datetime import datetime, timedelta
from multiprocessing import Process,Value,Manager,Queue
import dill

transactions_api = Blueprint("Transactions_api", __name__)
LIVE_PRICE_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"

class DillProcess(Process):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._target = dill.dumps(self._target)  # Save the target function as bytes, using dill

    def run(self):
        if self._target:
            self._target = dill.loads(self._target)    # Unpickle the target function before executing
            self._target(*self._args, **self._kwargs)


@transactions_api.route('/api/transaction', methods=['POST'])
@jwt_required() 
def transaction():
    try:
        user_email = get_jwt_identity()
        transaction_data = request.get_json()
        transaction_date_str = transaction_data['transaction_date']
        transaction_date = datetime.strptime(transaction_date_str, "%Y-%m-%d") 

        transaction = CryptoTransaction(
            User_email=user_email,
            Crypto_currency=transaction_data['crypto_currency'],
            Transaction_type=TransactionType(transaction_data['transaction_type']),
            Amount=transaction_data['amount'],
            Usd_value=transaction_data['usd_value'],
            Transaction_date=transaction_date
        )

        db.session.add(transaction)
        db.session.commit()

        return jsonify({"message": "Transaction added successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@transactions_api.route('/api/transactions', methods=['GET'])
@jwt_required() 
def get_transactions():
    user_email = get_jwt_identity()
    transactions = CryptoTransaction.query.filter_by(User_email=user_email).all()
    transaction_list = [
        {
            "id":transaction.id,
            "crypto_currency": transaction.Crypto_currency, 
            "transaction_type": transaction.Transaction_type.value,
            "amount": transaction.Amount,
            "transaction_date": transaction.Transaction_date.strftime("%Y-%m-%d"),
            "usd_value": transaction.Usd_value,
            "user_email": user_email
        } 
        for transaction in transactions
    ]

    return jsonify(transaction_list)



@transactions_api.route('/api/transactionremove/<id>', methods=['POST'])
@jwt_required() 
def transactionRemove(id):
    try:
        user_email = get_jwt_identity()
        transaction = CryptoTransaction.query.filter_by(id=id, User_email=user_email).first()

        if transaction:
            db.session.delete(transaction)
            db.session.commit()
            return jsonify({"message": "Transaction removed successfully"}), 200
        else:
            return jsonify({"error": "Transaction not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def create_portfolio_entry():
    return {
        "coins": 0,
        "total_cost": 0,
        "total_equity": 0,
        "live_price": 0,
        "percent": 0
    }
@transactions_api.route("/api/portfolio", methods=['GET'])
@jwt_required()
def portfolioCalculate():
    user_email = get_jwt_identity()
    portfolio = defaultdict(create_portfolio_entry)

    result = (
        CryptoTransaction.query
        .with_entities(
            CryptoTransaction.Crypto_currency.label('Crypto_currency'),
            CryptoTransaction.Transaction_type.label('Transaction_type'),
            func.sum(CryptoTransaction.Amount).label('Amount'),
            func.sum(CryptoTransaction.Usd_value).label('Usd_value')
        )
        .filter(CryptoTransaction.User_email == user_email)
        .group_by(CryptoTransaction.Crypto_currency, CryptoTransaction.Transaction_type)
        .all()
    )

    for row in result:
        coin = row.Crypto_currency
        transaction_type = row.Transaction_type
        transaction_Usd = row.Usd_value
        transaction_coins = row.Amount

        # This is a purchase
        if transaction_type == TransactionType.buy:
            portfolio[coin]['total_cost'] += transaction_Usd
            portfolio[coin]['coins'] += transaction_coins
        else:
            # This is a sell
            portfolio[coin]['total_cost'] -= transaction_Usd
            portfolio[coin]['coins'] -= transaction_coins

    symbol_to_coin_id_map = {
        "BTC": "bitcoin",
        "SOL": "solana",
        "LINK": "chainlink",
        "ETH": "ethereum",
        "ADA": "cardano",
        "MANA": "decentraland",
    }
    rollups_response = []
    params = {
            'convert': 'USD'
        }
    headers = {
            'Accepts': 'application/json',
            'X-CMC_PRO_API_KEY': '0ffb8b91-f77d-4f1a-8c38-15b6aa7c60fd',
        }
    response = requests.get(LIVE_PRICE_URL, params=params, headers=headers)
    data = response.json()
    rollups_response = Queue()
    process = DillProcess(target=test, args=(portfolio, symbol_to_coin_id_map, data, rollups_response))
    process.start()
    process.join()
    result_value = []
    while not rollups_response.empty():
        entries = rollups_response.get_nowait()
        for entry in entries:
            if not any(entry['symbol'] == current_entry['symbol'] for current_entry in result_value):
                result_value.append(entry)

    
    return jsonify(result_value)

def test(portfolio,symbol_to_coin_id_map,data,result_value):
     cost_accumulator=0
     value_accumulator=0
     rollups_response = []
     for symbol in portfolio:
        coin_id = symbol_to_coin_id_map.get(symbol, '')
        if not coin_id:
            continue
     
        for crypto_data in data['data']:
              if crypto_data['slug'] == coin_id:
                
                live_price = crypto_data['quote']['USD']['price']
                portfolio[symbol]['total_equity'] = float(
                        portfolio[symbol]['coins']) * live_price

                portfolio[symbol]['live_price']=live_price
                cost_accumulator += portfolio[symbol]["total_cost"]
                value_accumulator += portfolio[symbol]['total_equity']
                    
                absolute_gain = value_accumulator - cost_accumulator

                if(portfolio[symbol]['coins']>0):
                        
                    portfolio[symbol]['percent'] = ((absolute_gain / cost_accumulator) * 100)
                    
                
                    rollups_response.append(
                            {
                                "symbol": symbol,
                                "live_price": portfolio[symbol]['live_price'],
                                "total_equity": portfolio[symbol]['total_equity'],
                                "coins": portfolio[symbol]['coins'],
                                "total_cost": portfolio[symbol]["total_cost"],
                                "percent": portfolio[symbol]['percent']
                            }
                        )
                
                        
                cost_accumulator=0
                value_accumulator=0
               
        result_value.put(rollups_response)

@transactions_api.route('/api/cryptoremove/<name>', methods=['POST'])
@jwt_required() 
def cryptoRemove(name):
    try:
        user_email = get_jwt_identity()

        transactions = CryptoTransaction.query.filter_by(User_email=user_email, Crypto_currency=name).all()

        if transactions:
            for transaction in transactions:
                db.session.delete(transaction)

            db.session.commit()

            return jsonify({"message": "Cryto currency removed successfully"}), 200
        else:
            return jsonify({"error": "No transactions found with the specified name"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500