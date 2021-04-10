import os
import time
import shutil
import markdown
import datetime
import configuration

from utils import sql_utils
from database import JSON_database
from .kelp_plugin import KelpPlugin
from .kelp_plugin_report import KelpPluginReport

from werkzeug.utils import secure_filename
from sqlalchemy import or_


json_db = JSON_database.JsonDatabase(True)


def plugin_updated(uuid):
    KelpPlugin.query.filter_by(uuid=uuid).first().updated = time.time()
    sql_utils.commit_db()


def create_plugin(name, creator, short_description, description, icon, banner, tags: list):
    plugin = KelpPlugin(
        name,
        creator,
        short_description,
        description,
        icon.stream.read() if icon is not None else icon,
        banner.stream.read() if banner is not None else banner,
        tags
    )
    os.makedirs(os.path.join(configuration.path_kelp_plugins, plugin.uuid))
    sql_utils.append_to_db(
        plugin,
        auto_commit=True
    )
    plugin_updated(plugin.uuid)
    return plugin.uuid


def create_plugin_direct(name, creator, short_description, description, icon, banner, tags: list):
    plugin = KelpPlugin(
        name,
        creator,
        short_description,
        description,
        icon,
        banner,
        tags
    )
    os.makedirs(os.path.join(configuration.path_kelp_plugins, plugin.uuid))
    sql_utils.append_to_db(
        plugin,
        auto_commit=True
    )
    plugin_updated(plugin.uuid)
    return plugin.uuid


def create_plugin_report(uuid, creator, description, report_type):
    if report_type not in configuration.plugin_report_types:
        return Exception(f"Unknown type: {report_type}")
    report = KelpPluginReport(uuid, creator, description, report_type)
    sql_utils.append_to_db(report, auto_commit=True)


def add_plugin_tag(tag_name: str) -> None:
    if tag_name not in json_db.tags:
        json_db.tags.append(tag_name)
        json_db.commit()


def change_plugin_tags(uuid, tags: dict):
    KelpPlugin.query.filter_by(uuid=uuid).first().tags = tags
    sql_utils.commit_db()
    plugin_updated(uuid)


def change_plugin_name(uuid, plugin_name):
    KelpPlugin.query.filter_by(uuid=uuid).first().plugin_name = plugin_name
    sql_utils.commit_db()
    plugin_updated(uuid)


def change_plugin_icon(uuid, picture):
    plugin = KelpPlugin.query.filter_by(uuid=uuid).first()
    plugin.icon = picture.stream.read()
    sql_utils.commit_db()
    plugin_updated(uuid)


def change_plugin_banner(uuid, picture):
    plugin = KelpPlugin.query.filter_by(uuid=uuid).first()
    plugin.banner = picture.stream.read()
    sql_utils.commit_db()
    plugin_updated(uuid)


def change_plugin_short_description(uuid, short_description):
    KelpPlugin.query.filter_by(uuid=uuid).first().short_description = short_description
    sql_utils.commit_db()
    plugin_updated(uuid)


def change_plugin_description(uuid, description):
    KelpPlugin.query.filter_by(uuid=uuid).first().description = description
    sql_utils.commit_db()
    plugin_updated(uuid)


def get_plugins_by_user(user):
    return sql_utils.sql_list_to_json(
        KelpPlugin.query.filter_by(creator=user).all()
    )


def get_paginated_plugins_by_user(user, start_at=1, per_page=18):
    return sql_utils.sql_list_to_json(
        KelpPlugin.query.filter_by(creator=user).order_by(KelpPlugin.updated.desc()).paginate(
            start_at, per_page=per_page, error_out=True
        ).items
    )


def get_all_reports():
    reports = sql_utils.sql_list_to_json(
        KelpPluginReport.query.order_by(KelpPluginReport.created.asc()).all()
    )
    for report in reports:
        report["plugin"] = get_plugin_by_uuid(report["plugin_uuid"])
    return reports


def get_all_tags() -> list:
    return json_db.tags


def search_plugins_by_name(search, limit=3):
    return sql_utils.sql_list_to_json(
        KelpPlugin.query.filter(KelpPlugin.plugin_name.ilike(f"%{search}%")).limit(limit).all()
    )


# def filter_plugins_by(page, amount, string: str, tags: list, read_count=False):
#     def do_return(data, rc):
#         if read_count:
#             return {"data": sql_utils.sql_list_to_json(data), "count": rc}
#         return sql_utils.sql_list_to_json(data)
#
#     if string != "":
#         string_filtered_pre = KelpPlugin.query.filter(
#             or_(
#                 KelpPlugin.plugin_name.ilike(f"%{string}%"),
#                 KelpPlugin.short_description.ilike(f"%{string}%"),
#                 KelpPlugin.description.ilike(f"%{string}%")
#             )
#         )
#     else:
#         string_filtered_pre = KelpPlugin.query
#
#     string_filtered = string_filtered_pre.order_by(KelpPlugin.updated.desc()).paginate(page, per_page=amount, error_out=True).items
#
#     if tags == [""]:
#         return do_return(string_filtered, string_filtered_pre.count())
#
#     ret_li = list()
#
#     for plugin in string_filtered:
#         if all(elem in plugin.tags.split(",") for elem in tags):
#             ret_li.append(plugin)
#
#     # return do_return(ret_li, len(ret_li))
#     return do_return(ret_li, string_filtered_pre.count())


def filter_plugins_by(page, amount, string: str, tags: list, read_count=False):
    def do_return(data, rc):
        if read_count:
            return {"data": sql_utils.sql_list_to_json(data), "count": rc}
        return sql_utils.sql_list_to_json(data)

    string_filtered_pre = KelpPlugin.query

    if string != "":
        string_filtered_pre = string_filtered_pre.filter(
            or_(
                KelpPlugin.plugin_name.ilike(f"%{string}%"),
                KelpPlugin.short_description.ilike(f"%{string}%"),
                KelpPlugin.description.ilike(f"%{string}%")
            )
        )

    if tags != [""]:
        for tag in tags:
            string_filtered_pre = string_filtered_pre.filter(
                KelpPlugin.tags.ilike(f"%{tag}%")
            )

    string_filtered = string_filtered_pre.order_by(KelpPlugin.updated.desc()).paginate(page, per_page=amount, error_out=True).items

    return do_return(string_filtered, string_filtered_pre.count())


def get_plugin_tags(uuid) -> dict:
    return KelpPlugin.query.filter_by(uuid=uuid).first().tags.split(",")


def set_plugin_tags(uuid, tags: str):
    KelpPlugin.query.filter_by(uuid=uuid).first().tags = tags
    sql_utils.commit_db()


def get_all_plugins(start_at=0, per_page=12):
    if start_at == 0:
        return sql_utils.sql_list_to_json(
            KelpPlugin.query.order_by(KelpPlugin.updated.desc()).all()
        )
    return sql_utils.sql_list_to_json(
        KelpPlugin.query.order_by(KelpPlugin.updated.desc()).paginate(start_at, per_page=per_page, error_out=True).items
        # sql_utils.limited_paginate(KelpPlugin.query.order_by(KelpPlugin.updated.desc()), start_at, per_page, True, 50000).items
    )


def get_latest_plugins(age_days=5):
    return sql_utils.sql_list_to_json(
        KelpPlugin.query.filter(
            KelpPlugin.created > (datetime.datetime.now() - datetime.timedelta(days=age_days))
        ).order_by(KelpPlugin.created.asc()).all()
    )


def get_plugin_by_uuid(uuid):
    ret = sql_utils.sql_to_json(
        KelpPlugin.query.filter_by(uuid=uuid).first()
    )
    ret["description_md"] = markdown.markdown(
        ret["description"],
        extensions=[
            "extra", "abbr", "attr_list", "def_list", "fenced_code", "footnotes", "md_in_html", "tables", "admonition",
            "codehilite", "legacy_attrs", "legacy_attrs", "meta", "nl2br", "sane_lists", "smarty", "toc", "wikilinks"
        ]
    )
    return ret


def get_plugin_icon(uuid):
    return KelpPlugin.query.filter_by(uuid=uuid).first().icon


def get_plugin_banner(uuid):
    return KelpPlugin.query.filter_by(uuid=uuid).first().banner


def is_owner(user, uuid):
    return KelpPlugin.query.filter_by(uuid=uuid).first().creator == user


def get_plugin_file_list(uuid):
    path = os.path.join(configuration.path_kelp_plugins, uuid)
    file_list = list()
    for file in os.listdir(path):
        file_path = os.path.join(path, file)
        file_obj = {
            "name": file,
            "type": "file",
            "target": file,
            "created": datetime.datetime.fromtimestamp(os.path.getctime(file_path)),
            "created_r": os.path.getctime(file_path),
            "modified": datetime.datetime.fromtimestamp(os.path.getmtime(file_path)),
            "modified_r": os.path.getmtime(file_path),
            "accessed": os.path.getatime(file_path),
            "size": os.path.getsize(file_path)
        }

        if f"external_link_{uuid}" in str(file):
            file_obj["type"] = "link"
            file_obj["name"] = str(file).split(f"external_link_{uuid}_")[1]
            p = os.path.join(configuration.path_kelp_plugins, uuid, file)
            with open(p, "r") as f:
                file_obj["target"] = f.read()

        file_list.append(file_obj)
    return list(reversed(sorted(file_list, key=lambda k: k["modified"])))


def get_plugin_file(uuid, filename):
    KelpPlugin.query.filter_by(uuid=uuid).first().downloads += 1
    sql_utils.commit_db()
    return os.path.join(configuration.path_kelp_plugins, uuid, filename)


def remove_plugin(uuid):
    remove_reports_by_plugin_uuid(uuid, auto_commit=False)
    shutil.rmtree(os.path.join(configuration.path_kelp_plugins, uuid))
    plugin = KelpPlugin.query.filter_by(uuid=uuid).first()
    if plugin is not None:
        sql_utils.delete_from_db(plugin, auto_commit=True)


def remove_reports_by_plugin_uuid(uuid, auto_commit=True):
    KelpPluginReport.query.filter_by(plugin_uuid=uuid).delete()
    if auto_commit:
        sql_utils.commit_db()


def remove_report_by_id(report_id, auto_commit=True):
    KelpPluginReport.query.filter_by(id=report_id).delete()
    if auto_commit:
        sql_utils.commit_db()


def remove_plugin_tag(tag_name) -> None:
    if tag_name in json_db.tags:
        json_db.tags.remove(tag_name)
        json_db.commit()


def remove_user_content(username, auto_commit=True):
    for plugin in KelpPlugin.query.filter_by(creator=username).all():
        remove_plugin(plugin.uuid)
    KelpPluginReport.query.filter_by(creator=username).delete()
    if auto_commit:
        sql_utils.commit_db()


def upload_to_plugin(uuid, file, filename):
    save_path = os.path.join(configuration.path_kelp_plugins, uuid, secure_filename(filename))
    file.save(save_path)
    plugin_updated(uuid)


def add_link_to_plugin(uuid, link, name):
    save_path = os.path.join(configuration.path_kelp_plugins, uuid, f"external_link_{uuid}_{name}")
    with open(save_path, "w") as f:
        f.write(link)
    plugin_updated(uuid)


def remove_from_plugin(uuid, filename):
    os.remove(os.path.join(configuration.path_kelp_plugins, uuid, filename))
    plugin_updated(uuid)
