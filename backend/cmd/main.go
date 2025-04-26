package main

import (
	"context"
	"os"
	"os/signal"
	"time"

	"HistoryHub/internal/config"
	"HistoryHub/internal/db"
	"HistoryHub/internal/handler"
	"HistoryHub/internal/service"

	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
)

func main() {
	config.LoadEnv()

	e := echo.New()
	e.Use(echoMiddleware.Logger())
	e.Use(echoMiddleware.Recover())

	db.InitDB()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	cleaner := db.NewGormCleaner(db.DB, 5*time.Minute)
	cleanupSvc := service.NewCleanupService(cleaner)
	cleanupSvc.Start(ctx)

	e.GET("/", func(c echo.Context) error {
		return c.String(200, "HistoryHub API OK")
	})

	authGroup := e.Group("/auth")
	authGroup.POST("/signup", handler.SignUp)
	authGroup.POST("/verify", handler.VerifyEmail)
	authGroup.POST("/login", handler.Login)

	e.Logger.Fatal(e.Start(":8081"))
}
