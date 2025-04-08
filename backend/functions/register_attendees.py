from flask import request, jsonify
from database import get_connection

def register_attendees():
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")
        event_id = data.get("event_id")

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO attendees (event_id, name, email, phone, checked_in) VALUES (?, ?, ?, ?, ?)",
            (event_id, name, email, phone, 0)
        )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Attendee registered seccessfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
