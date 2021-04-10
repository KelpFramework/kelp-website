from sqlalchemy import Column, Integer, String, Text, BLOB, BigInteger
from database.database_connection import database_engine as engine

import time
import uuid


class KelpPlugin(engine.Model):
    __tablename__ = "kelp_plugins"

    id = Column(Integer, primary_key=True)
    plugin_name = Column(String(128))
    creator = Column(String(50))
    description = Column(Text(65000))
    short_description = Column(String(512))
    icon = Column(BLOB)
    banner = Column(BLOB)
    uuid = Column(String(36), unique=True)
    downloads = Column(Integer, default=0)
    up_votes = Column(Integer, default=0)
    down_votes = Column(Integer, default=0)
    created = Column(BigInteger)
    updated = Column(BigInteger)
    tags = Column(String(512))

    def __init__(self, plugin_name, creator, short_description, description, icon, banner, tags: list):
        self.plugin_name = plugin_name
        self.creator = creator
        self.short_description = short_description
        self.description = description
        self.icon = icon
        self.banner = banner
        self.tags = ",".join(tags)
        self.uuid = str(uuid.uuid4())
        self.created = time.time()
        self.updated = time.time()
