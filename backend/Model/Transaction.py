from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from enum import Enum
from Model.User import User


class TransactionType(Enum):
    BUY = 'buy'
    SELL = 'sell'


db = SQLAlchemy()

class CryptoTransaction(db.Model):
    __tablename__ = 'crypto_transaction'
    id = db.Column(db.Integer, primary_key=True)
    User_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    Crypto_currency = db.Column(db.String(10), nullable=False)  
    Transaction_type = db.Column(db.Enum(TransactionType), nullable=False)  
    Transaction_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    Amount = db.Column(db.Float, nullable=False)  
    Usd_value = db.Column(db.Float, nullable=False)  

   
