package handler

import (
	"HistoryHub/internal/model"
	"HistoryHub/internal/service"
	"net/http"
	"time"

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

	return c.JSON(http.StatusCreated, nil)
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

	return c.JSON(http.StatusOK, nil)
}

type ProfileResponse struct {
	ID        uint      `json:"id"`
	UserID    uuid.UUID `json:"userId"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	BirthDate time.Time `json:"birthDate"`
	School    string    `json:"school"`
	Hobby     string    `json:"hobby"`
}

func GetProfile(c echo.Context) error {
	userToken := c.Get("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)

	id, ok := claims["id"].(string)
	if !ok {
		return c.JSON(http.StatusUnauthorized, "Invalid token")
	}

	profile, err := service.GetProfile(id)

	if err != nil {
		return c.JSON(http.StatusNotFound, err.Error())
	}

	res := &ProfileResponse{
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

	res := &ProfileResponse{
		FirstName: profile.FirstName,
		LastName:  profile.LastName,
		BirthDate: profile.BirthDate,
		School:    profile.School,
		Hobby:     profile.Hobby,
	}

	return c.JSON(http.StatusOK, res)
}
