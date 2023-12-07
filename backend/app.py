from flask import Flask, jsonify
from Model.User import db, User
from Model.Transaction import CryptoTransaction,TransactionType
from sqlalchemy import inspect
from sqlalchemy import text
from Api.Transactions_api import transactions_api
from Api.Users_api import users_api

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:test123@localhost/projekat?auth_plugin=mysql_native_password'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

db.init_app(app)

app.register_blueprint(users_api)
app.register_blueprint(transactions_api)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
