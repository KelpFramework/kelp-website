from __init__ import *
from kelp_modules import kelp_module_repo
from user_data.user_auth import admin_required
from utils import api_utils


@app.route("/acp/extensions", methods=["GET", "POST"])
@admin_required
def acp_extensions():
    if request.method == "POST":
        if "create_module" in request.form:
            kelp_module_repo.create_module(
                request.form.get("id"),
                request.form.get("name"),
                session.get("username"),
                request.form.get("short_desc"),
                request.form.get("desc"),
                request.files.get("pict"),
                request.form.get("pin") == "true"
            )
        if "switch_pin" in request.form:
            kelp_module_repo.switch_pinned(
                request.form.get("switch_pin")
            )
        if "change_module_picture" in request.form:
            kelp_module_repo.change_module_picture(
                request.form.get("change_module_picture"),
                request.files.get("pict")
            )
        if "delete_module" in request.form:
            kelp_module_repo.remove_module(
                request.form.get("delete_module")
            )
        if "edit_module_name" in request.form:
            kelp_module_repo.change_module_name(
                request.form.get("edit_module_name"),
                request.form.get("module_name")
            )
        if "upload_module_file" in request.form:
            kelp_module_repo.upload_to_module(
                request.form.get("upload_module_file"),
                request.files.get("file"),
                request.form.get("filename")
            )
        if "delete_module_file" in request.form:
            kelp_module_repo.remove_from_module(
                request.form.get("delete_module_file"),
                request.form.get("filename")
            )
        if "edit_short_description" in request.form:
            kelp_module_repo.change_module_short_description(
                request.form.get("edit_short_description"),
                request.form.get("short_description")
            )
        if "edit_description" in request.form:
            kelp_module_repo.change_module_description(
                request.form.get("edit_description"),
                request.form.get("description")
            )

        return api_utils.empty_success()

    if "get_modules" in request.args:
        return api_utils.craft_response(
            kelp_module_repo.get_all_modules(all_by_creation_date=False),
            StopCodes.Success.OK
        )
    if "get_module" in request.args:
        return api_utils.craft_response(
            {
                "gen": kelp_module_repo.get_module_by_uuid(
                    request.args.get("get_module")
                ),
                "files": kelp_module_repo.get_module_file_list(
                    request.args.get("get_module")
                )
            }, StopCodes.Success.OK
        )

    return render_template("acp/acp_extensions.html")
