import time
import requests
import base64
from flask import jsonify
import functions_framework
import firebase_admin
from firebase_admin import auth, credentials, firestore

cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)
db = firestore.client()

@functions_framework.http
def post_blog(request):
    print("Function Started")

    request_json = request.get_json()
    index = request_json['index']
    project_url = request_json['project_url']
    text = request_json['text']
    
    print(project_url)
    time.sleep(5)
    
    sha = None
    # url = f'https://api.github.com/repos/{owner}/{repo}/contents/{file_path}'
    url = 'https://api.github.com/repos/atakedemo/zenn-doc-bamb00/contents/articles/README.md'
    
    try:
        # Get contents data
        path_parts = project_url.split("/")
        separator_idx = path_parts.index("documents")
        collection_path = path_parts[separator_idx + 1]
        document_path = "/".join(path_parts[(separator_idx + 2) :])
        doc_ref = db.collection(collection_path).document(document_path)
        doc = doc_ref.get()
        doc_dict = doc.to_dict()
        
        # Apply blog parts
        body = doc_dict["contents"][index]["body"]
        # header = 
        # fotter = 
        # contents = 

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        }
        # encoded_content = base64.b64encode(body.encode('utf-8')).decode('utf-8')
        body = {
            # 'message': message,
            # 'content': content,
            # 'branch': branch
            'message': text,
            'content': body,
            'branch': 'main'
        }
        
        # chech file-existing
        check_response = requests.get(url,headers=headers)
        print(str(check_response.json()))
        if check_response.ok:
            existing_file = check_response.json()
            sha = existing_file.get('sha')
        
        # post contents
        if sha is not None:
            body['sha'] = sha
        
        print('Start github api response!!!')
        put_response = requests.put(url, headers=headers, json=body)
        put_response.raise_for_status()
        put_result = put_response.json()
        print(str(put_result))
        response =  jsonify({
            'status': 'success',
            'message': str(put_result)
        })
        response.headers['Content-Type'] = 'application/json; charset=utf-8'
        
        return response
    except requests.exceptions.RequestException as e:
        print(str(e))
        return jsonify({
            'status': 'error',
            'message': str(e)
        })

    return 'OK'