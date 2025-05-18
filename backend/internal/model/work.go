package model

import (
	"time"

	"github.com/google/uuid"
)

type Work struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;column:id"`
	UserID      uuid.UUID `gorm:"type:uuid;not null;column:user_id"`
	Name        string    `gorm:"not null;column:name"`
	Description string    `gorm:"column:description"`
	ImagePath   string    `gorm:"column:image_path"`
	Link        string    `gorm:"column:link"`
	Period      string    `gorm:"column:period"`
	Use         string    `gorm:"column:use"`
	CreatedAt   time.Time `gorm:"not null;column:created_at"`
	UpdatedAt   time.Time `gorm:"not null;column:updated_at"`
}
