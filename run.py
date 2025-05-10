# run.py
from app import create_app
from flask_cors import CORS

app = create_app()

# Configuración de CORS después de crear la aplicación
CORS(app)
# O ajusta las rutas según tu necesidad

if __name__ == '__main__':
    app.run(debug=True)