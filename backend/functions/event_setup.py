from flask import Flask, request, jsonify
from database import get_connection

def event_setup():
    data = request.get_json()

    name = data.get('name')
    location = data.get('location')
    date = data.get('date')

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO events (name, location, date) VALUES (?, ?, ?)", (name, location, date))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "You have successfully add an event"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500