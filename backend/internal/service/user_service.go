package service

import (
	"HistoryHub/internal/repository"
	"errors"

	"github.com/google/uuid"
)

func UpdateUsername(id uuid.UUID, username string) error {
	user, err := repository.GetUserByID(id)
	if err != nil {
		return errors.New("user not found")
	}

	user.Username = username

	return repository.UpdateUser(user)
}