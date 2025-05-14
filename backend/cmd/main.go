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

	publicAPI := e.Group("/public")

	publicAPI.GET("/profile/:username", handler.GetProfileByUsername)
	publicAPI.GET("/skill/:username", handler.GetSkillByUsername)
	publicAPI.GET("/work/:username", handler.GetWorksByUsername)

	auth := e.Group("/auth")
	auth.POST("/signup", handler.SignUp)
	auth.POST("/verify", handler.VerifyEmail)
	auth.POST("/login", handler.Login)

	api := e.Group("/api")
	api.Use(middleware.JWTMiddleware())

	user := api.Group("/user")
	user.GET("/username", handler.GetUsername)
	user.PUT("/username", handler.UpdateUsername)

	profile := api.Group("/profile")
	profile.GET("", handler.GetProfile)
	profile.POST("", handler.CreateProfile)
	profile.PUT("", handler.UpdateProfile)

	skill := api.Group("/skill")
	skill.GET("", handler.GetSkill)
	skill.POST("", handler.CreateSkill)
	skill.PUT("/:id", handler.UpdateSkill)
	skill.DELETE("/:id", handler.DeleteSkill)

	work := api.Group("/work")
	work.POST("", handler.CreateWork)
	work.PUT("/:id", handler.UpadateWork)
	work.DELETE("/:id", handler.DeleteWork)

	e.Logger.Fatal(e.Start(":8081"))
}
