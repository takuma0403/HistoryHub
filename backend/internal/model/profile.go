package model

import (
	"time"

	"github.com/google/uuid"
)

type Profile struct {
	ID        uint      `gorm:"primaryKey;autoIncrement"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;uniqueIndex"`
	LastName  string    `gorm:"not null"`
	FirstName string    `gorm:"not null"`
	BirthDate time.Time
	School    string
	Hobby     string
	Skills    []Skill   `gorm:"foreignKey:ProfileID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CreatedAt time.Time `gorm:"not null"`
	UpdatedAt time.Time `gorm:"not null"`
}
