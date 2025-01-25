FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

CMD ["gunicorn", "-b", "0.0.0.0:8080", "main:app"]
# CMD ["python", "main.py"]

# Python 3.11の公式イメージを使用
# FROM python:3.11-slim

# # 作業ディレクトリを設定
# WORKDIR /app

# # 必要なファイルをコピー
# COPY requirements.txt requirements.txt
# COPY main.py main.py

# # ライブラリをインストール
# RUN pip install --no-cache-dir -r requirements.txt

# # ポートを指定
# EXPOSE 8080

# # アプリケーションを実行
# CMD ["python", "main.py"]