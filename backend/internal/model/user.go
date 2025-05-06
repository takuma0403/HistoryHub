package model

import (
	"time"

	"github.com/google/uuid"
)

type TmpUser struct {
	ID         uint      `gorm:"primaryKey;autoIncrement"`
	Email      string    `gorm:"unique;not null"`
	Password   string    `gorm:"not null"`
	VerifyCode string    `gorm:"size:6;not null"`
	CreatedAt  time.Time `gorm:"not null"`
}

type User struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	Email     string    `gorm:"unique;not null"`
	Password  string    `gorm:"not null"`
	Username  string    `gorm:"unique;not null"`
	CreatedAt time.Time `gorm:"not null"`
	UpdatedAt time.Time `gorm:"not null"`

	Profile Profile `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

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

type Skill struct {
	ID          uint      `gorm:"primaryKey;autoIncrement"`
	ProfileID   uint      `gorm:"index;not null"`
	Name        string    `gorm:"not null"`
	Description string
	IsMainSkill bool
	CreatedAt   time.Time `gorm:"not null"`
	UpdatedAt   time.Time `gorm:"not null"`
}
