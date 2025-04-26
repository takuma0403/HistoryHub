package model

import (
	"time"
)

type TmpUser struct {
    ID           uint      `gorm:"primaryKey;autoIncrement"`
    Email        string    `gorm:"unique;not null"`
    Password string    `gorm:"not null"`
    VerifyCode   string    `gorm:"size:6;not null"`
    CreatedAt    time.Time `gorm:"not null"`
}

type User struct {
    ID           uint      `gorm:"primaryKey;autoIncrement"`
    Email        string    `gorm:"unique;not null"`
    Password string    `gorm:"not null"`
    CreatedAt    time.Time `gorm:"not null"`
    UpdatedAt    time.Time `gorm:"not null"`
}
