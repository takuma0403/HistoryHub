package util

import (
	"regexp"
	"strings"
)

func SanitizeUsername(input string) string {
	at := strings.Index(input, "@")
	if at == -1 {
		at = len(input)
	}
	base := input[:at]
	re := regexp.MustCompile(`[^a-zA-Z0-9_-]`)
	return re.ReplaceAllString(strings.ToLower(base), "")
}