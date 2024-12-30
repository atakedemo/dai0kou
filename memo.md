# 作るもの

## 分解

* GCPのAPIを叩いてブログを生成するロジックを作る
  * テキストを直接Input
  * PDFをインプット
  * URLからその先のブログをインプット
* 上記をセットアップする画面を作る（管理画面）
* ログイン認証をつける、DB化する
* Cloud Runなどで公開する
* ロジックをチューニングする

## コマンド等

```bash
./google-cloud-sdk/install.sh
./google-cloud-sdk/bin/gcloud init

./google-cloud-sdk/bin/gcloud auth application-default login
```

### 2.フロントエンド作成

```bash
npx create-next-app@latest dai0kou-web --typescript
cd vertex-ai-chat

npm install @google-cloud/vertexai
```

## 参考

* [@google-cloud/vertexai 公式](https://www.npmjs.com/package/@google-cloud/vertexai)
* [Google CloudのVertex AI SearchでサクッとRAG構築 #GoogleCloud - Qiita](https://qiita.com/keke21/items/188686e726978a6dd7eb)
* [XX](https://shu-kob.hateblo.jp/entry/2024/06/07/171514)