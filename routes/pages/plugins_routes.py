from __init__ import app, render_template, request, send_file, session, abort, StopCodes
from user_data.user_auth import auth_required, is_admin
from kelp_plugins import kelp_plugin_repo
from utils import api_utils


def manage_permissions(user, uuid):
    return kelp_plugin_repo.is_owner(user, uuid) or is_admin(user)


@app.route("/plugins")
def plugins_nav():
    if "get_plugins" in request.args:
        if "tags" in request.args or "q" in request.args:
            return api_utils.craft_complex_response(kelp_plugin_repo.filter_plugins_by(
                int(request.args.get("page")),
                int(request.args.get("amount")),
                request.args.get("q") or "",
                (request.args.get("tags") or "").split(","),
                read_count=True
            ), StopCodes.Success.OK)
        return api_utils.craft_response(kelp_plugin_repo.get_all_plugins(
            int(request.args.get("page")),
            int(request.args.get("amount"))
        ), StopCodes.Success.OK)
    if "get_tags" in request.args:
        return api_utils.craft_response(
            kelp_plugin_repo.get_all_tags(),
            StopCodes.Success.OK
        )

    if "icon" in request.args:
        return kelp_plugin_repo.get_plugin_icon(request.args.get("icon"))
    if "banner" in request.args:
        return kelp_plugin_repo.get_plugin_banner(request.args.get("banner"))

    return render_template("plugins/plugins_nav.html")


@app.route("/plugins/new", methods=["GET", "POST"])
@auth_required
def plugins_new():
    if request.method == "POST" and "plugin_create" in request.form:
        return api_utils.craft_response(
            kelp_plugin_repo.create_plugin(
                request.form.get("plugin_name"),
                session.get("username"),
                request.form.get("plugin_short_description"),
                request.form.get("plugin_description"),
                request.files.get("plugin_icon"),
                request.files.get("plugin_banner"),
                (request.form.get("plugin_tags") or "").split(","),
            ), StopCodes.Success.OK
        )
    return render_template("plugins/plugins_new.html", tags=kelp_plugin_repo.get_all_tags())


@app.route("/plugins/manage", methods=["POST"])
@auth_required
def plugin_manage():
    if not manage_permissions(session.get("username"), request.form[list(request.form.keys())[0]]):
        return abort(StopCodes.ClientError.Unauthorized)

    if "upload_plugin_file" in request.form:
        file = request.files.get("file")
        kelp_plugin_repo.upload_to_plugin(
            request.form.get("upload_plugin_file"),
            file,
            file.filename
        )
    if "add_plugin_link" in request.form:
        kelp_plugin_repo.add_link_to_plugin(
            request.form.get("add_plugin_link"),
            request.form.get("link"),
            request.form.get("name")
        )
    if "manage_files" in request.form:
        if "delete_file" in request.form:
            kelp_plugin_repo.remove_from_plugin(
                request.form.get("manage_files"),
                request.form.get("delete_file")
            )
            return api_utils.empty_success()
        return api_utils.craft_response(
            kelp_plugin_repo.get_plugin_file_list(
                request.form.get("manage_files")
            ),
            StopCodes.Success.OK
        )
    if "change_plugin_icon" in request.form:
        kelp_plugin_repo.change_plugin_icon(
            request.form.get("change_plugin_icon"),
            request.files.get("picture")
        )
    if "change_plugin_banner" in request.form:
        kelp_plugin_repo.change_plugin_banner(
            request.form.get("change_plugin_banner"),
            request.files.get("picture")
        )
    if "edit_plugin_name" in request.form:
        kelp_plugin_repo.change_plugin_name(
            request.form.get("edit_plugin_name"),
            request.form.get("plugin_name")
        )
    if "edit_plugin_short_description" in request.form:
        kelp_plugin_repo.change_plugin_short_description(
            request.form.get("edit_plugin_short_description"),
            request.form.get("plugin_short_description")
        )
    if "edit_plugin_tags" in request.form:
        kelp_plugin_repo.set_plugin_tags(
            request.form.get("edit_plugin_tags"),
            request.form.get("plugin_tags")
        )
    if "edit_plugin_description" in request.form:
        kelp_plugin_repo.change_plugin_description(
            request.form.get("edit_plugin_description"),
            request.form.get("plugin_description")
        )
    if "remove_plugin" in request.form:
        kelp_plugin_repo.remove_plugin(
            request.form.get("remove_plugin")
        )

    return api_utils.empty_success()


@app.route("/plugins/<uuid>")
def plugins_page(uuid):
    return render_template(
        "plugins/plugins_page.html",
        plugin=kelp_plugin_repo.get_plugin_by_uuid(uuid),
        files=kelp_plugin_repo.get_plugin_file_list(uuid),
        preview=request.args.get("preview") is not None
    )


@app.route("/plugins/<uuid>/report", methods=["GET", "POST"])
@auth_required
def plugin_report(uuid):
    if request.method == "POST":
        if "description" in request.form:
            kelp_plugin_repo.create_plugin_report(
                uuid,
                session.get("username"),
                request.form.get("description"),
                request.form.get("type")
            )

        return render_template("plugins/plugins_report.html", success=True)

    return render_template("plugins/plugins_report.html", plugin=kelp_plugin_repo.get_plugin_by_uuid(uuid))


@app.route("/plugins/<uuid>/download/<filename>")
def plugin_download_file(uuid, filename):
    return send_file(
        kelp_plugin_repo.get_plugin_file(uuid, filename),
        mimetype="file",
        as_attachment=True
    )
