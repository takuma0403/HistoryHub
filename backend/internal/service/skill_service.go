package service

import (
	"HistoryHub/internal/model"
	"HistoryHub/internal/repository"
	"time"

	"github.com/google/uuid"
)

func GetSkillsByUserID(UserID uuid.UUID) ([]model.Skill, error) {
	skills, err := repository.GetSkillsByUserID(UserID)
	if err != nil {
		return nil, err
	}
	return skills, nil
}

func CreateSkill(skill model.Skill) error {
	skill.CreatedAt = time.Now()
	skill.UpdatedAt = time.Now()
	if err := repository.CreateSkill(skill); err != nil {
		return err
	}
	return nil
}

func UpdateSkill(skill model.Skill) error {
	skill.UpdatedAt = time.Now()
	if err := repository.UpdateSkill(skill); err != nil {
		return err
	}
	return nil
}

func DeleteSkill(id uuid.UUID) error {
	if err := repository.DeleteSkillByID(id); err != nil {
		return err
	}
	return nil
}
