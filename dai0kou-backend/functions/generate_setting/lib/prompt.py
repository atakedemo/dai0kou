import base64
import vertexai
import json
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


def generateSubTitle(contents):
    text = f"""
    以下内容のブログを書いている
    二十文字以内でタイトルを作成して
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
    
    return res_text

def generateContents(source, count, digest):
    text = f"""
    以下内容を、わかりやすく説明するブログを作成して
    {source}

    また、これまで{str(count)}回投稿しており、前回の記事で下記内容は投稿済みであることも留意して
    {digest}
    """
    print("Generation start!!!")

    request = {
        'contents': [
            {'role': 'user', 'parts': [text]}
        ],
    }
    # vertexai.init(project="ai-agent-bamb00", location="asia-northeast1")
    # model = GenerativeModel("gemini-1.5-flash-001",)
    vertexai.init(
        project="33517488829",
        location="us-east1",
        api_endpoint="us-east1-aiplatform.googleapis.com"
    )
    tools = [
        Tool.from_google_search_retrieval(
            google_search_retrieval=grounding.GoogleSearchRetrieval()
        ),
    ]
    model = GenerativeModel(
        "projects/33517488829/locations/us-east1/endpoints/7247149419508793344",
        tools=tools,
        system_instruction=["""あなたはブログ投稿を行う作者です。与えられた情報の要約だけでなく、専門家として、技術の本番活用に向けた考察を加えてください"""]
    )
    
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

    responses = model.generate_content(
        [text],
        generation_config=generation_config,
        safety_settings=safety_settings,
        stream=True,
    )

    print("Generation finished!!!")
    res_text = ""
    for response in responses:
        res_text = res_text + response.text + '\n'
        
    return res_text

def generateContentsInit(source):
    text = f"""
    以下内容を、噛み砕いてわかりやすく説明する日本語のブログを作成して
    {source}
    """
    print("Generation start!!!")

    request = {
        'contents': [
            {'role': 'user', 'parts': [text]}
        ],
    }
    # vertexai.init(project="ai-agent-bamb00", location="asia-northeast1")
    # model = GenerativeModel("gemini-1.5-flash-001",)
    vertexai.init(
        project="33517488829",
        location="us-east1",
        api_endpoint="us-east1-aiplatform.googleapis.com"
    )
    tools = [
        Tool.from_google_search_retrieval(
            google_search_retrieval=grounding.GoogleSearchRetrieval()
        ),
    ]
    model = GenerativeModel(
        "projects/33517488829/locations/us-east1/endpoints/7247149419508793344",
        tools=tools,
        system_instruction=["""あなたはブログ投稿を行う作者です。与えられた情報の要約だけでなく、専門家として、技術の本番活用に向けた考察を加えてください"""]
    )
    
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
        
    # return base64.b64encode(res_text.encode('utf-8')).decode('utf-8')
    return res_text

def generateContentsFromPdf(file_uri, count, digest):
    text = f"""
    与えられたファイルの内容を、噛み砕いてわかりやすく説明する日本語のブログを作成して

    なお、これまで{str(count)}回投稿しており、前回の記事で下記内容は投稿済みであることも留意して
    {digest}
    """
    print("Generation start!!!")

    request = {
        'contents': [
            {'role': 'user', 'parts': [text]}
        ],
    }
    vertexai.init(project="ai-agent-bamb00", location="asia-northeast1")
    model = GenerativeModel("gemini-1.5-flash-001",)
    pdf_file = Part.from_uri(
        uri=file_uri,
        mime_type="application/pdf",
    )
    contents = [pdf_file, text]
    response = model.generate_content(contents)

    print("Generation finished!!!")
    
    res_text = response.text
    # return base64.b64encode(res_text.encode('utf-8')).decode('utf-8')
    return res_text