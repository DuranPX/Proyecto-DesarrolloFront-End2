import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';



interface SignInProps { }
const Client_id_github = "Ov23liIAQVbQXMdFEVwF";

const SignIn: React.FC<SignInProps> = () => {

  interface GoogleJwtPayload {
    name: string;
    email: string;
    picture: string;
    // puedes agregar más campos según lo que devuelva el token
  }

  const handleSignInWithOtherGitHub = () => {
    console.log('Iniciar sesión con github');
    localStorage.setItem("provider", "github");
    const redirectUri = encodeURIComponent(window.location.origin + "/signin"); // ¡Importante: la misma ruta!
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${Client_id_github}&redirect_uri=${redirectUri}&scope=user:email`;
  };


  useEffect(() => {
    injectStyles();
  },);

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>

      <div className="oauth-buttons">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);
                console.log("Usuario:", decoded);
              }
            }}
            onError={() => {
              console.log('Error al iniciar sesión con Google');
            }}
          />
        <button className="github-button" onClick={handleSignInWithOtherGitHub}>
          <span className="icon"></span>
          <span>Continuar con GitHub</span>
        </button>
      </div>

      <div className="separator">
        <span>O</span>
      </div>

      {/* Formulario tradicional (opcional, puedes comentarlo o eliminarlo si solo usas OAuth) */}
      <form>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input type="email" id="email" name="email" placeholder="Tu correo electrónico" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" name="password" placeholder="Tu contraseña" />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>

      <div className="options">
        ¿No tienes una cuenta? <Link to="/signup">Regístrate</Link>
        <br />
      </div>
    </div>
  );
};

// Estilos CSS (puedes colocarlos en un archivo CSS aparte e importarlo)
const styles = `
  .container {
    background-color: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 350px;
  }

  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }

  .oauth-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .oauth-buttons button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    background-color: #f9f9f9;
  }

  .oauth-buttons button:hover {
    background-color: #eee;
  }

  .oauth-buttons .icon {
    margin-right: 10px;
    /* Aquí puedes agregar estilos para los iconos (SVG, fuentes de iconos, etc.) */
  }

  .separator {
    display: flex;
    align-items: center;
    text-align: center;
    margin-bottom: 20px;
    color: #777;
  }

  .separator::before,
  .separator::after {
    content: '';
    flex-grow: 1;
    background-color: #ddd;
    height: 1px;
    margin: 0 10px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    color: #555;
    font-size: 0.9em;
  }

  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 1em;
  }

  form button[type="submit"] {
    background-color: #007bff;
    color: #fff;
    padding: 12px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    width: 100%;
  }

  form button[type="submit"]:hover {
    background-color: #0056b3;
  }

  .options {
    margin-top: 20px;
    text-align: center;
    font-size: 0.9em;
    color: #777;
  }

  .options a {
    color: #007bff;
    text-decoration: none;
  }

  .options a:hover {
    text-decoration: underline;
  }

  /* Estilos específicos para los botones de OAuth */
  .google-button {
    color: #4285f4; /* Ejemplo de color de Google */
  }

  .facebook-button {
    color: #1877f2; /* Ejemplo de color de Facebook */
  }

  /* Agrega más estilos para otros proveedores */
`;

const injectStyles = () => {
  const style = document.createElement('style');
  style.textContent = styles;
  document.head.appendChild(style);
};

export default SignIn;