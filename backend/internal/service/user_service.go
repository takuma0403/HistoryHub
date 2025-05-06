package service

import (
	"HistoryHub/internal/repository"
	"errors"
)

func UpdateUsername(id, username string) error {
	user, err := repository.GetUserByID(id)
	if err != nil {
		return errors.New("user not found")
	}

	user.Username = username

	return repository.UpdateUser(user)
}

func GetUsername(id string) (string, error) {
	user, err := repository.GetUserByID(id)
	return user.Username, err
}