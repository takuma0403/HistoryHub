package model

import (
	"time"

	"github.com/google/uuid"
)

type Profile struct {
	ID        uuid.UUID  `gorm:"type:uuid;primaryKey;column:id"`
	UserID    uuid.UUID  `gorm:"type:uuid;not null;uniqueIndex;column:user_id"`
	LastName  string     `gorm:"not null;column:last_name"`
	FirstName string     `gorm:"not null;column:first_name"`
	BirthDate *time.Time `gorm:"column:birth_date"`
	School    *string    `gorm:"column:school"`
	Hobby     *string    `gorm:"column:hobby"`
	CreatedAt time.Time  `gorm:"not null;column:created_at"`
	UpdatedAt time.Time  `gorm:"not null;column:updated_at"`
}
