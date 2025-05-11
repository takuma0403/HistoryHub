package service

import (
	"HistoryHub/internal/model"
	"HistoryHub/internal/repository"
	"time"

	"github.com/google/uuid"
)

func CreateWork(work model.Work) error {
	if err := repository.CreateWork(work); err != nil {
		return err
	}
	return nil
}

func UpdateWork(work model.Work) error {
	work.UpdatedAt = time.Now()
	if err := repository.UpdateWork(work); err != nil {
		return err
	}
	return nil
}

func DeleteWork(WorkID uint) error {
	if err := repository.DeleteWorkByID(WorkID); err != nil {
		return err
	}
	return nil
}

func GetWorkByID(WorkID uint) (*model.Work, error) {
	work, err := repository.GetWorkByID(WorkID)
	if err != nil {
		return nil, err
	}
	return work, nil
}

func GetWorksByUserID(UserID uuid.UUID) ([]model.Work, error) {
	works, err := repository.GetWorksByUserID(UserID)
	if err != nil  {
		return nil, err
	}
	return works, nil
}