import os
import shutil
import markdown
import datetime
import configuration

from utils import sql_utils
from .kelp_module import KelpModule
from werkzeug.utils import secure_filename


def create_module(name, creator, short_description, description, picture, pinned):
    module = KelpModule(name, creator, short_description, description, picture.stream.read(), pinned)
    os.makedirs(os.path.join(configuration.path_kelp_modules, module.uuid))
    sql_utils.append_to_db(
        module,
        auto_commit=True
    )


def switch_pinned(uuid):
    module = KelpModule.query.filter_by(uuid=uuid).first()
    module.pinned = not module.pinned
    sql_utils.commit_db()


def change_module_name(uuid, module_name):
    KelpModule.query.filter_by(uuid=uuid).first().module_name = module_name
    sql_utils.commit_db()


def change_module_picture(uuid, picture):
    module = KelpModule.query.filter_by(uuid=uuid).first()
    module.picture = picture.stream.read()
    sql_utils.commit_db()


def change_module_short_description(uuid, short_description):
    KelpModule.query.filter_by(uuid=uuid).first().short_description = short_description
    sql_utils.commit_db()


def change_module_description(uuid, description):
    KelpModule.query.filter_by(uuid=uuid).first().description = description
    sql_utils.commit_db()


def get_modules_by_user(user):
    return sql_utils.sql_list_to_json(
        KelpModule.query.filter_by(creator=user).all()
    )


def get_user_has_modules(user):
    return KelpModule.query.filter_by(creator=user).count() > 0


def get_paginated_modules_by_user(user, start_at=1, per_page=18):
    return sql_utils.sql_list_to_json(
        KelpModule.query.filter_by(creator=user).order_by(KelpModule.created.desc()).paginate(
            start_at, per_page=per_page, error_out=True
        ).items
    )


def search_modules_by_name(search, limit=3):
    return sql_utils.sql_list_to_json(
        KelpModule.query.filter(KelpModule.module_name.ilike(f"%{search}%")).limit(limit).all()
    )


def get_all_modules(start_at=0, per_page=12, all_by_creation_date=False):
    if all_by_creation_date:
        return sql_utils.sql_list_to_json(
            KelpModule.query.order_by(KelpModule.created.desc()).all()
        )
    if start_at == 0:
        return sql_utils.sql_list_to_json(
            KelpModule.query.order_by(KelpModule.pinned.desc(), KelpModule.created.desc()).all()
        )
    return sql_utils.sql_list_to_json(
        KelpModule.query.order_by(KelpModule.pinned.desc(), KelpModule.created.desc())
            .paginate(start_at, per_page=per_page, error_out=True).items
    )


def get_module_by_uuid(uuid):
    ret = sql_utils.sql_to_json(
        KelpModule.query.filter_by(uuid=uuid).first()
    )
    ret["description_md"] = markdown.markdown(
        ret["description"],
        extensions=[
            "extra", "abbr", "attr_list", "def_list", "fenced_code", "footnotes", "md_in_html", "tables", "admonition",
            "codehilite", "legacy_attrs", "legacy_attrs", "meta", "nl2br", "sane_lists", "smarty", "toc", "wikilinks"
        ]
    )
    return ret


def get_module_picture(uuid):
    return KelpModule.query.filter_by(uuid=uuid).first().picture


def is_owner(user, uuid):
    return KelpModule.query.filter_by(uuid=uuid).first().creator == user


def get_module_file_list(uuid):
    path = os.path.join(configuration.path_kelp_modules, uuid)
    file_list = list()
    for file in os.listdir(path):
        file_path = os.path.join(path, file)
        file_obj = {
            "name": file,
            "created": datetime.datetime.fromtimestamp(os.path.getctime(file_path)),
            "created_r": os.path.getctime(file_path),
            "modified": datetime.datetime.fromtimestamp(os.path.getmtime(file_path)),
            "modified_r": os.path.getmtime(file_path),
            "accessed": os.path.getatime(file_path),
            "size": os.path.getsize(file_path)
        }
        file_list.append(file_obj)
    return list(reversed(sorted(file_list, key=lambda k: k["modified"])))


def get_module_file(uuid, filename):
    KelpModule.query.filter_by(uuid=uuid).first().downloads += 1
    sql_utils.commit_db()
    return os.path.join(configuration.path_kelp_modules, uuid, filename)


def remove_user_content(username, auto_commit=True):
    for module in KelpModule.query.filter_by(creator=username).all():
        remove_module(module.uuid)
    if auto_commit:
        sql_utils.commit_db()


def remove_module(uuid):
    shutil.rmtree(os.path.join(configuration.path_kelp_modules, uuid))
    module = KelpModule.query.filter_by(uuid=uuid).first()
    if module is not None:
        sql_utils.delete_from_db(module, auto_commit=True)


def upload_to_module(uuid, file, filename):
    save_path = os.path.join(configuration.path_kelp_modules, uuid, secure_filename(filename))
    file.save(save_path)


def remove_from_module(uuid, filename):
    os.remove(os.path.join(configuration.path_kelp_modules, uuid, filename))
