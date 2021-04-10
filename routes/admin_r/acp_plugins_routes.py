from __init__ import *
from kelp_plugins import kelp_plugin_repo
from utils import api_utils
from user_data.user_auth import admin_required


@app.route("/acp/plugins", methods=["GET", "POST"])
@admin_required
def acp_plugins():
    if request.method == "POST":
        if "add_tag" in request.form:
            kelp_plugin_repo.add_plugin_tag(
                request.form.get("add_tag")
            )
        if "remove_tag" in request.form:
            kelp_plugin_repo.remove_plugin_tag(
                request.form.get("remove_tag")
            )
        if "remove_report" in request.form:
            kelp_plugin_repo.remove_report_by_id(
                request.form.get("remove_report")
            )
        if "remove_reports" in request.form:
            kelp_plugin_repo.remove_reports_by_plugin_uuid(
                request.form.get("remove_reports")
            )
        if "remove_plugin" in request.form:
            kelp_plugin_repo.remove_plugin(
                request.form.get("remove_plugin")
            )

        return api_utils.empty_success()

    if "get_plugins" in request.args:
        return api_utils.craft_response(
            kelp_plugin_repo.get_latest_plugins(),
            StopCodes.Success.OK
        )
    if "get_tags" in request.args:
        return api_utils.craft_response(
            kelp_plugin_repo.get_all_tags(),
            StopCodes.Success.OK
        )
    if "get_plugins_reports" in request.args:
        return api_utils.craft_response(
            kelp_plugin_repo.get_all_reports(),
            StopCodes.Success.OK
        )
    if "get_plugin" in request.args:
        return api_utils.craft_response(
            kelp_plugin_repo.get_plugin_by_uuid(
                request.args.get("get_plugin")
            ), StopCodes.Success.OK
        )
    return render_template("acp/acp_plugins.html")
