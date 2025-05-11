package repository

import (
	"HistoryHub/internal/db"
	"HistoryHub/internal/model"
	"errors"

	"github.com/google/uuid"
)

func CreateWork(work model.Work) error {
	if err := db.DB.Create(&work).Error; err != nil {
		return err
	}
	return nil
}

func UpdateWork(work model.Work) error {	
	if err := db.DB.Save(&work).Error; err != nil {
		return err
	}
	return nil
}

func DeleteWorkByID(id uint) error {
	if err := db.DB.Delete(&model.Work{}, id).Error; err != nil {
		return err
	}
	return nil
}

func GetWorkByID(id uint)  (*model.Work, error) {
	var work model.Work
	if err := db.DB.Where("id = ?", id).First(&work).Error; err != nil {
		return nil, errors.New("work not found")
	}
	return &work, nil
}

func GetWorksByUserID(UserID uuid.UUID) ([]model.Work, error) {
	var works []model.Work
	if err := db.DB.Where("user_id = ?", UserID).Find(&works).Error; err != nil {
		return nil, err
	}
	if len(works) == 0 {
		return nil, errors.New("no works found")
	}
	return works, nil
}