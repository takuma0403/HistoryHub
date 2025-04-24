package db

import (
	"context"
	"log"
	"time"

	"HistoryHub/internal/model"

	"gorm.io/gorm"
)

type GormCleaner struct {
	DB       *gorm.DB
	Interval time.Duration
}

func NewGormCleaner(db *gorm.DB, interval time.Duration) *GormCleaner {
	return &GormCleaner{DB: db, Interval: interval}
}

func (c *GormCleaner) Run(ctx context.Context) {
	ticker := time.NewTicker(c.Interval)
	go func() {
		defer ticker.Stop()
		for {
			select {
			case <-ticker.C:
				if err := c.CleanupOnce(); err != nil {
					log.Printf("[GormCleaner] error: %v", err)
				} else {
					log.Println("[GormCleaner] cleaned expired tmp_users")
				}
			case <-ctx.Done():
				log.Println("[GormCleaner] stopping")
				return
			}
		}
	}()
}

func (c *GormCleaner) CleanupOnce() error {
	return c.DB.
		Where("expires_at < ?", time.Now()).
		Delete(model.TmpUser{}).
		Error
}
