package main

import (
	"context"
	"os"
	"os/signal"
	"time"

	"HistoryHub/internal/config"
	"HistoryHub/internal/db"
	"HistoryHub/internal/handler"
	"HistoryHub/internal/middleware"
	"HistoryHub/internal/service"

	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
)

func main() {
	config.LoadEnv()

	e := echo.New()
	e.Use(echoMiddleware.CORS())
	e.Use(echoMiddleware.Logger())
	e.Use(echoMiddleware.Recover())

	e.Static("/static", "static")

	db.InitDB()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	cleaner := db.NewGormCleaner(db.DB, 5*time.Minute)
	cleanupSvc := service.NewCleanupService(cleaner)
	cleanupSvc.Start(ctx)

	e.GET("/", func(c echo.Context) error {
		return c.String(200, "HistoryHub API OK")
	})
	e.GET("/profile/:username", handler.GetProfileByUsername)
	e.GET("/skill/:username", handler.GetSkillByUsername)
	e.GET("/work/:username", handler.GetWorksByUsername)

	authGroup := e.Group("/auth")
	authGroup.POST("/signup", handler.SignUp)
	authGroup.POST("/verify", handler.VerifyEmail)
	authGroup.POST("/login", handler.Login)

	apiGroup := e.Group("/api")
	apiGroup.Use(middleware.JWTMiddleware())
	apiGroup.GET("/me", handler.GetMeID)
	apiGroup.GET("/sample", handler.Sample)

	apiGroup.GET("/username", handler.GetUsername)
	apiGroup.PUT("/username", handler.UpdateUsername)
	
	apiGroup.GET("/profile", handler.GetProfile)
	apiGroup.POST("/profile", handler.CreateProfile)
	apiGroup.PUT("/profile", handler.UpdateProfile)

	apiGroup.GET("/skill", handler.GetSkill)
	apiGroup.POST("/skill", handler.CreateSkill)
	apiGroup.PUT("/skill/:id", handler.UpdateSkill)
	apiGroup.DELETE("/skill/:id", handler.DeleteSkill)

	apiGroup.POST("/work", handler.CreateWork)
	apiGroup.PUT("/work/:id", handler.UpadateWork)
	apiGroup.DELETE("/work/:id", handler.DeleteWork)

	e.Logger.Fatal(e.Start(":8081"))
}
