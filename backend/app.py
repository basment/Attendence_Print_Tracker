from flask import Flask, jsonify
from flask_cors import CORS
from database import get_connection
from functions.pull_events import pull_events
from functions.register_attendees import register_attendees
from functions.registered_users import registered_user
from functions.sort_attendees import export_attendees
from functions.event_setup import event_setup
from functions.login import login_user
from functions.full_print_functions import generate_and_print_nametag

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": " Event Planner API is running!"})

@app.route("/api/events/<int:user_id>", methods=["GET"])
def handle_pull_events(user_id):
    return pull_events(user_id)

@app.route("/api/event_setup", methods=["POST"])
def inserting_event():
    return event_setup()


@app.route("/api/rsvp", methods=["POST"])
def handle_register_attendees():
    return register_attendees()

@app.route("/api/register", methods=["POST"])
def registered_users():
    return registered_user()

@app.route("/api/export_attendees/<int:event_id>/<sort_field>", methods=["GET"])
def handle_export_attendees(event_id, sort_field):
    return export_attendees(event_id, sort_field)

@app.route("/api/login", methods=["POST"])
def handle_login():
    return login_user()

@app.route("/api/print-nametag", methods=["POST"])
def handle_print_nametag():
    data = request.get_json()
    attendee_id = data.get("attendee_id")

    if not attendee_id:
        return jsonify({"error": "attendee_id is required"}), 400

    result = generate_and_print_nametag(attendee_id)

    if "error" in result:
        return jsonify(result), 404
    return jsonify(result), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
