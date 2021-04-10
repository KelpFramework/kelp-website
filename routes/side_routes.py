from __init__ import *
from utils import search_utils
from utils import api_utils


# rest api
from kelp_plugins import kelp_plugin_repo


@app.route("/favicon")
@app.route("/favicon.ico")
@app.route("/favicon.png")
def asset_favicon():
    return send_from_directory(f"{app.root_path}/static/", "favicon.png", mimetype="image/vnd.microsoft.icon")


@app.route("/search_engine")
def search_engine():
    sorted_return = list()

    search = request.args.get("search")

    if search:
        for hit in search_utils.search_all_by_string(search):
            sorted_return.append(hit)

    if "q-search" in request.args:
        return render_template(
            "search_nav.html",
            hits=sorted_return
        )

    return api_utils.craft_response(
        sorted_return, 200
    )


# rest api

@app.route("/api/plugins/tags")
def api_plugin_tags():
    return {"tags": kelp_plugin_repo.get_all_tags()}
