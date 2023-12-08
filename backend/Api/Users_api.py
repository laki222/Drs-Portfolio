from flask import Blueprint, Response, request,jsonify
from Model.User import db, User
from Model.Transaction import CryptoTransaction,TransactionType


users_api = Blueprint("Users_api", __name__)


@users_api.route('/api/users', methods=['GET'])
def get_users():
    
    users = User.query.all()
    user_list = [{"ime": user.FirstName, "prezime": user.LastName, "adresa": user.Address,
                  "grad": user.City, "drzava": user.Country, "broj_telefona": user.Phone,
                  "email": user.Email, "lozinka": user.Password} for user in users]
    
   
    return jsonify(user_list)


@users_api.route('/api/login', methods=['POST'])
def login():
    email = request.get_json()["email"]
    password = request.get_json()["password"]
    users = User.query.all()
    
    print(f"Number of users: {len(users)}")
    
    for user in users:
        print(f"Checking user: {user.Email} and password {user.Password}")
        if user.Email == email and user.Password == password:
            return jsonify({"message": "Login successful"}), 200
    
    
    return jsonify({"message": "Invalid credentials"}), 401

@users_api.route('/api/register', methods=['POST'])
def register():
    user_data = request.get_json()
    user_register = User(**user_data)
    existing_user = User.query.filter_by(Email=user_register.Email).first()
    
    if existing_user is None:
        # Ako ne postoji korisnik sa istom email adresom, dodajte novog korisnika u bazu
        db.session.add(user_register)
        db.session.commit()

        # Odmah nakon registracije, dohvatite novoregistrovanog korisnika
        new_user = User.query.filter_by(Email=user_register.Email).first()

        # Vratite samo email novoregistrovanog korisnika
        return jsonify({
            "message": "Register successful",
            "email": new_user.Email
        }), 200

    return jsonify({"message": "User with this email already exists"}), 401