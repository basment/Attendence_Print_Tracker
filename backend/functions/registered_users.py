from flask import Flask, request, jsonify
from database import get_connection

def registered_user():

    try:
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
                       "INSERT INTO users (username, email, password) VALUES ( ?, ?, ?)", 
                       (username, email, password)
        )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "You have successfully registered"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    


