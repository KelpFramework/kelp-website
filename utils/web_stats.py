import markdown

from kelp_modules import kelp_module
from kelp_plugins import kelp_plugin, kelp_plugin_report
from user_data import User, user_report


class Stats:
    """
    Represents a set of some statistics about this website
    including the total user or plugin count, etc.

    This is used as welcoming content for the admin control
    panel, where you can manage plugins and users.
    """

    @staticmethod
    class Modules:
        @staticmethod
        def get_module_count():
            """
            :return: The total amount of all kelp extensions posted on the website.
            """
            return kelp_module.KelpModule.query.count()

    @staticmethod
    class Plugins:
        @staticmethod
        def get_plugin_count():
            """
            :return: The total amount of unique plugins currently uploaded to the website.
                     (not including update releases, etc.)
            """
            return kelp_plugin.KelpPlugin.query.count()

        @staticmethod
        def get_plugin_report_count():
            return kelp_plugin_report.KelpPluginReport.query.count()

    @staticmethod
    class UserData:
        @staticmethod
        def get_user_count():
            """
            :return: The total amount of users who are currently registered on the website.
            This does also include yet unverified users.
            """
            return User.User.query.count()

        @staticmethod
        def get_user_report_count():
            """
            :return: Gets the total amount of all open reports against any user on the website.
            """
            return user_report.UserReport.query.count()


def get_todo_md(html=True):
    """
    Reads the TODO.md file (located in root directory)
    and converts it to HTML code to be displayed on the Admin
    Control Panel index page.

    :param html: True (default) - The markdown file will be converted to HTML code,
                    which can be injected onto a web page.
                 False - The markdown file will be returned as raw text.
    :return: The HTML code for the todo markdown file or the markdown file as raw text.
    """
    with open("./TODO.md", "r", encoding="utf-8") as f:
        data = f.read()
    if html:
        return markdown.markdown(
            data,
            extensions=[  # enable all possible markdown extensions because we can.
                "extra", "abbr", "attr_list", "def_list", "fenced_code", "footnotes", "md_in_html", "tables", "admonition",
                "codehilite", "legacy_attrs", "legacy_attrs", "meta", "nl2br", "sane_lists", "smarty", "toc", "wikilinks"
            ]
        )
    return data
