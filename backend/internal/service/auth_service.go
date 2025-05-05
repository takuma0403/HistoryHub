package service

import (
	"HistoryHub/internal/config"
	"HistoryHub/internal/model"
	"HistoryHub/internal/repository"
	"HistoryHub/internal/util"
	"errors"
	"regexp"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type Claims struct {
	ID uuid.UUID `json:"id"`
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

	err = repository.CreateTmpUser(tmpUser)
	if err != nil {
		return err
	}

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

	username := _sanitizeUsername(tmpUser.Email)

	user := &model.User{
		ID:        uuid.New(),
		Email:     tmpUser.Email,
		Password:  tmpUser.Password,
		Username:  username,
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
		ID: user.ID,
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

func _sanitizeUsername(input string) string {
	at := strings.Index(input, "@")
	if at == -1 {
		at = len(input)
	}
	base := input[:at]
	re := regexp.MustCompile(`[^a-zA-Z0-9_-]`)
	return re.ReplaceAllString(strings.ToLower(base), "")
}