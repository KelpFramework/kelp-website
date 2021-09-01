from flask import *

from utils.stop_codes import StopCodes
from database.global_temp_db import TempDatabase
from datetime import timedelta
import configuration
import os

application_host = "unknown.domain"
application_url = "kelp.unknown.domain"
application_name = "Kelp Framework"
application_version = "beta-0.89.8"

working_dir = os.path.dirname(os.path.realpath(__file__))
temp_db = TempDatabase(configuration.temp_db_template)


app = Flask(__name__)
app.secret_key = configuration.secret_key
app.config["MAX_CONTENT_LENGTH"] = configuration.max_upload_size * 1024 * 1024
app.permanent_session_lifetime = timedelta(days=365)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"


from routes import context_processor
from routes import main_routes, side_routes, user_routes, admin_routes, auth_routes, error_routes
from routes.pages import extensions_routes, plugins_routes, code_generator_routes
