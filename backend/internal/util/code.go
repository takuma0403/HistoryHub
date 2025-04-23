package util

import (
	"crypto/rand"
	"fmt"
	"math/big"
)

func GenerateVerificationCode() (string, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(1000000)) // 0 ~ 999999
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n), nil
}
