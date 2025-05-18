package service

import (
	"HistoryHub/internal/model"
	"HistoryHub/internal/repository"
	"errors"
	"time"
)

func CreateProfile(profile model.Profile) error {
	preProfile, _ := repository.GetProfileByUserID(profile.UserID.String())

	if preProfile != nil {
		return errors.New("profile already created")
	}

	profile.CreatedAt = time.Now()
	profile.UpdatedAt = time.Now()

	if err := repository.CreateProfile(profile); err != nil {
		return err
	}
	return nil
}

func UpdateProfile(profile model.Profile) error {
	preProfile, err := repository.GetProfileByUserID(profile.UserID.String())

	if err != nil {
		return err
	}

	if preProfile == nil {
		return errors.New("profile not found")
	}

	profile.ID = preProfile.ID
	profile.UpdatedAt = time.Now()

	if err := repository.UpdateProfile(profile); err != nil {
		return err
	}
	return nil
}

func GetProfile(UserID string) (*model.Profile, error) {
	profile, err := repository.GetProfileByUserID(UserID)
	if err != nil  {
		return nil, err
	}
	return profile, nil
}