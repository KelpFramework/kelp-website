from __init__ import *

from utils import web_preloader


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/getting-started")
def getting_started():
    return render_template(
        "getting-started.html",
        md_html=web_preloader.get_and_load_readme_if_required()
    )


# legal routes:

# @app.route("/imprint")
# def imprint():
#     return redirect(f"https://{application_host}/imprint")
#
#
# @app.route("/privacy")
# def privacy():
#     return redirect(f"https://{application_host}/privacy")
#
#
# @app.route("/community-guidelines")
# def community_guidelines():
#     return redirect(f"https://{application_host}/community-guidelines")


web_preloader.preload_code_snippets()
