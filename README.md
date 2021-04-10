## Seapipe - KelpFramework Homepage

> Developed by [Davis_Software](https://github.com/Software-City) &copy; 2020-2021

Join the [**DISCORD**](https://discord.gg/KVtjCMwk4x) for exclusive updates, feature voting, etc.
Share and download free plugins with the community

[TOC]

### What is Kelp?
Visit the [Kelp repo](https://github.com/KelpFramework/kelp) for more info
Additionally you can also take a look at [this](https://github.com/KelpFramework/kelp/wiki/What-is-Kelp%3F) Wiki page.

### What does this website do?
This website acts as a Homepage for Kelp. It contains some examples and explanations while also providing a platform
for distributing [Kelp Plugins]() (link pending) and [Kelp Extensions]() (link pending).

**Visit it [here]() (link pending)**

---

![](./static/github_resources/img/missing-files-warning.svg)

### Running the webserver
You need [Python3](https://www.python.org/downloads/latest) in order to run the server

* Clone the Repository into a folder
* Create a virtual environment if you want
* Run `pip3 install -r requirements.txt` to install all required modules
* Configure port and host (and database if you want) in `configuration.py`
* You might want to change stuff like `application_host`, etc. in `__init__.py`
* Run the webserver with `python3 main.py`

### Will there be documentation?
* The short answer:
    no
* The long answer:
    Yes but only on how to use front-end features.
    Neither the API, nor any other part will be documented
* "I want to write some documentation":
    You are all welcome to write documentation on API, etc. 
    However, these will also have to be maintained by you!
  
---

## Contributing
If you want to contribute, you are of course welcome to work on any subject you like!
However, there will be no guarantee that any of your work will make it into the public release.
If you are not sure where to start, you can look at the table below. It shows features which are in development
or ideas that could be implemented.

You can also request a feature! For more info you should read [this](#bug-reports-and-feature-requests) section.

One last thing before you start! Be sure to read the [contribution guidelines]()

|Feature               |Implemented|Planed          |Description                                                                   |
|----------------------|-----------|----------------|------------------------------------------------------------------------------|
|Extension Proposition |no         |if requested    |Users are able to propose Extensions which will be tested and maybe released.  |
|Plugin Voting         |no         |(no date)       |Users can vote if they like a plugin or not. This will affect listing and users will be able to sort by such parameters. |
|Markdown Overhaul     |no         |ver. 1.1        |Better markdown styles on all pages which use it. |
|Remember Logins       |no         |if requested    |Add options for remembering user login |

more features will be added here if requested

---

## Bug reports and Feature requests
If you have bug reports, ideas, or need support feel free to open a new issue here on GitHub.
Optionally you can also try fixing the bug yourself, however, this may proof to be quite difficult as there is no documentation.