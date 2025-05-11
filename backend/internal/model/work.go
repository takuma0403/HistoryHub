package model

import (
	"time"

	"github.com/google/uuid"
)

type Work struct {
	ID          uint      `gorm:"primaryKey;autoIncrement"`
	UserID      uuid.UUID `gorm:"type:uuid;not null"`
	Name        string    `gorm:"not null"`
	Description string
	ImagePath   string
	Link        string
	Period      string
	Use         string
	CreatedAt   time.Time `gorm:"not null"`
	UpdatedAt   time.Time `gorm:"not null"`
}