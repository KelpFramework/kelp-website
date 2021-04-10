import markdown

from kelp_modules import kelp_module
from kelp_plugins import kelp_plugin, kelp_plugin_report
from user_data import User, user_report


class Stats:

    @staticmethod
    class Modules:
        @staticmethod
        def get_module_count():
            return kelp_module.KelpModule.query.count()

    @staticmethod
    class Plugins:
        @staticmethod
        def get_plugin_count():
            return kelp_plugin.KelpPlugin.query.count()

        @staticmethod
        def get_plugin_report_count():
            return kelp_plugin_report.KelpPluginReport.query.count()

    @staticmethod
    class UserData:
        @staticmethod
        def get_user_count():
            return User.User.query.count()

        @staticmethod
        def get_user_report_count():
            return user_report.UserReport.query.count()


def get_todo_md(html=True):
    with open("./TODO.md", "r", encoding="utf-8") as f:
        data = f.read()
    if html:
        return markdown.markdown(
            data,
            extensions=[
                "extra", "abbr", "attr_list", "def_list", "fenced_code", "footnotes", "md_in_html", "tables", "admonition",
                "codehilite", "legacy_attrs", "legacy_attrs", "meta", "nl2br", "sane_lists", "smarty", "toc", "wikilinks"
            ]
        )
    return data
