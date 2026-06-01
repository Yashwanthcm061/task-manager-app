from flask import Flask, request, jsonify
from flask_cors import CORS
from db import conn, cursor
import bcrypt
import jwt
import datetime
import os
from dotenv import load_dotenv
from auth import token_required
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return {"message": "Backend Running"}

@app.route("/register", methods=["POST"])
def register():

    data = request.json

    name = data["name"]
    email = data["email"]
    password = data["password"]

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    cursor.execute(
        """
        INSERT INTO users(name,email,password)
        VALUES(%s,%s,%s)
        """,
        (name, email, hashed_password)
    )

    conn.commit()

    return jsonify({
        "message": "User Registered Successfully"
    })
@app.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data["email"]
    password = data["password"]

    cursor.execute(
        "SELECT * FROM users WHERE email=%s",
        (email,)
    )

    user = cursor.fetchone()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    stored_password = user[3]

    if not bcrypt.checkpw(
        password.encode("utf-8"),
        stored_password.encode("utf-8")
    ):
        return jsonify({
            "message": "Invalid password"
        }), 401

    token = jwt.encode(
        {
            "user_id": user[0],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
        },
        os.getenv("JWT_SECRET"),
        algorithm="HS256"
    )

    return jsonify({
        "message": "Login Successful",
        "token": token,
        "user_id": user[0],
        "name": user[1]
    })

@app.route("/profile")
@token_required
def profile(current_user):

    return jsonify({
        "message": "Protected Route",
        "user_id": current_user
    })
@app.route("/tasks", methods=["POST"])
@token_required
def create_task(current_user):

    data = request.json

    title = data["title"]
    description = data["description"]
    status = data.get("status", "Todo")

    cursor.execute(
        """
        INSERT INTO tasks(title, description, status, user_id)
        VALUES(%s, %s, %s, %s)
        """,
        (title, description, status, current_user)
    )

    conn.commit()

    return jsonify({
        "message": "Task Created Successfully"
    })

@app.route("/tasks", methods=["GET"])
@token_required
def get_tasks(current_user):

    cursor.execute(
        """
        SELECT id, title, description, status, created_at
        FROM tasks
        WHERE user_id=%s
        ORDER BY created_at DESC
        """,
        (current_user,)
    )

    tasks = cursor.fetchall()

    result = []

    for task in tasks:
        result.append({
            "id": task[0],
            "title": task[1],
            "description": task[2],
            "status": task[3],
            "created_at": str(task[4])
        })

    return jsonify(result)

@app.route("/tasks/<int:task_id>", methods=["PUT"])
@token_required
def update_task(current_user, task_id):

    data = request.json

    cursor.execute(
        """
        UPDATE tasks
        SET title=%s,
            description=%s,
            status=%s
        WHERE id=%s
        AND user_id=%s
        """,
        (
            data["title"],
            data["description"],
            data["status"],
            task_id,
            current_user
        )
    )

    conn.commit()

    return jsonify({
        "message": "Task Updated Successfully"
    })

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
@token_required
def delete_task(current_user, task_id):

    cursor.execute(
        """
        DELETE FROM tasks
        WHERE id=%s
        AND user_id=%s
        """,
        (task_id, current_user)
    )

    conn.commit()

    return jsonify({
        "message": "Task Deleted Successfully"
    })

if __name__ == "__main__":
    app.run(debug=True)