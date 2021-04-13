"""
Contains the database model for all users registered on the
website and handles removal of unverified users after a given
amount of time.
"""

from sqlalchemy import Column, Integer, String, Boolean, Text, BLOB, DateTime
from database.database_connection import database_engine as engine

import uuid
import base64
import datetime
import schedule
import markdown

from .user_suspend import UserSuspend
from utils import sql_utils


class User(engine.Model):
    """
    Represents a new user in the database/the database model for a user.

    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    password = Column(String(256))
    description = Column(Text(65000))
    avatar = Column(BLOB)
    email = Column(String(256), unique=True)
    created = Column(DateTime)
    activated = Column(Boolean)
    activation_code = Column(String(36), unique=True)
    admin = Column(Boolean)

    def __init__(self, username, password, email, description, avatar, activated=False, admin=False):
        self.username = username
        self.password = password

        self.email = email
        self.description = description
        self.avatar = avatar

        self.created = datetime.datetime.now()

        self.activated = activated
        self.activation_code = str(uuid.uuid4())
        self.admin = admin


class UserWebQuery:
    def __init__(self, user_model: User or None):

        whitelist = ["id", "username", "password", "email", "description", "avatar", "created", "activation_code", "activated", "admin"]

        if user_model is None:
            for obj in whitelist:
                setattr(self, obj, None)

        else:
            for obj in dir(user_model):
                if obj not in whitelist:
                    continue
                setattr(self, obj, getattr(user_model, obj))

    def get_json(self):
        return sql_utils.sql_to_json(self)

    def get_id(self) -> int:
        return self.id

    def get_username(self) -> str:
        return self.username

    def get_password(self) -> str:
        return self.password

    def get_email(self) -> str:
        return self.email

    def get_description(self, use_markdown=False) -> str:
        if use_markdown:
            return markdown.markdown(self.description)
        return self.description

    def get_avatar(self, html=False):
        if self.avatar:
            if html:
                return self.avatar
            return f"data:image/png;base64,{base64.b64encode(self.avatar).decode('utf-8')}"
        else:
            if html:
                import os.path as path
                from __init__ import working_dir
                with open(path.join(working_dir, "static/img/empty_user.png"), "rb") as f:
                    return f.read()
            return "/static/img/empty_user.png"

    def get_created(self) -> datetime:
        return self.created

    def get_activation_code(self) -> str:
        return self.activation_code

    def get_activated(self) -> str:
        return self.activated

    def get_admin(self) -> bool:
        return self.admin

    def get_suspended(self) -> bool:
        ban = UserSuspend.query.filter_by(username=self.username).first()
        banned = False
        if ban is not None and ban.active:
            banned = ban.infinite or ban.until > datetime.datetime.now()
            if not banned:
                engine.session.delete(ban)
                engine.session.commit()

        return banned

    def get_suspend_time(self):
        if not self.get_suspended():
            return False
        ban = UserSuspend.query.filter_by(username=self.username).first()
        if ban.infinite:
            return -1
        return ban.until

    def get_suspend_timestamp(self) -> int or bool:
        if not self.get_suspended():
            return False
        ban = UserSuspend.query.filter_by(username=self.username).first()
        if ban.infinite:
            return -1
        return datetime.datetime.timestamp(ban.until)

    def get_suspend_message(self) -> str or bool:
        if not self.get_suspended():
            return False
        return markdown.markdown(UserSuspend.query.filter_by(username=self.username).first().message)


#
# User Schedules
#

def _check_for_old_unverified_and_delete():
    """
    Iterates all unverified users and deletes their account if
    it is older than 48 hours.
    """

    users = User.query.filter_by(activated=False).filter(User.created < datetime.datetime.now() - datetime.timedelta(hours=48)).all()

    for user in users:
        engine.session.delete(user)
    engine.session.commit()


# deletes accounts older than 48 hours every 12 hours.
schedule.every(12).hours.do(_check_for_old_unverified_and_delete)
