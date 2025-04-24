# HistoryHub
## ポートフォリオ版github的なものをつくろう

## 環境構築手順
### 開発環境
1. リポジトリのクローン  
    ``` git clone git@github.com:takuma0403/HistoryHub.git ```
#### フロントエンド
1. ディレクトリの移動  
    ``` cd frontend ```
2. node_modules構築  
    ``` npm install ```
3. サーバー起動  
    ``` npm run build ```

#### バックエンド
1. ディレクトリの移動  
    ``` cd backend ```
2. dockerコンテナ起動  
    ``` docker compose up --build ```