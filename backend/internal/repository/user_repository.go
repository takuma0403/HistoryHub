package repository

import (
	"HistoryHub/internal/db"
	"HistoryHub/internal/model"
	"errors"
)

var ErrEmailAlreadyUsed = errors.New("this email address is already used")

func CreateUser(user *model.User) error {
	var existingUser model.User
	if err := db.DB.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		return ErrEmailAlreadyUsed
	}

	return db.DB.Create(user).Error
}

func CreateTmpUser(tmpUser *model.TmpUser) error {
	var existingUser model.User
	if err := db.DB.Where("email = ?", tmpUser.Email).First(&existingUser).Error; err == nil {
		return ErrEmailAlreadyUsed
	}

	var existingTmpUser model.TmpUser
	if err := db.DB.Where("email = ?", tmpUser.Email).First(&existingTmpUser).Error; err == nil {
		existingTmpUser.VerifyCode = tmpUser.VerifyCode
		existingTmpUser.Password = tmpUser.Password
		return db.DB.Save(&existingTmpUser).Error
	}

	return db.DB.Create(tmpUser).Error
}

func UpdateUser(user *model.User) error {
	return db.DB.Save(user).Error
}

func GetUserByID(id string) (*model.User, error) {
	var user model.User
	if err := db.DB.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, errors.New("user not found")
	}
	return &user, nil
}


func GetUserByEmail(email string) (*model.User, error) {
	var user model.User
	if err := db.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, errors.New("user not found")
	}
	return &user, nil
}

func GetTmpUserByEmail(email string) (*model.TmpUser, error) {
	var tmpUser model.TmpUser
	if err := db.DB.Where("email = ?", email).First(&tmpUser).Error; err != nil {
		return nil, errors.New("user not found")
	}
	return &tmpUser, nil
}