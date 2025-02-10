# 作るもの

## 分解

* タイトル・ヘッダー・フッターの連結
* トップページの微修正
* プロンプト・モデルのアップデート
* 投稿日の設定
* 作ったプロジェクトの一覧取得・表示

## コマンド等

```bash
./google-cloud-sdk/install.sh
./google-cloud-sdk/bin/gcloud init

./google-cloud-sdk/bin/gcloud auth application-default login
./google-cloud-sdk/bin/gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com
Operation "operations/acf.p2-33517488829-cbf28296-30ce-4236-bbbd-a255dfd48168" finished successfully.
```

### バックエンドリソースの作成

Dockerイメージの作成〜リポジトリへのプッシュ

```bash
cd dai0kou-backend/functions/generate_setting
docker build --platform linux/amd64 -t gcr.io/ai-agent-bamb00/dai0kou-function-create-setting:latest .
docker push gcr.io/ai-agent-bamb00/dai0kou-function-create-setting:latest
```

### 2.フロントエンド作成

```bash
npx create-next-app@latest dai0kou-web --typescript
cd vertex-ai-chat

npm install @google-cloud/vertexai
```

```bash
npm install --save clsx
npm install tailwind-merge tailwindcss-animate
npm install @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-switch @radix-ui/react-tabs
npm install class-variance-authority
npm install react-markdown react-simplemde-editor easymde github-markdown-css remark-breaks remark-gfm
npm install @tailwindcss/typography
npm install firebase
```

### （メモ） Terraformセットアップ

Homebrewでインストール

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

terraform --version
> Terraform v1.10.4
> on darwin_arm64
```

GCPのIAMを用意

```bash
./google-cloud-sdk/bin/gcloud iam service-accounts create terraform-user --display-name "Terraform User"
./google-cloud-sdk/bin/gcloud projects add-iam-policy-binding ai-agent-bamb00 \
    --member "serviceAccount:terraform-user@ai-agent-bamb00.iam.gserviceaccount.com" \
    --role "roles/editor"
./google-cloud-sdk/bin/gcloud iam service-accounts keys create ./terraform-key.json \
    --iam-account terraform-user@ai-agent-bamb00.iam.gserviceaccount.com
export GOOGLE_APPLICATION_CREDENTIALS=./terraform-key.json

# ./google-cloud-sdk/bin/gcloud projects add-iam-policy-binding ai-agent-bamb00 \
#     --member="serviceAccount:terraform-user@ai-agent-bamb00.iam.gserviceaccount.com" \
#     --role=roles/cloudfunctions.admin
```

Terraformプロジェクトの初期化

```bash
cd functions
zip -r ../functions.zip .
zip -r ../generate_task.zip .
cd ..
```

※更新

```bash
cd functions
zip -r ../functions.zip .
cd ..

terraform taint google_cloud_run_service.generate_setting
terraform taint google_cloudfunctions2_function.function_generate_task  
terraform taint google_cloudfunctions_function.task_exec_post
terraform apply
```

### Cloud Functionsの構築

## 参考

* [@google-cloud/vertexai 公式](https://www.npmjs.com/package/@google-cloud/vertexai)
* [Google CloudのVertex AI SearchでサクッとRAG構築 #GoogleCloud - Qiita](https://qiita.com/keke21/items/188686e726978a6dd7eb)
* [XX](https://shu-kob.hateblo.jp/entry/2024/06/07/171514)
* [Firebase + ReactでGitHubのソーシャルログインを実装してみた | DevelopersIO](https://dev.classmethod.jp/articles/implementing-social-login-on-github-with-firebasereact/)
* [Terraformのセットアップ](https://zenn.dev/take_tech/articles/32188cd3607721)
* [リポジトリ コンテンツの REST API エンドポイント - GitHub Docs](https://docs.github.com/ja/rest/repos/contents?apiVersion=2022-11-28)
* [Cloud Run デプロイ時のアーキテクチャ不一致エラーの解決覚書](https://zenn.dev/optimind/articles/d3e98b5a63c2b1)
* [XXX](https://qiita.com/croquette0212/items/02d50cd77932f5a0aae1)
* [Firestore トリガー  |  Cloud Run functions Documentation  |  Google Cloud](https://cloud.google.com/functions/docs/calling/cloud-firestore?hl=ja)
* [tweepy + Twitter API V2でツイート](https://qiita.com/penguinprogrammer/items/b220be0c203eaaad015a)