from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

app = Flask(__name__)

cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/add', methods=['POST'])
def add_document():
    try:
        data = request.json
        collection_name = data.get('collection')
        document_id = data.get('id')
        document_data = data.get('data')
        
        if not collection_name or not document_id or not document_data:
            return jsonify({"error": "collection, id, and data are required"}), 400

        db.collection(collection_name).document(document_id).set(document_data)
        return jsonify({"message": "Document added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port)

