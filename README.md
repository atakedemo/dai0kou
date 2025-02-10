# dai0kou

第ゼロ稿。GCP AIエージェントハッカソンに向けて作成

## 解説記事

https://zenn.dev/bamb00eth/articles/20250210gcphackathon

## ディレクトリ構成

## デモ環境立ち上げ手順

### 1.Zennと連携したGithubリポジトリの用意

注意点

* ディレクトリ名は** "zenn-doc-bamb00" と**する
* デフォルトのブランチは** "main" **とする
* **"articles" **といった名称のフォルダを作成する

### 2.ローカル環境でのWebアプリ立ち上げ

```bash
cd dai0kou-web
npm run dev

> blog-content-generator@0.1.0 dev
> next dev

   ▲ Next.js 15.1.3
   - Local:        http://localhost:3000
   - Network:      http://172.20.2.70:3000

 ✓ Starting...
 ✓ Ready in 1803ms
 ○ Compiling / ...
 ✓ Compiled / in 1424ms (1169 modules)
 GET / 200 in 1831ms
 ✓ Compiled in 199ms (569 modules)
```

### 3. Webアプリ内での記事のタネ提供

ページ左下の「新しい記事の作成」より設定を進める
