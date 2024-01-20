"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from bcrypt import gensalt
from flask_bcrypt import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)


# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    print(password)

    if not email or not password:
        return jsonify({"msg": "Bad email or password"}), 401

    # Realizar la verificación de las credenciales con la API externa
    #response = request.post("https://improved-space-guacamole-5gq5gpp4x9p7hrrp-3001.app.github.dev", json={"email": email, "password": password})
    user = User.query.filter_by(email= email).first()

    if user is None: 
        return jsonify({"msg": "User not found"}), 404
    
    if not check_password_hash(user.hashed_password, password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)

@api.route("/hello", methods=["GET"])
@jwt_required()
def get_hello():
    email = get_jwt_identity()
    dictionary = {
        "message": "hello" + email
    }
    return jsonify(dictionary)

@api.route('/user', methods=["POST"])
def handle_register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    print(password)
    # Verificar que nos envien los datos completos
    data = request.json
    if not data or "email" not in data or "password" not in data:
        return jsonify({
        "message": "Invalid request data"
    }), 400
    # Verificar que el usuario no este registrado (verificar el email)
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({
        "message": "User already exists"
        }), 400
    # Crear el salt
    #salt = str(gensalt(), encoding='utf-8')
    # Crear el hashed_password -> password + salt
    hashed_password = generate_password_hash(password).decode("utf-8")
    print(hashed_password)
    # Crear el usuario
    new_user = User(
        email = email,
        hashed_password = hashed_password,
        #salt = salt
    )
    print(new_user)
    # Guardar en db
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as error:
        db.session.rollback()
        return jsonify({
            "message": "DB error"
        }), 500
    # Responder 201
    return "", 201




    

# Allow CORS requests to this API
CORS(api)
