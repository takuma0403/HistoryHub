package handler

import (
	"HistoryHub/internal/model"
	"HistoryHub/internal/service"
	"HistoryHub/internal/util"
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type GetProfileResponse struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"userId"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	BirthDate string    `json:"birthDate"`
	School    string    `json:"school"`
	Hobby     string    `json:"hobby"`
}

type CreateProfileRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	BirthDate string `json:"birthDate,omitempty"`
	School    string `json:"school,omitempty"`
	Hobby     string `json:"hobby,omitempty"`
}

type UpdateProfileRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	BirthDate string `json:"birthDate"`
	School    string `json:"school"`
	Hobby     string `json:"hobby"`
}

// GetProfile godoc
// @Summary      プロフィール取得
// @Description  ログインユーザーのプロフィールを取得
// @Tags         profile
// @Produce      json
// @Success      200 {object} GetProfileResponse
// @Failure      401 {string} string "Unauthorized"
// @Failure      404 {string} string "Not found"
// @Security     BearerAuth
// @Router       /profile [get]
func GetProfile(c echo.Context) error {
	UserID, err := util.GetUserIDFromJWT(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}

	profile, err := service.GetProfile(UserID)

	if err != nil {
		return c.JSON(http.StatusNotFound, err.Error())
	}

	res := &GetProfileResponse{
		ID:        profile.ID,
		UserID:    profile.UserID,
		FirstName: profile.FirstName,
		LastName:  profile.LastName,
		BirthDate: profile.BirthDate.String(),
		School:    profile.School,
		Hobby:     profile.Hobby,
	}

	return c.JSON(http.StatusOK, res)
}

// GetProfileByUsername godoc
// @Summary      プロフィール取得（ユーザー名）
// @Description  指定されたユーザー名のプロフィールを取得
// @Tags         Public
// @Produce      json
// @Param        username path string true "ユーザー名"
// @Success      200 {object} GetProfileResponse
// @Failure      404 {string} string "Not found"
// @Router       /public/profile/{username} [get]
func GetProfileByUsername(c echo.Context) error {
	username := c.Param("username")
	UserID, err := service.GetUserIDByUsername(username)

	if err != nil {
		return c.JSON(http.StatusNotFound, err.Error())
	}

	profile, err := service.GetProfile(UserID)

	if err != nil {
		return c.JSON(http.StatusNotFound, err.Error())
	}

	res := &GetProfileResponse{
		FirstName: profile.FirstName,
		LastName:  profile.LastName,
		BirthDate: profile.BirthDate.String(),
		School:    profile.School,
		Hobby:     profile.Hobby,
	}

	return c.JSON(http.StatusOK, res)
}

// CreateProfile godoc
// @Summary      プロフィール作成
// @Description  ログインユーザーのプロフィールを新規作成
// @Tags         profile
// @Accept       json
// @Produce      json
// @Param        request body CreateProfileRequest true "プロフィール情報"
// @Success      201
// @Failure      400 {string} string "Bad request"
// @Failure      401 {string} string "Unauthorized"
// @Failure      500 {string} string "Internal server error"
// @Security     BearerAuth
// @Router       /profile [post]
func CreateProfile(c echo.Context) error {
	UserID, err := util.GetUserIDFromJWT(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}

	var req CreateProfileRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	birthDate, err := util.ParseBirthDate(req.BirthDate)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	profile := model.Profile{
		UserID:    UserID,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		BirthDate: birthDate,
		School:    req.School,
		Hobby:     req.Hobby,
	}

	if err := service.CreateProfile(profile); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusCreated, nil)
}

// UpdateProfile godoc
// @Summary      プロフィール更新
// @Description  ログインユーザーのプロフィールを更新
// @Tags         profile
// @Accept       json
// @Produce      json
// @Param        request body UpdateProfileRequest true "プロフィール情報"
// @Success      200
// @Failure      400 {string} string "Bad request"
// @Failure      401 {string} string "Unauthorized"
// @Failure      500 {string} string "Internal server error"
// @Security     BearerAuth
// @Router       /profile [put]
func UpdateProfile(c echo.Context) error {
	UserID, err := util.GetUserIDFromJWT(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}

	var req UpdateProfileRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	birthDate, err := util.ParseBirthDate(req.BirthDate)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	profile := model.Profile{
		UserID:    UserID,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		BirthDate: birthDate,
		School:    req.School,
		Hobby:     req.Hobby,
	}

	if err := service.UpdateProfile(profile); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, nil)
}
