import time
import functions_framework

@functions_framework.http
def post_blog(request):
    print("Function Started")

    request_json = request.get_json()
    text = request_json['text']

    # 受け取った変数を出力
    print(text)

    time.sleep(5)

    print("Function Finished")

    return 'OK'