package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
    ID        uint      `gorm:"primaryKey"`
    CreatedAt time.Time
    UpdatedAt time.Time
    DeletedAt gorm.DeletedAt `gorm:"index"`
    Email     string    `json:"email" gorm:"unique"`
    Password  string    `json:"password"`
    Verified  bool      `json:"verified"`
    Code      string    `json:"code"`
}

type TmpUser struct {
    ID        uint      `gorm:"primaryKey"`
    CreatedAt time.Time
    UpdatedAt time.Time
    DeletedAt gorm.DeletedAt `gorm:"index"`
    Email     string    `json:"email" gorm:"unique"`
    Password  string    `json:"password"`
    Verified  bool      `json:"verified"`
    Code      string    `json:"code"`
}