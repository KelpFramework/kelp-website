"""
This file handles email traffic caused by the kelp website,
which is used to verify user accounts or reset user passwords.

The email credentials can be set up in the configuration file.
"""

import smtplib
import threading
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import configuration
from __init__ import render_template, application_name


def send_email(receiver, content: MIMEMultipart, subject):
    """
    Sends an email to the given recipient with the credentials
    and name set up in the app config. The application name will be
    used as sender display name.

    :param receiver:    The email address of the recipient.
    :param content:     The content of the email address to send.
    :param subject:     The subject of the email.
    """
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

    # send the mail via async thread to avoid UI inconveniences
    threading.Thread(target=send, daemon=True).start()


def send_verification_email(receiver, verification_code):
    """
    Sends the account verification email to a given email address.
    This function automatically constructs the html content for the page,
    so you only have to pass the verification code, which will then be inserted
    accordingly.

    :param receiver:            The email address of the user you want to send the
                                email to. A user name/uuid is not valid here.
    :param verification_code:   The verification code to send to the user.
    """
    email_content = MIMEMultipart("alternative")
    email_content.attach(MIMEText(
        render_template("email_templates/verification_email.html", code=verification_code),
        "html"
    ))

    send_email(receiver, email_content, "Account Verification")


def send_user_password_reset_email(receiver, code):
    """
    Sends the password reset email to the given recipient.

    :param receiver:    The email address of the user you want to send the email to.
                        A user name or uuid is not valid here.
    :param code:        The password reset code to apply to display in the email.
    """
    email_content = MIMEMultipart("alternative")
    email_content.attach(MIMEText(
        render_template("email_templates/password_reset_email.html", code=code),
        "html"
    ))

    send_email(receiver, email_content, "Password Reset")
