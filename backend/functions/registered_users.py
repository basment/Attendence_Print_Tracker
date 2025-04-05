from flask import Flask, request, jsonify
from database import get_connection

def registered_user():
    #data = request.get_json()
    username = 'Phat'
    email = 'pdang@gmail.com'
    password = '12345'

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", (username, email, password))
        conn.commit()
        conn.close()
        cursor.close()
        return jsonify({"message": "You have successfully registered"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    


