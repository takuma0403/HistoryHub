package model

import "time"

type Skill struct {
	ID          uint   `gorm:"primaryKey;autoIncrement"`
	ProfileID   uint   `gorm:"index;not null"`
	Name        string `gorm:"not null"`
	Description string
	IsMainSkill bool
	CreatedAt   time.Time `gorm:"not null"`
	UpdatedAt   time.Time `gorm:"not null"`
}
