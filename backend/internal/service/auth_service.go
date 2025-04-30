package service

import (
	"HistoryHub/internal/config"
	"HistoryHub/internal/model"
	"HistoryHub/internal/repository"
	"HistoryHub/internal/util"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Claims struct {
	UserID uint `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

func SignUp(email, password string) error {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	code, err := util.GenerateVerificationCode()
	if err != nil {
		return err
	}

	tmpUser := &model.TmpUser{
		Email:      email,
		Password:   string(hashedPassword),
		VerifyCode: code,
		CreatedAt:  time.Now(),
	}

	repository.CreateTmpUser(tmpUser)

	return util.SendVerificationEmail(email, code)
}

func VerifyEmail(email, code string) error {
	tmpUser, err := repository.GetTmpUserByEmail(email)
	if err != nil {
		return errors.New("user not found")
	}
	if tmpUser.VerifyCode != code {
		return errors.New("invalid verification code")
	}

	user := &model.User{
		Email:     tmpUser.Email,
		Password:  tmpUser.Password,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	return repository.CreateUser(user)
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
		UserID: user.ID,
		Email:  user.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	})
	tokenString, err := token.SignedString([]byte(config.GetEnv("JWT_SECRET")))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
