# HistoryHub
## ポートフォリオ版github的なものをつくろう

## 開発仕様
- Nginx を使用して、ビルド済みのフロントエンドファイルを配信する
- Nginx でバックエンドを配信
- Docker で環境構築
- ユーザー認証時のメール認証にはGmailのsmtpサーバーを用いる
- 本番環境のサーバーはVPS上に構築する
  
#### Frontend
- npmを用いてビルドする
- React + Redux で状態管理を行う
- Redux Toolkit の createApi（RTK Query）を使用して API 処理を管理する
- Material UI を用いてスタイルの統一を行う
  
#### Backend
- Go言語のフレームワーク Echo を使用して API を構築する
- トークン認証には JWT（JSON Web Token）を使用する
- DBはSQLiteを用いる
- 本番環境と開発環境で Dockerfile を分け、開発環境では Air を使用してホットリロードが有効になるように管理する

### システム構成図
![システム構成](/document/images/system_image.png)
### ER図
![ER図](/document/images/ER.png)

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
    cp docs/example/sample.env backend/.env
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
