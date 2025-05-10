package handler

import (
	"HistoryHub/internal/model"
	"HistoryHub/internal/service"
	"net/http"
	"strconv"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func CreateSkill(c echo.Context) error {
	userToken := c.Get("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)

	id, ok := claims["id"].(string)
	if !ok {
		return c.JSON(http.StatusUnauthorized, "Invalid token")
	}

	var skill model.Skill
	if err := c.Bind(&skill); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if err := service.CreateSkill(id, skill); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusCreated, nil)
}

func UpdateSkill(c echo.Context) error {
	userToken := c.Get("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)

	UserID, ok := claims["id"].(string)
	if !ok {
		return c.JSON(http.StatusUnauthorized, "Invalid token")
	}

	id, _ := strconv.Atoi(c.Param("id"))

	var skill model.Skill
	if err := c.Bind(&skill); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	skill.ID = uint(id)

	if err := service.UpdateSkill(UserID, skill); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, nil)
}

func DeleteSkill(c echo.Context) error {
	userToken := c.Get("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)

	UserID, ok := claims["id"].(string)
	if !ok {
		return c.JSON(http.StatusUnauthorized, "Invalid token")
	}

	id, _ := strconv.Atoi(c.Param("id"))

	if err := service.DeleteSkill(UserID, uint(id)); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.NoContent(http.StatusNoContent)
}

type SkillResponse struct {
	ID          uint      `json:"id"`
	ProfileID   uint      `json:"profileId"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	IsMainSkill bool      `json:"isMainSkill"`

}

func GetSkill(c echo.Context) error {
	userToken := c.Get("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)

	id, ok := claims["id"].(string)
	if !ok {
		return c.JSON(http.StatusUnauthorized, "Invalid token")
	}

	skills, err := service.GetSkills(id)
	if err != nil {
		return c.JSON(http.StatusNotFound, err.Error())
	}

	var res []SkillResponse
	for _, s := range skills {
		res = append(res, SkillResponse{
			ID:          s.ID,
			ProfileID:   s.ProfileID,
			Name:        s.Name,
			Description: s.Description,
			IsMainSkill: s.IsMainSkill,
		})
	}

	return c.JSON(http.StatusOK, res)
}

func GetSkillByUsername(c echo.Context) error {
	username := c.Param("username")
	UserID, err := service.GetUserIDByUsername(username)

	if err != nil {
		return c.JSON(http.StatusNotFound, err.Error())
	}

	skills, err := service.GetSkills(UserID)

	if err != nil {
		return c.JSON(http.StatusNotFound, err.Error())
	}

	var res []SkillResponse
	for _, s := range skills {
		res = append(res, SkillResponse{
			Name:        s.Name,
			Description: s.Description,
			IsMainSkill: s.IsMainSkill,
		})
	}

	return c.JSON(http.StatusOK, res)
}