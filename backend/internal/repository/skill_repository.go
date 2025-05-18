package repository

import (
	"HistoryHub/internal/db"
	"HistoryHub/internal/model"
	"errors"

	"github.com/google/uuid"
)

func GetSkillByID(id uuid.UUID) (*model.Skill, error) {
	var skill model.Skill
	if err := db.DB.Where("id = ?", id).First(&skill).Error; err != nil {
		return nil, errors.New("skill not found")
	}
	return &skill, nil
}

func GetSkillsByUserID(UserID uuid.UUID) ([]model.Skill, error) {
	var skills []model.Skill
	if err := db.DB.Where("user_id = ?", UserID).Find(&skills).Error; err != nil {
		return nil, err
	}
	if len(skills) == 0 {
		return nil, errors.New("no skills found")
	}
	return skills, nil
}

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

func DeleteSkillByID(id uuid.UUID) error {
	if err := db.DB.Delete(&model.Skill{}, id).Error; err != nil {
		return err
	}
	return nil
}
