package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func Sample(c echo.Context) error {
	return c.JSON(http.StatusOK, "Api Auth OK")
}