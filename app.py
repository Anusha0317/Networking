from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

if not os.path.exists("database"):
    os.makedirs("database")
# CREATE DATABASE
def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS parcels (
        parcel_id TEXT PRIMARY KEY,
        name TEXT,
        status TEXT
    )
    """)
    conn.commit()
    conn.close()

init_db()


# ADD PARCEL
@app.route("/add", methods=["POST"])
def add():
    data = request.json
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO parcels VALUES (?, ?, ?)",
                   (data["parcel_id"], data["name"], data["status"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "Added"})


# GET ALL
@app.route("/parcels")
def get_all():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM parcels")
    rows = cursor.fetchall()
    conn.close()

    return jsonify([
        {"parcel_id": r[0], "name": r[1], "status": r[2]}
        for r in rows
    ])


# UPDATE
@app.route("/update/<pid>", methods=["PUT"])
def update(pid):
    data = request.json
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("UPDATE parcels SET status=? WHERE parcel_id=?",
                   (data["status"], pid))
    conn.commit()
    conn.close()
    return jsonify({"message": "Updated"})


# TRACK
@app.route("/track/<pid>")
def track(pid):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM parcels WHERE parcel_id=?", (pid,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return jsonify({"status": row[2]})
    return jsonify({})


# DELETE PARCEL
@app.route("/delete/<pid>", methods=["DELETE"])
def delete(pid):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("DELETE FROM parcels WHERE parcel_id=?", (pid,))

    conn.commit()
    conn.close()

    return jsonify({"message": "Deleted"})

# ALWAYS KEEP THIS LAST
if __name__ == "__main__":
    app.run(debug=True)
