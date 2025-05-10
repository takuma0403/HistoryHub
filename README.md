# HistoryHub
## ポートフォリオ版github的なものをつくろう

## 環境構築手順
### 開発環境
1. リポジトリのクローン  
    ```bash
     git clone git@github.com:takuma0403/HistoryHub.git
2. ディレクトリの移動
    ```bash
     cd HistoryHub
3. 設定ファイルのコピー
    ```bash
    cp doc/example/sample.env backend/.env
4. 設定ファイルの編集  
   backend/.envを開いてコメントのある3項目を編集する
   1. < your-secret-key >
      - `openssl rand -base64 64` コマンドなどでキーを作成する
   2. < your-smtp-mail-address >
      - 認証コードのメールの送信元となるメールアドレス
      - gmailが推奨
   3. < your-smtp-app-password >
      - 上記メールアドレスのアプリパスワード
      - 上記gmailアカウントのセキュリティーから、2段階認証プロセスを有効にする => [参考リンク](https://support.google.com/a/answer/9176657?hl=ja)
      - アプリのパスワードの作成を行う => [参考リンク](https://support.google.com/mail/answer/185833?hl=ja)
#### フロントエンド
1. ディレクトリの移動  
    ```bash
     cd frontend
2. node_modules構築  
    ```bash
     npm install
3. サーバー起動  
    ```bash
     npm run build
#### バックエンド
1. ディレクトリの移動  
    ```bash
     cd backend
2. Dockerコンテナ起動  
    ```bash
     docker compose up --build
### 本番環境
1. リポジトリのクローン  
    ```bash
     git clone git@github.com:takuma0403/HistoryHub.git
2. ディレクトリの移動
    ```bash
     cd HistoryHub
3. Dockerコンテナビルド  
   一度にすると処理落ちすることがあるのでサービスを一つずつビルドする
    ```bash
     docker compose build backend
     docker compose build nginx
4. Dockerコンテナ起動
    ```bash
     docker compose up
