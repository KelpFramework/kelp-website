from user_data import user_repo
from kelp_modules import kelp_module_repo
from kelp_plugins import kelp_plugin_repo


def search_users_by_name(name):
    return user_repo.search_users_by_username(name)


def search_kelp_modules_by_name(name):
    return kelp_module_repo.search_modules_by_name(name)


def search_kelp_plugins_by_name(name):
    return kelp_plugin_repo.search_plugins_by_name(name, limit=None)


def search_all_by_string(search_string):
    return_list = list()

    class FoundObject:
        def __init__(self, typ, name, link, icon):
            self.type = typ
            self.name = name
            self.link = link
            self.icon = icon

        def export(self):
            return {
                "type": self.type,
                "name": self.name,
                "link": self.link,
                "icon": self.icon
            }


    for user in search_users_by_name(search_string):
        return_list.append(
            FoundObject(
                "user",
                user["username"],
                f"/user/{user['username']}",
                f"/user?avatar={user['username']}"
            )
            .export()
        )

    for extension in search_kelp_modules_by_name(search_string):
        return_list.append(
            FoundObject(
                "extension",
                extension["module_name"],
                f"/extensions/{extension['uuid']}",
                f"/extensions?picture={extension['uuid']}"
            )
            .export()
        )

    for plugin in search_kelp_plugins_by_name(search_string):
        return_list.append(
            FoundObject(
                "plugin",
                plugin["plugin_name"],
                f"/plugins/{plugin['uuid']}",
                f"/plugins?icon={plugin['uuid']}"
            )
            .export()
        )

    return return_list
