from sqlalchemy import Column, Integer, String, DateTime, Text
from database.database_connection import database_engine as engine

from datetime import datetime


class KelpPluginReport(engine.Model):
    __tablename__ = "kelp_plugins_reports"

    id = Column(Integer, primary_key=True)
    plugin_uuid = Column(String(36))
    creator = Column(String(50))
    type = Column(String(50))
    description = Column(Text(65000))
    created = Column(DateTime)

    def __init__(self, plugin_uuid, creator, description, report_type):
        self.plugin_uuid = plugin_uuid
        self.creator = creator
        self.description = description
        self.type = report_type
        self.created = datetime.now()
