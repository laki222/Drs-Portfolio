from flask import Blueprint, request, jsonify
from Api.Database import db
from Model.User import User
from Model.Transaction import CryptoTransaction, TransactionType
from datetime import datetime
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required

transactions_api = Blueprint("Transactions_api", __name__)

@transactions_api.route('/api/transaction', methods=['POST'])
@jwt_required() 
def transaction():
    try:
        user_email = get_jwt_identity()
        print(user_email)
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
