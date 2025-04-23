package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gopkg.in/yaml.v3"
)

func LoadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}
}

func GetEnv(key string) string {
	value := os.Getenv(key)
	if value == "" {
		log.Printf("Warning: %s is not set in .env\n", key)
	}
	return value
}

func expandEnv(s string) string {
	return os.ExpandEnv(s)
}

func LoadYAMLConfig(path string, out interface{}) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	yamlString := expandEnv(string(data))

	err = yaml.Unmarshal([]byte(yamlString), out)
	if err != nil {
		return err
	}

	return nil
}
