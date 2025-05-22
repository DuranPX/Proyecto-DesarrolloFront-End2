# run.py
from app import create_app, socketio  # Asegúrate de que socketio esté exportado en app.py
from flask_cors import CORS

app = create_app()
CORS(app)

if __name__ == '__main__':
    socketio.run(app, debug=True)  # Usa socketio.run en vez de app.run