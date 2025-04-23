package repository

import (
	"HistoryHub/internal/db"
	"HistoryHub/internal/model"
	"errors"
)

func CreateUser(user *model.User) error {
	var existingUser model.User
	if err := db.DB.Where("email = ? AND verified = ?", user.Email, false).First(&existingUser).Error; err == nil {
		existingUser.Code = user.Code
		return db.DB.Save(&existingUser).Error
	}

	return db.DB.Create(user).Error
}

func UpdateUser(user *model.User) error {
	return db.DB.Save(user).Error
}

func GetUserByEmail(email string) (*model.User, error) {
	var user model.User
	if err := db.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, errors.New("user not found")
	}
	return &user, nil
}
