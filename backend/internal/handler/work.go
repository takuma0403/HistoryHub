package handler

import (
	"HistoryHub/internal/model"
	"HistoryHub/internal/service"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type GetWorkResponse struct {
	ID          string `json:"id"`
	UserID      string `json:"user_id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	ImagePath   string `json:"image_path"`
	Link        string `json:"link"`
	Period      string `json:"period"`
	Use         string `json:"use"`
}

func GetWorksByUsername(c echo.Context) error {
	username := c.Param("username")
	UserIDstr, err := service.GetUserIDByUsername(username)

	if err != nil {
		return c.JSON(http.StatusNotFound, err.Error())
	}

	UserID, err := uuid.Parse(UserIDstr)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, "Invalid UUID")
	}

	works, err := service.GetWorksByUserID(UserID)
	if err != nil {
		return c.JSON(http.StatusNotFound, err.Error())
	}

	var res []GetWorkResponse
	for _, work := range works {
		res = append(res, GetWorkResponse{
			ID:          strconv.FormatUint(uint64(work.ID), 10),
			UserID:      work.UserID.String(),
			Name:        work.Name,
			Description: work.Description,
			ImagePath:   work.ImagePath,
			Link:        work.Link,
			Period:      work.Period,
			Use:         work.Use,
		})
	}
	return c.JSON(http.StatusOK, res)
}


type CreateWorkRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	ImagePath   string `json:"image_path"`
	Link        string `json:"link"`
	Period      string `json:"period"`
	Use         string `json:"use"`
}

func CreateWork(c echo.Context) error {
	userToken := c.Get("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)

	UserIDStr, ok := claims["id"].(string)
	if !ok {
		return c.JSON(http.StatusUnauthorized, "Invalid token format")
	}

	UserID, err := uuid.Parse(UserIDStr)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, "Invalid UUID")
	}

	name := c.FormValue("name")
	description := c.FormValue("description")
	link := c.FormValue("link")
	period := c.FormValue("period")
	use := c.FormValue("use")

	imagePath := ""
	file, err := c.FormFile("image")
	if err == nil {
		src, err := file.Open()
		if err != nil {
			return err
		}
		defer src.Close()

		filename := uuid.New().String() + filepath.Ext(file.Filename)
		dstPath := "static/uploads/" + filename

		dst, err := os.Create(dstPath)
		if err != nil {
			return err
		}
		defer dst.Close()

		if _, err = io.Copy(dst, src); err != nil {
			return err
		}

		imagePath = "/static/uploads/" + filename
	}

	work := model.Work{
		UserID:      UserID,
		Name:        name,
		Description: description,
		ImagePath:   imagePath,
		Link:        link,
		Period:      period,
		Use:         use,
	}

	if err := service.CreateWork(work); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, work)
}


type UpadateWorkRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	ImagePath   string `json:"image_path"`
	Link        string `json:"link"`
	Period      string `json:"period"`
	Use         string `json:"use"`
}
func UpadateWork(c echo.Context) error {
	userToken := c.Get("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)

	UserIDStr, ok := claims["id"].(string)
	if !ok {
		return c.JSON(http.StatusUnauthorized, "Invalid token format")
	}

	UserID, err := uuid.Parse(UserIDStr)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, "Invalid UUID")
	}

	id, _ := strconv.Atoi(c.Param("id"))

	name := c.FormValue("name")
	description := c.FormValue("description")
	link := c.FormValue("link")
	period := c.FormValue("period")
	use := c.FormValue("use")

	existing, err := service.GetWorkByID(uint(id))
	if err != nil {
		return c.JSON(http.StatusNotFound, "Work not found")
	}

	imagePath := existing.ImagePath

	file, err := c.FormFile("image")
	if err == nil {
		src, err := file.Open()
		if err != nil {
			return err
		}
		defer src.Close()

		filename := uuid.New().String() + filepath.Ext(file.Filename)
		dstPath := "static/uploads/" + filename

		dst, err := os.Create(dstPath)
		if err != nil {
			return err
		}
		defer dst.Close()

		if _, err = io.Copy(dst, src); err != nil {
			return err
		}

		if existing.ImagePath != "" {
			oldPath := "." + existing.ImagePath
			if err := os.Remove(oldPath); err != nil && !os.IsNotExist(err) {
				return err
			}
		}

		imagePath = "/static/uploads/" + filename
	}

	work := model.Work{
		ID:          uint(id),
		UserID:      UserID,
		Name:        name,
		Description: description,
		ImagePath:   imagePath,
		Link:        link,
		Period:      period,
		Use:         use,
	}

	if err := service.UpdateWork(work); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, work)
}


func DeleteWork(c echo.Context) error {
	userToken := c.Get("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)

	UserIDStr, ok := claims["id"].(string)
	if !ok {
		return c.JSON(http.StatusUnauthorized, "Invalid token format")
	}

	_, err := uuid.Parse(UserIDStr)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, "Invalid UUID")
	}

	id, _ := strconv.Atoi(c.Param("id"))

	if err := service.DeleteWork(uint(id)); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, nil)
}