package util

import (
	"errors"
	"time"
)

// 文字列からtime.Timeへの変換。空文字ならzero値返す。
func ParseBirthDate(birthDateStr string) (time.Time, error) {
	if birthDateStr == "" {
		return time.Time{}, nil // ゼロ値（DBでnullableならnull相当）
	}
	t, err := time.Parse(time.RFC3339, birthDateStr)
	if err != nil {
		return time.Time{}, errors.New("birthDate format is invalid. Use RFC3339 format")
	}
	return t, nil
}
