from __init__ import *
from user_data import user_repo
from user_data.user_auth import admin_required
from utils import api_utils


@app.route("/acp/users", methods=["GET", "POST"])
@admin_required
def acp_users():
    if request.method == "POST":
        if "remove_user" in request.form:
            user_repo.delete_user(
                request.form.get("remove_user")
            )
        if "suspend_user" in request.form:
            user_repo.suspend_user(
                request.form.get("suspend_user"),
                request.form.get("suspend_until"),
                request.form.get("suspend_message")
            )
        if "remove_report" in request.form:
            user_repo.remove_report_by_id(
                request.form.get("remove_report")
            )
        if "remove_reports" in request.form:
            user_repo.remove_reports_by_username(
                request.form.get("remove_reports")
            )
        return api_utils.empty_success()

    if "get_user_reports" in request.args:
        return api_utils.craft_response(
            user_repo.get_all_reports(),
            StopCodes.Success.OK
        )
    if "get_user_report" in request.args:
        return api_utils.craft_response(
            user_repo.get_user_report_by_id(
                request.args.get("get_user_report")
            ), StopCodes.Success.OK
        )

    return render_template("acp/acp_users.html")
