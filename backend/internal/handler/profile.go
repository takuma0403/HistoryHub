package handler

import (
	"HistoryHub/internal/model"
	"HistoryHub/internal/service"
	"HistoryHub/internal/util"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type GetProfileResponse struct {
	ID        uint      `json:"id"`
	UserID    uuid.UUID `json:"userId"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	BirthDate time.Time `json:"birthDate"`
	School    string    `json:"school"`
	Hobby     string    `json:"hobby"`
}

type CreateProfileRequest struct {
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	BirthDate time.Time `json:"birthDate"`
	School    string    `json:"school"`
	Hobby     string    `json:"hobby"`
}

type UpdateProfileRequest struct {
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	BirthDate time.Time `json:"birthDate"`
	School    string    `json:"school"`
	Hobby     string    `json:"hobby"`
}

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
		BirthDate: profile.BirthDate,
		School:    profile.School,
		Hobby:     profile.Hobby,
	}

	return c.JSON(http.StatusOK, res)
}

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
		BirthDate: profile.BirthDate,
		School:    profile.School,
		Hobby:     profile.Hobby,
	}

	return c.JSON(http.StatusOK, res)
}

func CreateProfile(c echo.Context) error {
	UserID, err := util.GetUserIDFromJWT(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}

	var req CreateProfileRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	profile := model.Profile{
		UserID:    UserID,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		BirthDate: req.BirthDate,
		School:    req.School,
		Hobby:     req.Hobby,
	}

	if err := service.CreateProfile(profile); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusCreated, nil)
}

func UpdateProfile(c echo.Context) error {
	UserID, err := util.GetUserIDFromJWT(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}

	var req UpdateProfileRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	profile := model.Profile{
		UserID:    UserID,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		BirthDate: req.BirthDate,
		School:    req.School,
		Hobby:     req.Hobby,
	}

	if err := service.UpdateProfile(profile); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, nil)
}
