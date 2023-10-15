import socket


class SocketBuilder:
    @staticmethod
    def build_server_socket(host, port, backlog=5):
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.bind((host, port))
        server_socket.listen(backlog)
        return server_socket
