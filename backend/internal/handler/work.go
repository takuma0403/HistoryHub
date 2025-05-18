package handler

import (
	"HistoryHub/internal/model"
	"HistoryHub/internal/service"
	"HistoryHub/internal/util"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type GetWorkResponse struct {
	ID          uuid.UUID `json:"id"`
	UserID      uuid.UUID `json:"userId"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	ImagePath   string    `json:"imagePath"`
	Link        string    `json:"link"`
	Period      string    `json:"period"`
	Use         string    `json:"use"`
}

type CreateWorkRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	ImagePath   string `json:"imagePath"`
	Link        string `json:"link"`
	Period      string `json:"period"`
	Use         string `json:"use"`
}

type UpadateWorkRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	ImagePath   string `json:"imagePath"`
	Link        string `json:"link"`
	Period      string `json:"period"`
	Use         string `json:"use"`
}

func GetWorksByUsername(c echo.Context) error {
	username := c.Param("username")
	UserID, err := service.GetUserIDByUsername(username)

	if err != nil {
		return c.JSON(http.StatusNotFound, err.Error())
	}

	works, err := service.GetWorksByUserID(UserID)
	if err != nil {
		return c.JSON(http.StatusNotFound, err.Error())
	}

	var res []GetWorkResponse
	for _, work := range works {
		res = append(res, GetWorkResponse{
			ID:          work.ID,
			UserID:      work.UserID,
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

func CreateWork(c echo.Context) error {
	UserID, err := util.GetUserIDFromJWT(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
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
		ID:          uuid.New(),
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

func UpadateWork(c echo.Context) error {
	UserID, err := util.GetUserIDFromJWT(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}

	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)

	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	name := c.FormValue("name")
	description := c.FormValue("description")
	link := c.FormValue("link")
	period := c.FormValue("period")
	use := c.FormValue("use")

	existing, err := service.GetWorkByID(id)
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
		ID:          id,
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
	_, err := util.GetUserIDFromJWT(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, err.Error())
	}

	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)

	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if err := service.DeleteWork(id); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, nil)
}
