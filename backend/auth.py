import jwt
import os
from dotenv import load_dotenv
from functools import wraps
from flask import request, jsonify

load_dotenv()

def token_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        token = request.headers.get("Authorization")

        if not token:
            return jsonify({
                "message": "Token missing"
            }), 401

        try:
            token = token.split(" ")[1]

            data = jwt.decode(
                token,
                os.getenv("JWT_SECRET"),
                algorithms=["HS256"]
            )

            current_user = data["user_id"]

        except:
            return jsonify({
                "message": "Invalid token"
            }), 401

        return f(current_user, *args, **kwargs)

    return decorated