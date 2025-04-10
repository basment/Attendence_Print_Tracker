from flask import jsonify
from database import get_connection

def pull_events(user_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT * FROM events WHERE user_id = ?",
            (user_id,)
        )

        rows = cursor.fetchall()

        if not rows:
            return jsonify({"message": "No events found."})

        events = []
        for row in rows:
            events.append({
                "event_name": row.event_name,
                "location": row.location,
                "date": str(row.date),
                "time": str(row.time),
                "description": row.description
            })

        cursor.close()
        conn.close()
        return jsonify(events), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
