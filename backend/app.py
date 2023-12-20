from datetime import timedelta
from flask import Flask, jsonify
from Api.Database import db
from sqlalchemy import inspect
from sqlalchemy import text
from Api.Transactions_api import transactions_api
from Api.Users_api import users_api
from flask_cors import CORS
from flask_jwt_extended import JWTManager

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:test123@localhost/projekat?auth_plugin=mysql_native_password'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'lazar-brankovic'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)
db.init_app(app)

app.register_blueprint(users_api)
app.register_blueprint(transactions_api)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
