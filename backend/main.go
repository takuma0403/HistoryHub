package main

import (
	"database/sql"
	"net/http"

	"github.com/labstack/echo/v4"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	e := echo.New()

	db, err := sql.Open("sqlite3", "./db/app.db")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT);`)
	if err != nil {
		panic(err)
	}

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "HistoryHub API OK")
	})

	e.Logger.Fatal(e.Start(":8081"))
}
