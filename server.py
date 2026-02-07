#!/usr/bin/env python3
import http.server
import socketserver
import os
import webbrowser

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"✓ Сервер запущен на {url}")
        print(f"✓ Нажмите Ctrl+C для остановки сервера")
        
        try:
            webbrowser.open(url)
        except:
            print(f"✓ Откройте вручную: {url}")
        
        httpd.serve_forever()
