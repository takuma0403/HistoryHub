package service

import (
	"HistoryHub/internal/model"
	"HistoryHub/internal/repository"
	"errors"
	"time"

	"github.com/google/uuid"
)

func CreateSkill(UserID uuid.UUID, skill model.Skill) error {
	profile, err := repository.GetProfileByUserID(UserID)
	if err != nil {
		return err
	}

	skill.ProfileID = profile.ID
	skill.CreatedAt = time.Now()
	skill.UpdatedAt = time.Now()

	if err := repository.CreateSkill(skill); err != nil {
		return err
	}
	return nil
}

func UpdateSkill(UserID uuid.UUID, skill model.Skill) error {
	profile, _ := repository.GetProfileByUserID(UserID)
	preSkill, _ := repository.GetSkillByID(skill.ID)
	if profile.ID != preSkill.ProfileID {
		return errors.New("skill not yours")
	}
	skill.ProfileID = profile.ID
	skill.UpdatedAt = time.Now()
	if err := repository.UpdateSkill(skill); err != nil {
		return err
	}
	return nil
}

func DeleteSkill(UserID uuid.UUID, id uint) error {
	profile, _ := repository.GetProfileByUserID(UserID)
	preSkill, _ := repository.GetSkillByID(id)
	if profile.ID != preSkill.ProfileID {
		return errors.New("skill not yours")
	}
	if err := repository.DeleteSkillByID(id); err != nil {
		return err
	}
	return nil
}

func GetSkills(UserID uuid.UUID) ([]model.Skill, error) {
	profile, err := repository.GetProfileByUserID(UserID)
	if err != nil  {
		return nil, err
	}
	skills, err := repository.GetSkillsByID(profile.ID)
	if err != nil  {
		return nil, err
	}
	return skills, nil
}