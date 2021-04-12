from __init__ import *
from user_data.user_auth import auth_required, is_admin

from utils import api_utils
from user_data import user_repo

from kelp_plugins import kelp_plugin_repo
from kelp_modules import kelp_module_repo

from sqlalchemy.exc import IntegrityError


def manage_permissions(username):
    return is_admin(username)


@app.route("/profile")
@auth_required
def profile():
    return render_template(
        "user/user_profile.html",
        profile=user_repo.get_user_query_object(session.get("username"))
    )


@app.route("/profile/plugins")
@auth_required
def profile_plugins():
    return render_template("user/user_plugins.html")


@app.route("/profile/settings", methods=["GET", "POST"])
@auth_required
def profile_settings():
    if request.method == "POST":
        if "change_avatar" in request.form:
            user_repo.change_avatar(
                session.get("username"),
                request.files.get("avatar")
            )
        if "edit_description" in request.form:
            user_repo.change_description(
                session.get("username"),
                request.form.get("description")
            )
        if "change_email" in request.form:
            user_repo.change_email(
                session.get("username"),
                request.form.get("email")
            )
        if "change_password" in request.form:
            return api_utils.craft_boolean_response(
                user_repo.change_password(
                    session.get("username"),
                    request.form.get("old_password"),
                    request.form.get("new_password")
                ),
                error_code=StopCodes.Success.OK
            )
        if "delete_data" in request.form:
            cmd = request.form.get("delete_data")
            username = session.get("username")
            if cmd in ["plugins", "everything"]:
                kelp_plugin_repo.remove_user_content(username)
            if cmd in ["extensions", "everything"]:
                kelp_module_repo.remove_user_content(username)
            if cmd == "account":
                user_repo.delete_user(username)
                return redirect("/logout")

        return api_utils.empty_success()
    return render_template(
        "user/user_settings.html",
        has_extensions=kelp_module_repo.get_user_has_modules(
            session.get("username")
        )
    )


@app.route("/user/<username>")
def user(username):
    if not user_repo.user_exists(username):
        abort(404)
    if username == session.get("username"):
        return redirect("/profile")

    return render_template(
        "user/user_profile.html",
        profile=user_repo.get_user_query_object(username)
    )


@app.route("/user/<username>/report", methods=["GET", "POST"])
@auth_required
def user_report(username):
    if request.method == "POST":
        if "description" in request.form:
            try:
                user_repo.create_user_report(
                    username,
                    session.get("username"),
                    request.form.get("description"),
                    request.form.get("type")
                )
            except IntegrityError:
                return render_template("user/user_report.html", success="You already reported this user!")

        return render_template("user/user_report.html", success=True)

    return render_template(
        "user/user_report.html",
        types=configuration.user_report_types,
        user=user_repo.get_user_query_object(username)
    )


@app.route("/user", methods=["GET", "POST"])
def user_info():
    if request.method == "POST":
        if not manage_permissions(session.get("username")):
            return abort(StopCodes.ClientError.Unauthorized)

        if "suspend_user" in request.form:
            user_repo.suspend_user(
                request.form.get("suspend_user"),
                request.form.get("suspend_until"),
                request.form.get("suspend_message")
            )

        if "un_suspend_user" in request.form:
            user_repo.del_suspend_user(
                request.form.get("un_suspend_user")
            )

        if "delete_user" in request.form:
            user_repo.delete_user(
                request.form.get("delete_user")
            )
        if "switch_admin" in request.form:
            user_repo.switch_admin(
                request.form.get("switch_admin")
            )

        return api_utils.empty_success()

    if "avatar" in request.args:
        return user_repo.get_user_query_object(request.args.get("avatar")).get_avatar(html=True)
    if "get_plugins" in request.args:
        return api_utils.craft_response(
            kelp_plugin_repo.get_paginated_plugins_by_user(
                request.args.get("username") or session.get("username"),
                int(request.args.get("page")),
                int(request.args.get("amount"))
            ), StopCodes.Success.OK
        )
    if "get_extensions" in request.args:
        return api_utils.craft_response(
            kelp_module_repo.get_paginated_modules_by_user(
                request.args.get("username") or session.get("username"),
                int(request.args.get("page")),
                int(request.args.get("amount"))
            ), StopCodes.Success.OK
        )
