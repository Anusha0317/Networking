from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# ============ CREATE DATABASE ============

def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS parcels (
        parcel_id TEXT PRIMARY KEY,
        name TEXT,
        customer_name TEXT,
        email TEXT,
        address TEXT,
        date TEXT,
        status TEXT
    )
    """)

    conn.commit()
    conn.close()


init_db()

# ============ ADD PARCEL ============

@app.route("/add", methods=["POST"])
def add():
    data = request.json
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    try:
        cursor.execute("""
        INSERT INTO parcels (parcel_id, name, customer_name, email, address, date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            data["parcel_id"],
            data["name"],
            data["customer_name"],
            data["email"],
            data["address"],
            data["date"],
            data["status"]
        ))

        conn.commit()
        return jsonify({"message": "Parcel added successfully"}), 200

    except sqlite3.IntegrityError:
        return jsonify({"error": "Parcel ID already exists"}), 400

    finally:
        conn.close()


# ============ GET ALL PARCELS ============

@app.route("/parcels", methods=["GET"])
def get_parcels():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM parcels")
    rows = cursor.fetchall()
    conn.close()

    parcels = []
    for row in rows:
        parcels.append({
            "parcel_id": row[0],
            "name": row[1],
            "customer_name": row[2],
            "email": row[3],
            "address": row[4],
            "date": row[5],
            "status": row[6]
        })

    return jsonify(parcels)


# ============ UPDATE PARCEL ============

@app.route("/update/<parcel_id>", methods=["PUT"])
def update(parcel_id):
    data = request.json
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE parcels SET status = ? WHERE parcel_id = ?",
        (data["status"], parcel_id)
    )

    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        return jsonify({"error": "Parcel not found"}), 404

    conn.close()
    return jsonify({"message": "Parcel updated successfully"})


# ============ DELETE PARCEL ============

@app.route("/delete/<parcel_id>", methods=["DELETE"])
def delete(parcel_id):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("DELETE FROM parcels WHERE parcel_id = ?", (parcel_id,))
    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        return jsonify({"error": "Parcel not found"}), 404

    conn.close()
    return jsonify({"message": "Parcel deleted successfully"})


# ============ TRACK PARCEL ============

@app.route("/track/<parcel_id>", methods=["GET"])
def track(parcel_id):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM parcels WHERE parcel_id = ?", (parcel_id,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return jsonify({
            "parcel_id": row[0],
            "name": row[1],
            "customer_name": row[2],
            "email": row[3],
            "address": row[4],
            "date": row[5],
            "status": row[6]
        })
    else:
        return jsonify({"error": "Parcel not found"}), 404


# ============ RUN SERVER ============

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
    
