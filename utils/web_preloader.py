import os
import requests
import markdown

from __init__ import working_dir


preload = dict()
code_snippets = dict()


def language_interpreter(file_ending):
    mappings = {
        "py": "python",
        "java": "java",
        "js": "javascript",
        "sh": "shell",
        "xml": "xml"
    }

    return mappings[file_ending]


class CodeSnippet:
    def __init__(self, content, language):
        self.content = f"<code class='lang-{language}'>{content}</code>"

    def get_content(self):
        return self.content


def preload_code_snippets():
    snippet_location = os.path.join(working_dir, "templates", "components", "code_snippets")

    for entry in os.listdir(snippet_location):
        file = os.path.join(snippet_location, entry)
        name = ".".join(entry.split(".")[:-1])
        ending = entry.split(".")[-1]
        if os.path.isfile(file):
            with open(file, "r", encoding="utf-8") as f:
                code_snippets[name] = CodeSnippet(
                    f.read(),
                    language_interpreter(ending)
                )


def get_and_load_readme_if_required(make_html=True):

    global preload

    if "readme" not in preload:
        data = requests.get("https://raw.githubusercontent.com/PXAV/kelp/master/README.md")
        preload["readme"] = data.text

    if make_html:
        return markdown.markdown(
            preload["readme"],
            extensions=[
                "extra", "abbr", "attr_list", "def_list", "fenced_code", "footnotes", "md_in_html", "tables", "admonition",
                "codehilite", "legacy_attrs", "legacy_attrs", "meta", "nl2br", "sane_lists", "smarty", "toc", "wikilinks"
            ]
        )

    return preload["readme"]
