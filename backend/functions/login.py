from flask import request, jsonify
from database import get_connection

def login_user():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT * FROM users WHERE email = ? AND password = ?",
            (email, password)
        )

        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            return jsonify({"message": "Login successful!"}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500
