package handler

import (
	"HistoryHub/internal/service"
	"HistoryHub/internal/util"
	"net/http"

	"github.com/labstack/echo/v4"
)

type GetUsernameResponse struct {
	Username string `json:"username"`
}

type UpdateUsernameRequest struct {
	Username string `json:"username"`
}

// GetUsername godoc
// @Summary      ユーザー名取得
// @Description  ログイン中のユーザー名を取得
// @Tags         user
// @Produce      json
// @Success      200 {object} GetUsernameResponse
// @Failure      401 {string} string "Unauthorized"
// @Failure      500 {string} string "Internal server error"
// @Security     BearerAuth
// @Router       /user/username [get]
func GetUsername(c echo.Context) error {
	UserID, err := util.GetUserIDFromJWT(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}

	username, err := service.GetUsername(UserID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	var res GetUsernameResponse
	res.Username = username
	return c.JSON(http.StatusOK, res)
}

// UpdateUsername godoc
// @Summary      ユーザー名変更
// @Description  ログインユーザーのユーザー名を更新
// @Tags         user
// @Accept       json
// @Produce      json
// @Param        request body UpdateUsernameRequest true "ユーザー名情報"
// @Success      200 {string} string "Updated username"
// @Failure      400 {string} string "Invalid request"
// @Failure      401 {string} string "Unauthorized"
// @Failure      500 {string} string "Internal server error"
// @Security     BearerAuth
// @Router       /user/username [put]
func UpdateUsername(c echo.Context) error {
	var req UpdateUsernameRequest
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
