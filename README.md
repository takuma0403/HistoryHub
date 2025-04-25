# HistoryHub
## ポートフォリオ版github的なものをつくろう

## 環境構築手順
### 開発環境
1. リポジトリのクローン  
    ```bash
     git clone git@github.com:takuma0403/HistoryHub.git
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
2. dockerコンテナ起動  
    ```bash
     docker compose up --build