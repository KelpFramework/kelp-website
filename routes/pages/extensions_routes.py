from __init__ import app, render_template, request, send_file
from kelp_modules import kelp_module_repo
from utils import api_utils


@app.route("/extensions")
def extensions_nav():
    if "get_modules" in request.args:
        return api_utils.craft_response(kelp_module_repo.get_all_modules(
            int(request.args.get("page")),
            int(request.args.get("amount"))
        ), 200)

    if "picture" in request.args:
        if request.args.get("picture") == "module_uuid":
            return api_utils.empty_success()
        return kelp_module_repo.get_module_picture(request.args.get("picture"))
    return render_template("extensions/extensions_nav.html")


@app.route("/extensions/<uuid>")
def extensions_page(uuid):
    return render_template(
        "extensions/extensions_page.html",
        module=kelp_module_repo.get_module_by_uuid(uuid),
        files=kelp_module_repo.get_module_file_list(uuid)
    )


@app.route("/extensions/<uuid>/description")
def extension_description(uuid):
    return api_utils.make_response(
        kelp_module_repo.get_module_by_uuid(
            uuid
        ).get("description")
    )


@app.route("/extensions/<uuid>/download/latest")
def extension_download_latest(uuid):
    return send_file(
        kelp_module_repo.get_latest_module_file(uuid),
        mimetype="file",
        as_attachment=True
    )


@app.route("/extensions/<uuid>/download/<filename>")
def extension_download_file(uuid, filename):
    return send_file(
        kelp_module_repo.get_module_file(uuid, filename),
        mimetype="file",
        as_attachment=True
    )
