from flask import Flask, jsonify
from flask_cors import CORS
from database import get_connection
from functions.pull_events import pull_events
<<<<<<< HEAD
from functions.register_attendees import register_attendees
=======
from functions.registered_users import registered_user
>>>>>>> 71b4f21bba4b25851513b697f2d2c0a001ecb56a

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": " Event Planner API is running!"})


@app.route("/api/events", methods=["GET"])
def handle_pull_events():
    return pull_events()

<<<<<<< HEAD
@app.route("/api/rsvp", methods=["POST"])
def handle_register_attendees():
    return register_attendees()
=======
@app.route("/api/register", methods=["POST"])
def registered_users():
    return registered_user()

>>>>>>> 71b4f21bba4b25851513b697f2d2c0a001ecb56a

if __name__ == "__main__":
    app.run(debug=True)
