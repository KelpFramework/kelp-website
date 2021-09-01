from __init__ import *
from user_data import user_repo

from utils import email_utils, api_utils
import uuid


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":

        if "reset_password" in request.form:
            if request.form.get("reset") in temp_db.data["user_password_resets"]:
                username = temp_db.data["user_password_resets"][request.form.get("reset")]
                user_repo.set_password(
                    username,
                    request.form.get("reset_password")
                )
                session["logged_in"] = True
                session["username"] = username
                session[username] = user_repo.get_password_hash(username)
                temp_db.data["user_password_resets"].pop(request.form.get("reset"), None)
                return redirect("/")
            abort(StopCodes.ClientError.NotFound)
        if "reset_password" in request.args:
            if user_repo.user_exists(request.form.get("username")):
                code = str(uuid.uuid4()).replace("-", "5c74e68")
                email_utils.send_user_password_reset_email(
                    user_repo.get_user_query_object(
                        request.form.get("username")
                    ).get_email(),
                    code
                )
                temp_db.data["user_password_resets"][code] = request.form.get("username")
                return api_utils.craft_response(
                    {"successful": True},
                    200
                )
            return api_utils.craft_response(
                {"successful": False},
                200
            )

        redirection = request.args.get("goto_confirm") or "/"

        username = request.form.get("username")
        password = request.form.get("password")
        remember = request.form.get("remember")
        state = user_repo.check_user_password(username, password)

        if state:
            if not user_repo.check_verified(username):
                return render_template("login.html", non_verified=True)
            session["logged_in"] = True
            session["username"] = username
            session[username] = user_repo.get_password_hash(username)
            session.permanent = remember == "on"
            if not user_repo.get_user_query_object(username).get_suspended():
                return redirect(redirection)
            return render_template("suspended.html")

        return make_response(
            render_template("login.html", error="Wrong username or password"),
            StopCodes.ClientError.Unauthorized
        )

    if "reset" in request.args:
        if request.args.get("reset") in temp_db.data["user_password_resets"]:
            return render_template("login.html", _reset=request.args.get("reset"))
        abort(StopCodes.ClientError.NotFound)

    return render_template("login.html", redirect=request.args.get("goto_confirm") or "/")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        email = request.form.get("email")
        description = request.form.get("description")
        avatar = request.files.get("avatar")
        state = user_repo.create_user(username, password, email, description, avatar.stream.read())
        if state is True:
            session["logged_in"] = True
            session["username"] = username
            session[username] = user_repo.get_password_hash(username)
            email_utils.send_verification_email(email, user_repo.get_user_query_object(username).get_activation_code())
            return redirect("/register?verify")
        return render_template("register.html", error=state)

    if "verify" in request.args:
        if not user_repo.check_verified(session.get("username")):
            return render_template("register.html", verify=True)
        abort(StopCodes.ClientError.NotFound)
    if "sendAgain" in request.args:
        if not user_repo.check_verified(session.get("username")):
            user = user_repo.get_user_query_object(session.get("username"))
            email_utils.send_verification_email(user.get_email(), user.get_activation_code())
            return render_template("register.html", verify=True)
        abort(StopCodes.ClientError.NotFound)
    return render_template("register.html")


@app.route("/verify/<code>")
def verify(code):
    if user_repo.verify_user(code):
        return redirect("/profile")
    abort(StopCodes.ClientError.NotFound)


@app.route("/logout")
def logout():
    session["logged_in"] = None
    if session.get("username") is not None:
        username = session["username"]
        session[username] = None
        session["username"] = None
    return redirect("/")
