from flask import Flask, jsonify
from flask_cors import CORS
from database import get_connection

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": " Event Planner API is running!"})

@app.route("/api/events")
def get_events():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT event_id, event_name, address, city, state, date FROM events")
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
                "date": str(row.date)
            })
        cursor.close()
        conn.close()
        return jsonify(events)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
