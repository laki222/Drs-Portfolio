from datetime import datetime, timedelta, timezone
from flask import Blueprint, Response, json, request,jsonify
from Model.User import db, User
from Model.Transaction import CryptoTransaction,TransactionType
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required

users_api = Blueprint("Users_api", __name__)


@users_api.route('/api/users', methods=['GET'])
def get_users():
    
    users = User.query.all()
    user_list = [{"ime": user.FirstName, "prezime": user.LastName, "adresa": user.Address,
                  "grad": user.City, "drzava": user.Country, "broj_telefona": user.Phone,
                  "email": user.Email, "lozinka": user.Password} for user in users]
    
   
    return jsonify(user_list)


@users_api.route('/api/logintoken', methods=['POST'])
def login_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
  
    user = User.query.filter_by(Email=email).first()
    if user is None:
        return jsonify({"error": "Wrong email or passwords"}), 401
      
    if not (user.Password, password):
        return jsonify({"error": "Unauthorized"}), 401
      
    access_token = create_access_token(identity=email)
    return jsonify({
        "message": "Register successful",
        "email": email,
        "access_token": access_token
    })

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
        access_token = create_access_token(identity=new_user.Email)
        # Vratite samo email novoregistrovanog korisnika
        return jsonify({
            "message": "Register successful",
            "email": new_user.Email,
            "access_token": access_token
        }), 200

    return jsonify({"message": "User with this email already exists"}), 409


@users_api.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response
 
@users_api.route("/api/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "logout successful"})
    unset_jwt_cookies(response)
    return response

@users_api.route('/api/profile/<email>',methods=["GET"])
@jwt_required() 
def my_profile(email):
    print(email)
    if not email:
        return jsonify({"error": "Unauthorized Access"}), 401
       
    user = User.query.filter_by(Email=email).first()
  
    response_body = {
        "FirstName": user.FirstName,
        "LastName": user.LastName,
        "Address": user.Address,
        "City": user.City,
        "Country": user.Country,
        "Phone": user.Phone,
        "Email": user.Email,
        "Password": user.Password
    }
  
    return response_body