package handler

import (
	"HistoryHub/internal/service"
	"net/http"

	"github.com/labstack/echo/v4"
)

type SignUpRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type VerifyRequest struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// SignUp godoc
// @Summary      新規登録
// @Description  ユーザーの新規登録を行い、認証メールを送信する
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        request body SignUpRequest true "登録情報"
// @Success      200 {string} string "Verification email sent"
// @Failure      400 {string} string "Invalid request"
// @Failure      500 {string} string "Internal server error"
// @Router       /auth/signup [post]
func SignUp(c echo.Context) error {
	var req SignUpRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid request")
	}
	err := service.SignUp(req.Email, req.Password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, "Verification email sent")
}

// VerifyEmail godoc
// @Summary      メール認証
// @Description  登録時に送信されたコードでメールを認証する
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        request body VerifyRequest true "認証情報"
// @Success      200 {string} string "Account verified"
// @Failure      400 {string} string "Invalid request"
// @Failure      401 {string} string "Unauthorized"
// @Router       /auth/verify [post]
func VerifyEmail(c echo.Context) error {
	var req VerifyRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid request")
	}
	err := service.VerifyEmail(req.Email, req.Code)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}
	return c.JSON(http.StatusOK, "Account verified")
}

// Login godoc
// @Summary      ログイン
// @Description  ユーザーのログイン認証とJWTの発行
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        request body LoginRequest true "ログイン情報"
// @Success      200 {object} map[string]string "token: JWTトークン"
// @Failure      400 {string} string "Invalid request"
// @Failure      401 {string} string "Unauthorized"
// @Router       /auth/login [post]
func Login(c echo.Context) error {
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid request")
	}
	token, err := service.Login(req.Email, req.Password)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}
	return c.JSON(http.StatusOK, map[string]string{"token": token})
}
