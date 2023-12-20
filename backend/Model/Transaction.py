from datetime import datetime
from Api.Database import db
from enum import Enum
from Model.User import User


class TransactionType(Enum):
    buy = 'buy'
    sell = 'sell'

class CryptoTransaction(db.Model):
    __tablename__ = 'crypto_transaction'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    User_email = db.Column(db.String, db.ForeignKey(User.Email), nullable=False)
    Crypto_currency = db.Column(db.String(10), nullable=False)  
    Transaction_type = db.Column(db.Enum(TransactionType), nullable=False)  
    Transaction_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    Amount = db.Column(db.Float, nullable=False)  
    Usd_value = db.Column(db.Float, nullable=False)  

   
