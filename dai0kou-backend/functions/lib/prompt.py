import base64
import vertexai
import json
from vertexai.generative_models import GenerativeModel, Part, SafetySetting

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

def generateContents(thema, additional, stage, digest):
    text = f"""
    以下内容を、わかりやすく説明するブログを作成して
    {thema}

    尚、下記内容を含むようにして
    {additional}

    また、これまで{str(stage-1)}回投稿しており、下記内容は投稿済みであることも留意して
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

def generateContentsInit(thema, additional):
    print('s')
    contetns = 's'
    return contetns