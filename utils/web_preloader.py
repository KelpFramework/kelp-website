"""
This file handles the code snippets presented on the landing page.
They can be dynamically typed and loaded in templates/components/code_snippets.

This is useful as the KelpAPI is changing a lot before 1.0 release and therefore
modifying the snippet file makes more sense than modifying the entire HTML file
every time, which is more prone to errors.

Currently, you can write code snippets in Java, Python, JavaScript, Shell and XML.
Groovy and Kotlin might also be supported in the future.
"""

import os
import requests
import markdown

from __init__ import working_dir


# the preloaded markdown file to be displayed on the getting started page.
preload = dict()

# cached code snippets ready to be displayed on the website.
code_snippets = dict()


def language_interpreter(file_ending):
    """
    Takes a file extension and converts it to the class
    name required by the syntax highlighter.

    :param file_ending: The file extension to convert
                        excluding the '.' (py, java, js, sh, xml)
    :return: The HTML class name telling the syntax highlighter which preset to apply.
    """
    mappings = {
        "py": "python",
        "java": "java",
        "js": "javascript",
        "sh": "shell",
        "xml": "xml"
    }

    return mappings[file_ending]


class CodeSnippet:
    """
    Represents a code snippet inside an HTML file. You can
    input the code and the language, which will then be
    wrapped into a HTML code tag with the required class(es).
    """

    def __init__(self, content, language):
        """
        Initializes/generates the HTML content for the given code and
        language, which can then be retrieved using get_content().
        It basically wraps the content into an HTML code tag like this:
        <code class='lang-%language%'>YOUR CODE</code>

        :param content:     The actual code to display.
        :param language:    The language to use for syntax highlighting.
                            Can be retrieved from file extension using
                            language_interpreter().
        """
        self.content = f"<code class='lang-{language}'>{content}</code>"

    def get_content(self):
        """
        :return: The HTML content to display on the website.
        """
        return self.content


def preload_code_snippets():
    """
    Iterates all files located in the code snippet folder (templates/components/code_snippets)
    and loads them into the cache. This means the CodeSnippet class is applied to
    every code snipped and they are converted to HTML code ready to be displayed on the
    website.
    """
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
    """
    Downloads the README file from the kelp GitHub repository and
    caches its content to avoid spam of future requests.

    :param make_html: True - The markdown code should be converted to HTML code
                        ready to be displayed on the page.
                      False - the markdown code should be returned as raw text.
    :return: The raw text of the markdown file.
    """

    global preload

    # if file has already been preloaded, skip the download
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
