package handler

import (
	"HistoryHub/internal/service"
	"HistoryHub/internal/util"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func GetMeID(c echo.Context) error {
	userToken := c.Get("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)

	id, ok := claims["id"].(string)
	if !ok {
		return c.JSON(http.StatusUnauthorized, "Invalid token")
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}

type GetUsernameResponse struct {
	Username string    `json:"username"`
}

func GetUsername(c echo.Context)  error {
	UserID, err := util.GetUserIDFromJWT(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}

	username, err := service.GetUsername(UserID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	var res GetUsernameResponse;
	res.Username = username
	return c.JSON(http.StatusOK, res)
}

type UpdateUsernameRequest struct {
	Username string    `json:"username"`
}

func UpdateUsername(c echo.Context) error {
	var req UpdateUsernameRequest;
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid request")
	}

	UserID, err := util.GetUserIDFromJWT(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}

	err = service.UpdateUsername(UserID, req.Username)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, "Updated username")
}