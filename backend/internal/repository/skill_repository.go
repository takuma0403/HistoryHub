package repository

import (
	"HistoryHub/internal/db"
	"HistoryHub/internal/model"
	"errors"
)

func CreateSkill(skill model.Skill) error {
	if err := db.DB.Create(&skill).Error; err != nil {
		return err
	}
	return nil
}

func UpdateSkill(skill model.Skill) error {
	if err := db.DB.Save(&skill).Error; err != nil {
		return err
	}
	return nil
}

func DeleteSkillByID(id uint) error {
	if err := db.DB.Delete(&model.Skill{}, id).Error; err != nil {
		return err
	}
	return nil
}

func GetSkillByID(id uint)  (*model.Skill, error) {
	var skill model.Skill
	if err := db.DB.Where("id = ?", id).First(&skill).Error; err != nil {
		return nil, errors.New("skill not found")
	}
	return &skill, nil
}