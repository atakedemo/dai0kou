from flask import Flask, jsonify, request
import uuid
import firebase_admin
from firebase_admin import auth, credentials, firestore

app = Flask(__name__)

cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/add_setting', methods=['POST'])
def add_document():
    try:
        # auth_header = request.headers.get('Authorization')
        data = request.json
        document_data = data.get('data')
        user_id = data.get('user_id')
        project_id = str(uuid.uuid1())
        
        if not document_data:
            return jsonify({"error": "data are required"}), 400
        
        # Add Project data
        user_data_ref = db.collection('projects_via_user').document(user_id)
        user_data_snapshot = user_data_ref.get()
        if user_data_snapshot.exists:
            user_data = user_data_snapshot.to_dict()
            projects_via_user = user_data['projects']
            projects_via_user.append(project_id)
            user_data['projects'] = projects_via_user
            db.collection('projects_via_user').document(user_id).set(user_data)
        else:
            user_data = {
                'user_id': user_id,
                'projects': [project_id]
            }
            db.collection('projects_via_user').document(user_id).set(user_data)
        
        # Add Setting
        db.collection('setting_via_project').document(project_id).set(document_data)
        
        return jsonify({"message": "Document added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port)

