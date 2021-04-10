from database.connection_profile import ConnectionProfile
from database.sql_type import SQLType

# Flask settings
debug_mode = True                                               # flask debug-mode (ignored for apache wsgi)
secret_key = "put-secret-key-here"                              # flask session secret key


# The Host and Port settings for the webserver
web_host = "0.0.0.0"                         # (ignored for apache)
web_port = 8080                              # (ignored for apache)
web_ssl = False                              # (ignored for apache)
ssl_keyfile = ""                             # (ignored for apache)
ssl_certfile = ""                            # (ignored for apache)


# Database Stuff:
# sql dialect and type
sql_dialect = SQLType.SQLITE

# default database

sql_host = '0.0.0.0'                         # (ignored for sqlite)
sql_port = 3306                              # (ignored for sqlite)
sql_database = 'static/db/db.sqlite'         # (path to db file for sqlite)
sql_username = 'user'                        # (ignored for sqlite)
sql_password = 'passwd'                      # (ignored for sqlite)

# extra databases (not used -> ignore)
extra_mysql_databases = {
    'interface': ConnectionProfile(
        'localhost',
        3306,
        'database',
        'flask_user',
        'hello123'
    )
}
# database settings
use_extra_databases = False
connect_database_on_enable = True

temp_db_template = {
    "user_password_resets": {}  # do not remove stuff
}

max_upload_size = 1024  # in MB

plugin_report_types = ["inappropriate", "copyright", "other"]
user_report_types = ["inappropriate", "other"]

mailing_system_email_address = "support@unknown.domain"
mailing_system_email_password = "secret"
mailing_system_email_server = "smtp.unknown.domain"
mailing_system_email_port = 465  # Dont change! For some reason only this works?!

path_kelp_modules = "path/to/modules"
path_kelp_plugins = "path/to/plugins"
