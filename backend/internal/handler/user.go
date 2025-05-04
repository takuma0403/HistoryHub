package handler

import (
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func GetMe(c echo.Context) error {
	userToken := c.Get("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)

	username, ok1 := claims["username"].(string)
	email, ok2 := claims["email"].(string)
	if !ok1 || !ok2 {
		return c.JSON(http.StatusUnauthorized, "Invalid token")
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"username": username,
		"email":    email,
	})
}
