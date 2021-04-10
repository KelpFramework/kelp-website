from flask_sqlalchemy import SQLAlchemy
from database.connection_profile import ConnectionProfile
from __init__ import app

import configuration


database_engine = SQLAlchemy(app)


def connect_if_required():
    print('Initializing Database')
    if configuration.connect_database_on_enable:
        print("connection required on startup! connecting...")
        main_profile = ConnectionProfile(
            configuration.sql_host,
            configuration.sql_port,
            configuration.sql_database,
            configuration.sql_username,
            configuration.sql_password
        )
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        app.config['SQLALCHEMY_DATABASE_URI'] = main_profile.connection_uri(configuration.sql_dialect)

        print("connected")

        if configuration.use_extra_databases and len(configuration.extra_mysql_databases) != 0:
            print("connecting to extra db...")
            extra_db = {}

            for key, value in configuration.extra_mysql_databases.items():
                extra_db[key] = value.connection_uri()

            app.config['SQLALCHEMY_BINDS'] = extra_db

            print("connected to extra db")

        return True
    return False
