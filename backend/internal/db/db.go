package db

import (
	"log"

	"HistoryHub/internal/config"
	"HistoryHub/internal/model"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	// .env からSQLiteファイルのパスを取得
	dbPath := config.GetEnv("SQLITE_PATH")
	log.Printf("Connecting to SQLite database: %s\n", dbPath)

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	// マイグレーション
	if err := db.AutoMigrate(&model.User{}); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
	

	DB = db
}
