package model

import (
	"time"

	"github.com/google/uuid"
)

type TmpUser struct {
	ID         uint      `gorm:"primaryKey;autoIncrement;column:id"`
	Email      string    `gorm:"unique;not null;column:email"`
	Password   string    `gorm:"not null;column:password"`
	VerifyCode string    `gorm:"size:6;not null;column:verify_code"`
	CreatedAt  time.Time `gorm:"not null;column:created_at"`
}

type User struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;column:id"`
	Email     string    `gorm:"unique;not null;column:email"`
	Password  string    `gorm:"not null;column:password"`
	Username  string    `gorm:"unique;not null;column:username"`
	CreatedAt time.Time `gorm:"not null;column:created_at"`
	UpdatedAt time.Time `gorm:"not null;column:updated_at"`

	Profile Profile `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Works   []Work  `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Skills  []Skill `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
