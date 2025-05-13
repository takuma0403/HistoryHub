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

func GetUsername(id uuid.UUID) (string, error) {
	user, err := repository.GetUserByID(id)
	return user.Username, err
}

func GetUserIDByUsername(username string) (uuid.UUID, error) {
	user, err := repository.GetUserByUsername(username)
	return user.ID, err
}