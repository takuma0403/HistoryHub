package service

import (
	"context"
)

type CleanerInterface interface {
	Run(ctx context.Context)
	CleanupOnce() error
}

type CleanupService struct {
	cleaner CleanerInterface
}

func NewCleanupService(cleaner CleanerInterface) *CleanupService {
	return &CleanupService{cleaner: cleaner}
}

func (s *CleanupService) Start(ctx context.Context) {
	s.cleaner.Run(ctx)
}

func (s *CleanupService) CleanupNow() error {
	return s.cleaner.CleanupOnce()
}
