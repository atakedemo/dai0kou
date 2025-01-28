import requests
from flask import jsonify
import base64

def post_zenn(access_token,owner,repo,branch,file_path,content,message):
    sha = None
    url = f'https://api.github.com/repos/{owner}/{repo}/contents/{file_path}'
    
    try:
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        }
        body = {
            'message': message,
            'content': content,
            'branch': branch
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
    