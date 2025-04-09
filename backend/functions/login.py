from flask import request, jsonify
from database import get_connection

def login_user():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        conn = get_connection()
        cursor = conn.cursor()

        # Check for matching user
        cursor.execute(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            (username, password)
        )

        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if user:
            return jsonify({"message": "Login successful!"}), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500
