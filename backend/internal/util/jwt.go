package util

import (
	"errors"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GetUserIDFromJWT(c echo.Context) (uuid.UUID, error) {
	userToken, ok := c.Get("user").(*jwt.Token)
	if !ok {
		return uuid.Nil, errors.New("failed to get JWT token from context")
	}

	claims, ok := userToken.Claims.(jwt.MapClaims)
	if !ok {
		return uuid.Nil, errors.New("invalid JWT claims format")
	}

	idStr, ok := claims["id"].(string)
	if !ok {
		return uuid.Nil, errors.New("user ID not found or invalid type in token claims")
	}

	userID, err := uuid.Parse(idStr)
	if err != nil {
		return uuid.Nil, errors.New("invalid UUID format in token")
	}
	fmt.Print("UserID:", userID)

	return userID, nil
}
