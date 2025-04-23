package util

import (
	"HistoryHub/internal/config"
	"HistoryHub/internal/model"
	"crypto/tls"
	"fmt"
	"net/smtp"
)

func SendVerificationEmail(email, code string) error {
	fmt.Printf("Sending email to %s with code: %s\n", email, code)

	subject := "【認証コード】HistoryHub アカウント登録の確認"
	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html lang="ja">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>認証コードの確認</title>
			<style>
				body {
					font-family: Arial, sans-serif;
					background-color: #f4f4f4;
					padding: 20px;
					margin: 0;
					font-size: medium;
				}
				.container {
					max-width: 500px;
					background: white;
					padding: 20px;
					border-radius: 10px;
					box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
				}
				.code {
					font-size: larger;
					font-weight: bold;
					color: #ffffff;
					background-color: #a340ff;
					padding: 12px 84px;
					border-radius: 8px;
					display: inline-block;
					cursor: pointer;
				}
				.footer {
					margin-top: 20px;
					font-size: 12px;
					color: #666;
					text-align: center;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<h3>【認証コード】アカウント登録の確認</h3>
				<p>以下の認証コードを入力して、アカウント登録を完了してください。</p>
				<h4>認証コード:</h4>
				<div class="code">
					%s
				</div>
				<p>※本メールに心当たりがない場合は、このメールを削除してください。</p>
				<div class="footer">
					<p>&copy; HistoryHub サポート</p>
				</div>
			</div>
		</body>
		</html>`, code)

	return SmtpSendMail(email, subject, body, true)
}

func SmtpSendMail(mailAddress, mailSubject, mailBody string, isHTML bool) error {
	var smtpConfig model.SmtpServerConfig
	if err := config.LoadYAMLConfig("internal/config/smtpserver.yaml", &smtpConfig); err != nil {
		return err
	}

	// メールヘッダー
	contentType := "text/plain; charset=\"UTF-8\""
	if isHTML {
		contentType = "text/html; charset=\"UTF-8\""
	}

	// メールデータ作成
	msg := []byte(fmt.Sprintf("To: %s\r\n"+
		"Subject: %s\r\n"+
		"MIME-Version: 1.0\r\n"+
		"Content-Type: %s\r\n"+
		"\r\n"+
		"%s\r\n",
		mailAddress, mailSubject, contentType, mailBody))

	// SMTP認証情報
	auth := smtp.PlainAuth("", smtpConfig.AuthAddress, smtpConfig.AuthPassword, smtpConfig.SmtpServer)

	// TLS接続の設定
	tlsConfig := &tls.Config{
		InsecureSkipVerify: false,
		ServerName:         smtpConfig.SmtpServer,
	}

	// SMTPサーバーにTLS接続
	conn, err := tls.Dial("tcp", smtpConfig.SmtpServer+":465", tlsConfig)
	if err != nil {
		return err
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, smtpConfig.SmtpServer)
	if err != nil {
		return err
	}
	defer client.Close()

	// 認証
	if err = client.Auth(auth); err != nil {
		return err
	}

	// メール送信
	if err = client.Mail(smtpConfig.AuthAddress); err != nil {
		return err
	}
	if err = client.Rcpt(mailAddress); err != nil {
		return err
	}

	wc, err := client.Data()
	if err != nil {
		return err
	}
	defer wc.Close()

	_, err = wc.Write(msg)
	if err != nil {
		return err
	}

	return client.Quit()
}
