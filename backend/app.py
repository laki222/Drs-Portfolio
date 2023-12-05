from flask import Flask, jsonify
from Model.User import db, User
from Model.Transaction import CryptoTransaction,TransactionType
from sqlalchemy import inspect
from sqlalchemy import text

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:test123@localhost/projekat?auth_plugin=mysql_native_password'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

db.init_app(app)


with app.app_context():
    inspector = inspect(db.engine)

   
    if not inspector.has_table(User.__tablename__):
        db.create_all()

    # TO DO
    if not inspector.has_table('crypto_transaction'):
        create_table_query = text("""
        CREATE TABLE `projekat`.`crypto_transaction` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            User_id INT NOT NULL,
            Crypto_currency VARCHAR(10) NOT NULL,
            Transaction_type ENUM('buy', 'sell') NOT NULL,
            Transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            Amount FLOAT NOT NULL,
            Usd_value FLOAT NOT NULL,
            FOREIGN KEY (User_id) REFERENCES `projekat`.`user` (id)
        )
        """)
        
        
        db.session.execute(create_table_query)
        db.session.commit()



@app.route('/api', methods=['GET'])
def index():
    
    users = User.query.all()
    user_list = [{"ime": user.FirstName, "prezime": user.LastName, "adresa": user.Address,
                  "grad": user.City, "drzava": user.Country, "broj_telefona": user.Phone,
                  "email": user.Email, "lozinka": user.Password} for user in users]
    
    print(user_list)
    return jsonify(user_list)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
