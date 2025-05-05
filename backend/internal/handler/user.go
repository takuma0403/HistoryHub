package handler

import (
	"HistoryHub/internal/service"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
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

type UpdateUsernameRequest struct {
	ID       uuid.UUID `json:"id"`
	Username string    `json:"username"`
}

func UpdateUsername(c echo.Context) error {
	var req UpdateUsernameRequest;
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid request")
	}
	err := service.UpdateUsername(req.ID, req.Username)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, "Updated username")
}