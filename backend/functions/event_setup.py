from flask import Flask, request, jsonify
from database import get_connection

def event_setup():
    
    try:
        data = request.get_json()
        #event_id = data.get('event_id')
        user_id = data.get('user_id')  
        event_name = data.get('event_name')
        #location = data.get('location')
       ## date = data.get('date')
       ## time = data.get('time')
        description = data.get('description')

        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO events (user_id, event_name, description) VALUES (?, ?, ?)", (user_id, event_name, description))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "You have successfully add an event"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
