import time
import os
import requests
import base64
from flask import jsonify
import functions_framework
import firebase_admin
from firebase_admin import auth, credentials, firestore
import tweepy
import vertexai
from vertexai.generative_models import GenerativeModel, Part, SafetySetting, Tool
from vertexai.preview.generative_models import grounding

generation_config = {
    "max_output_tokens": 8192,
    "temperature": 1,
    "top_p": 0.95,
}

safety_settings = [
    SafetySetting(
        category=SafetySetting.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold=SafetySetting.HarmBlockThreshold.OFF
    ),
    SafetySetting(
        category=SafetySetting.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold=SafetySetting.HarmBlockThreshold.OFF
    ),
    SafetySetting(
        category=SafetySetting.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold=SafetySetting.HarmBlockThreshold.OFF
    ),
    SafetySetting(
        category=SafetySetting.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold=SafetySetting.HarmBlockThreshold.OFF
    ),
]


cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)
db = firestore.client()

X_CONSUMER_KEY = os.environ["X_CONSUMER_KEY"]
X_CONSUMER_SECRET = os.environ["X_CONSUMER_SECRET"]
X_ACCESS_TOKEN = os.environ["X_ACCESS_TOKEN"]
X_ACCESS_TOKEN_SECRET = os.environ["X_ACCESS_TOKEN_SECRET"]
X_BEARER_TOKEN = os.environ["X_BEARER_TOKEN"]

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
        content = f"""---
title: "{doc_dict["title"]} ~ {doc_dict["contents"][index]["sub_title"]}"
emoji: "🛠"
type: "tech" 
topics: []
published: true
---
{doc_dict["header"]}

{doc_dict["contents"][index]["body"]}

{doc_dict["footer"]}
        """
        encode_content = base64.b64encode(content.encode('utf-8')).decode('utf-8')
        
        # Post by Github API
        repository = doc_dict["repository"]
        file_name = doc_dict["contents"][index]["id"]
        url = f'https://api.github.com/repos/{repository}/contents/articles/{file_name}.md'
        access_token = doc_dict["github_access_token"]

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        }
        body = {
            'message': 'AIエージェントによる投稿',
            'content': encode_content,
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
        
        # Post on X
        print('start post on X')
        post_body = generate_post(doc_dict["contents"][index]["body"])
        post_content = f" {post_body} https://zenn.dev/bamb00eth/articles/{file_name}"
        print('Post content ---')
        print(post_content)
        result_x = post_x(post_content)
        
        return response
    except requests.exceptions.RequestException as e:
        print(str(e))
        return jsonify({
            'status': 'error',
            'message': str(e)
        })
    
    return 'OK'

def post_x(post_content):
    client = tweepy.Client(
        X_BEARER_TOKEN,
        X_CONSUMER_KEY,
        X_CONSUMER_SECRET,
        X_ACCESS_TOKEN,
        X_ACCESS_TOKEN_SECRET
    )

    client.create_tweet(text=post_content)
    return 'OK'

def generate_post(contents):
    text = f"""
    以下内容のブログを書いている。Xで告知するための文章を100文字以内で作成して
    {contents}
    """
    
    request = {
        'contents': [
            {'role': 'user', 'parts': [text]}
        ],
    }
    vertexai.init(project="ai-agent-bamb00", location="asia-northeast1")
    model = GenerativeModel("gemini-1.5-flash-001",)
    
    responses = model.generate_content(
        [text],
        generation_config=generation_config,
        safety_settings=safety_settings,
        stream=True,
    )
    print("Generation finished!!!")
    res_text = ""
    for response in responses:
        res_text = res_text + response.text
    print(res_text)
    
    return res_text