from database.sql_type import SQLType


class ConnectionProfile:
    mysql_host = 'localhost'
    mysql_port = 3306
    mysql_database = 'database'
    mysql_username = 'root'
    mysql_password = ''

    def __init__(self, host, port, database, username, password):
        self.mysql_host = host
        self.mysql_port = port
        self.mysql_database = database
        self.mysql_username = username
        self.mysql_password = password
        
    def connection_uri(self, sql_type):
        uri_elements = []
        if sql_type == SQLType.SQLITE:
            uri_elements = [
                'sqlite:///',
                self.mysql_database
            ]
        elif sql_type == SQLType.MYSQL:
            uri_elements = [
                'mysql://',
                self.mysql_username,
                ':',
                self.mysql_password,
                '@',
                self.mysql_host,
                ':',
                self.mysql_port,
                '/',
                self.mysql_database
            ]
        return str(uri_elements) \
            .replace('[', '') \
            .replace(']', '') \
            .replace(',', '') \
            .replace(' ', '') \
            .replace('\'', '')
