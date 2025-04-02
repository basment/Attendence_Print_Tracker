from flask import jsonify
from database import get_connection

def pull_events():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM events")
        rows = cursor.fetchall()

        if not rows:
            return jsonify({"message": "No events found."})

        events = []
        for row in rows:
            events.append({
                "event_id": row.event_id,
                "event_name": row.event_name,
                "address": row.address,
                "city": row.city,
                "state": row.state,
                "date": str(row.date),
                "time": str(row.time),
                "description": row.description
            })

        cursor.close()
        conn.close()
        return jsonify(events)

    except Exception as e:
        return jsonify({"error": str(e)})
