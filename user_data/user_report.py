from sqlalchemy import Column, Integer, String, DateTime, Text
from database.database_connection import database_engine as engine

from datetime import datetime


class UserReport(engine.Model):
    __tablename__ = "users_reports"

    id = Column(Integer, primary_key=True)
    username = Column(String(36))
    creator = Column(String(50))
    type = Column(String(50))
    description = Column(Text(65000))
    created = Column(DateTime)

    def __init__(self, username, creator, description, report_type):
        self.username = username
        self.creator = creator
        self.description = description
        self.type = report_type
        self.created = datetime.now()
