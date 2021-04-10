import smtplib
import threading
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import configuration
from __init__ import render_template, application_name


def send_email(receiver, content: MIMEMultipart, subject):
    def send():
        content["Subject"] = f"{application_name} {subject}"
        content["From"] = f"{application_name} <{configuration.mailing_system_email_address}>"
        content["To"] = receiver

        smtp_server_address = (
            configuration.mailing_system_email_server,
            configuration.mailing_system_email_port,
        )
        smtp_server_credentials = (
            configuration.mailing_system_email_address,
            configuration.mailing_system_email_password
        )

        with smtplib.SMTP_SSL(*smtp_server_address) as smtp_server:
            smtp_server.login(*smtp_server_credentials)
            smtp_server.sendmail(
                configuration.mailing_system_email_address,
                receiver,
                content.as_string()
            )

    threading.Thread(target=send, daemon=True).start()


def send_verification_email(receiver, verification_code):
    email_content = MIMEMultipart("alternative")
    email_content.attach(MIMEText(
        render_template("email_templates/verification_email.html", code=verification_code),
        "html"
    ))

    send_email(receiver, email_content, "Account Verification")


def send_user_password_reset_email(receiver, code):
    email_content = MIMEMultipart("alternative")
    email_content.attach(MIMEText(
        render_template("email_templates/password_reset_email.html", code=code),
        "html"
    ))

    send_email(receiver, email_content, "Password Reset")
