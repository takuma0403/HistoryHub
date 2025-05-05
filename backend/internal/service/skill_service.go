package service

import (
	"HistoryHub/internal/model"
	"HistoryHub/internal/repository"
	"errors"
	"time"
)

func CreateSkill(UserID string, skill model.Skill) error {
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

func UpdateSkill(UserID string, skill model.Skill) error {
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

func DeleteSkill(UserID string, id uint) error {
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
