package model

import (
	"time"

	"github.com/google/uuid"
)

type Skill struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;column:id"`
	UserID      uuid.UUID `gorm:"type:uuid;not null;column:user_id"`
	Name        string    `gorm:"not null;column:name"`
	Description string    `gorm:"column:description"`
	IsMainSkill bool      `gorm:"column:is_main_skill"`
	CreatedAt   time.Time `gorm:"not null;column:created_at"`
	UpdatedAt   time.Time `gorm:"not null;column:updated_at"`
}
