from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, BLOB
from database.database_connection import database_engine as engine

from datetime import datetime
import uuid


class KelpModule(engine.Model):
    __tablename__ = "kelp_modules"

    id = Column(Integer, primary_key=True)
    module_name = Column(String(128))
    creator = Column(String(50))
    description = Column(Text(65000))
    short_description = Column(String(512))
    picture = Column(BLOB)
    uuid = Column(String(256), unique=True)
    downloads = Column(Integer, default=0)
    up_votes = Column(Integer, default=0)
    down_votes = Column(Integer, default=0)
    created = Column(DateTime)
    pinned = Column(Boolean)

    def __init__(self, ident, module_name, creator, short_description, description, picture, pinned=False):
        self.module_name = module_name
        self.creator = creator
        self.short_description = short_description
        self.description = description
        self.picture = picture
        self.uuid = ident
        self.created = datetime.now()
        self.pinned = pinned
