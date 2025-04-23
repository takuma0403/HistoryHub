package service

import (
	"HistoryHub/internal/model"
	"HistoryHub/internal/repository"
	"HistoryHub/internal/util"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

func SignUp(email, password string) error {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	code, err := util.GenerateVerificationCode()
	if err != nil {
		return err
	}

	user := &model.User{
		Email:    email,
		Password: string(hashedPassword),
		Verified: false,
		Code:     code,
	}

	repository.CreateUser(user)

	return util.SendVerificationEmail(email, code)
}

func VerifyEmail(email, code string) error {
	user, err := repository.GetUserByEmail(email)
	if err != nil {
		return errors.New("user not found")
	}
	if user.Code != code {
		return errors.New("invalid verification code")
	}

	user.Verified = true
	return repository.UpdateUser(user)
}

func Login(email, password string) (string, error) {
	user, err := repository.GetUserByEmail(email)
	if err != nil {
		return "", errors.New("user not found")
	}
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) != nil {
		return "", errors.New("invalid credentials")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, Claims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	})
	tokenString, err := token.SignedString([]byte("your-secret"))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
