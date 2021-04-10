def shorten_to(string: str, length: int, extension: bool = False):
    if len(string) > length:
        if extension:
            ext = string.split(".")[-1]
            str_only = ".".join(string.split(".")[0:-1])
            parts_len = round((length - 3 - len(ext)) / 2)
            return f"{str_only[0:parts_len]}...{str_only[-parts_len:]}.{ext}"
        return f"{string[0:length-3]}..."
    return string
