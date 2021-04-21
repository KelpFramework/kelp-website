from __init__ import *
from user_data.user_auth import admin_required

from utils import web_stats


@app.route("/acp")
@admin_required
def acp_index():
    return render_template(
        "acp/acp_index.html",
        stats=web_stats.Stats
    )









from .admin_r import acp_extension_routes, acp_plugins_routes, acp_user_routes
