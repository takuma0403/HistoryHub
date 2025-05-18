package handler

import (
	"HistoryHub/internal/model"
	"HistoryHub/internal/service"
	"HistoryHub/internal/util"
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type GetSkillResponse struct {
	ID          uuid.UUID `json:"id"`
	UserID      uuid.UUID `json:"UserID"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	IsMainSkill bool      `json:"isMainSkill"`
}

type CreateSkillRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	IsMainSkill bool   `json:"isMainSkill"`
}

type UpadateSkillRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	IsMainSkill bool   `json:"isMainSkill"`
}

func GetSkill(c echo.Context) error {
	UserID, err := util.GetUserIDFromJWT(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}

	skills, err := service.GetSkillsByUserID(UserID)
	if err != nil {
		return c.JSON(http.StatusNotFound, err.Error())
	}

	var res []GetSkillResponse
	for _, s := range skills {
		res = append(res, GetSkillResponse{
			ID:          s.ID,
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

	skills, err := service.GetSkillsByUserID(UserID)

	if err != nil {
		return c.JSON(http.StatusNotFound, err.Error())
	}

	var res []GetSkillResponse
	for _, s := range skills {
		res = append(res, GetSkillResponse{
			Name:        s.Name,
			Description: s.Description,
			IsMainSkill: s.IsMainSkill,
		})
	}

	return c.JSON(http.StatusOK, res)
}

func CreateSkill(c echo.Context) error {
	UserID, err := util.GetUserIDFromJWT(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}

	var req CreateSkillRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	skill := model.Skill{
		ID:          uuid.New(),
		UserID:      UserID,
		Name:        req.Name,
		Description: req.Description,
		IsMainSkill: req.IsMainSkill,
	}

	if err := service.CreateSkill(skill); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusCreated, nil)
}

func UpdateSkill(c echo.Context) error {
	UserID, err := util.GetUserIDFromJWT(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}

	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)

	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	var req UpadateSkillRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	skill := model.Skill{
		ID:          id,
		UserID:      UserID,
		Name:        req.Name,
		Description: req.Description,
		IsMainSkill: req.IsMainSkill,
	}

	if err := service.UpdateSkill(skill); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, nil)
}

func DeleteSkill(c echo.Context) error {
	_, err := util.GetUserIDFromJWT(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}

	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)

	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if err := service.DeleteSkill(id); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.NoContent(http.StatusNoContent)
}
