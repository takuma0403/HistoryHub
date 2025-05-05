package handler

import (
	"HistoryHub/internal/model"
	"HistoryHub/internal/service"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func CreateProfile(c echo.Context) error {
	userToken := c.Get("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)

	idStr, ok := claims["id"].(string)
	if !ok {
		return c.JSON(http.StatusUnauthorized, "Invalid token format")
	}

	id, err := uuid.Parse(idStr)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, "Invalid UUID")
	}

	var profile model.Profile
	if err := c.Bind(&profile); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	profile.UserID = id

	if err := service.CreateProfile(profile); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusCreated, profile)
}


func UpdateProfile(c echo.Context) error {
	userToken := c.Get("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)

	idStr, ok := claims["id"].(string)
	if !ok {
		return c.JSON(http.StatusUnauthorized, "Invalid token")
	}

	id, err := uuid.Parse(idStr)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, "Invalid UUID")
	}

	var profile model.Profile
	if err := c.Bind(&profile); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	profile.UserID = id

	if err := service.UpdateProfile(profile); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, profile)
}
