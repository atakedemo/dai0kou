from flask import Flask, jsonify, request
import uuid
import firebase_admin
from firebase_admin import auth, credentials, firestore
import lib.prompt as prompt
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": ["Content-Type", "Authorization"]}})

cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/add_setting', methods=['POST',"OPTIONS"])
def add_document():
    if request.method == "OPTIONS":
        response = jsonify()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.status_code = 204
        return response

    try:
        # auth_header = request.headers.get('Authorization')
        data = request.json
        document_data = data.get('data')
        user_id = data.get('user_id')
        github_access_token = data.get('github_access_token')
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
        
        # Generate content & sub-title
        print("start generation!!!!")
        sources = document_data["sources"]
        contents = []
        for i, source in enumerate(sources):
            if i == 0:
                print(f"start ${str(i)}")
                body = prompt.generateContentsInit(source)
                sub_title = prompt.generateSubTitle(body)
                contents.append({
                    "body": body,
                    "sub_title": sub_title,
                    "id": project_id + str(i)
                })
            else:
                print(f"start ${str(i)}")
                digest = contents[i-1]["body"]
                sub_title = f"テスト記事 {str(i)}"
                body = prompt.generateContents(source, i, digest)
                sub_title = prompt.generateSubTitle(body)
                contents.append({
                    "body": body,
                    "sub_title": sub_title,
                    "id": project_id + str(i)
                })
        print("finish generation!!!!")
        document_data["contents"] = contents
        document_data["github_access_token"] = github_access_token
        
        # Add Setting
        db.collection('setting_via_project').document(project_id).set(document_data)
        
        return jsonify({
            "message": "Document added successfully!!",
            "projet_id": project_id
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port)

