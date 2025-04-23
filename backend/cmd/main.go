package main

import (
	"net/http"

	"HistoryHub/internal/config"
	"HistoryHub/internal/db"
	"HistoryHub/internal/handler"

	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
)

func main() {
	config.LoadEnv()
	e := echo.New()
	e.Use(echoMiddleware.Logger())
	e.Use(echoMiddleware.Recover())

	db.InitDB()

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "HistoryHub API OK")
	})

	authGroup := e.Group("/auth")
	authGroup.POST("/signup", handler.SignUp)
	authGroup.POST("/verify", handler.VerifyEmail)
	authGroup.POST("/login", handler.Login)

	e.Logger.Fatal(e.Start(":8081"))
}
