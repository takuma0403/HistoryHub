package repository

import (
	"HistoryHub/internal/db"
	"HistoryHub/internal/model"
	"errors"

	"github.com/google/uuid"
)

func CreateProfile(profile model.Profile) error {
	if err := db.DB.Create(&profile).Error; err != nil {
		return err
	}
	return nil
}

func UpdateProfile(profile model.Profile) error {
	
	if err := db.DB.Save(&profile).Error; err != nil {
		return err
	}
	return nil
}

func GetProfileByID(id string)  (*model.Profile, error) {
	var profile model.Profile
	if err := db.DB.Where("id = ?", id).First(&profile).Error; err != nil {
		return nil, errors.New("profile not found")
	}
	return &profile, nil
}

func GetProfileByUserID(UserID uuid.UUID)  (*model.Profile, error) {
	var profile model.Profile
	if err := db.DB.Where("user_id = ?", UserID).First(&profile).Error; err != nil {
		return nil, errors.New("profile not found")
	}
	return &profile, nil
}