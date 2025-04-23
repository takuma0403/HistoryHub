package model

type SmtpServerConfig struct {
    SmtpServer   string `yaml:"smtpserver"`
    SmtpPort     int    `yaml:"smtpport"`
    AuthAddress  string `yaml:"authaddress"`
    AuthPassword string `yaml:"authpassword"`
}