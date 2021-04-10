from functools import wraps
from __init__ import *


from .user_repo import check_user_passwordhash, get_user_query_object, check_verified


def is_admin(username):
    return get_user_query_object(username).get_admin()


def auth_required(func):
    @wraps(func)
    def check(*args, **kwargs):
        authentication = False
        if session.get("logged_in") and session.get("username") is not None:
            username = session.get("username")
            if check_user_passwordhash(username, session[username]):
                if not check_verified(username):
                    return render_template("login.html", non_verified=True)
                authentication = True

        if authentication:
            if not get_user_query_object(username).get_suspended():
                if args is not () or kwargs is not {}:
                    return func(*args, **kwargs)
                return func()
            return render_template("suspended.html")
        return render_template("login.html", redirect=request.path)

    return check


def admin_required(func):
    @wraps(func)
    def check(*args, **kwargs):
        if session.get("logged_in") and session.get("username") is not None:
            username = session.get("username")
            authentication = is_admin(username)
        else:
            return render_template("login.html", redirect=request.path)

        if authentication:
            if args is not () or kwargs is not {}:
                return func(*args, **kwargs)
            return func()
        abort(StopCodes.ClientError.Unauthorized)

    return check
