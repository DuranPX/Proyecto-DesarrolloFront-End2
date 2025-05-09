import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice'; // Ajusta según tu estructura

interface OauthJwtPayload {
  name: string;
  email: string;
  picture: string;
}

const GITHUB_CLIENT_ID = "Ov23liIAQVbQXMdFEVwF";

const SignIn: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Manejar login con Google
  const handleGoogleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode<OauthJwtPayload>(credentialResponse.credential);
      dispatch(setUser({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        provider: "google",
      }));
      navigate("/"); // Redirige después de iniciar sesión
    }
  };

  // Redirige al login de GitHub
  const handleGitHubLogin = () => {
    const redirectUri = encodeURIComponent(window.location.origin + "/signin");
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=read:user user:email`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      const exchangeGitHubCode = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/github", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          });

          if (!response.ok) {
            throw new Error("Fallo al obtener datos de GitHub");
          }

          const userData = await response.json();

          dispatch(setUser({
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
            provider: "github",
          }));

          navigate("/");

        } catch (error) {
          console.error("Error en login con GitHub:", error);
        }
      };

      exchangeGitHubCode();
    }
  }, []);


  // Inyecta estilos al cargar el componente
  useEffect(() => {
    injectStyles();
  }, []);

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>

      <div className="oauth-buttons">
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log("Error con Google")} />
        <button className="github-button" onClick={handleGitHubLogin}>
          <span className="icon" />
          <span>Continuar con GitHub</span>
        </button>
      </div>

      <div className="separator"><span>O</span></div>

      <form>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input type="email" id="email" placeholder="Tu correo electrónico" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" placeholder="Tu contraseña" />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>

      <div className="options">
        ¿No tienes una cuenta? <Link to="/">Sorry aun no hay un SingUp</Link>
      </div>
    </div>
  );
};

// Estilos CSS inyectados dinámicamente
const styles = `
  .container {
    background-color: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 350px;
    margin: auto;
  }

  h2 {
    text-align: center;
    margin-bottom: 20px;
  }

  .oauth-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .oauth-buttons button {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background: #f5f5f5;
    cursor: pointer;
  }

  .separator {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
    color: #777;
  }

  .separator::before,
  .separator::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ccc;
    margin: 0 10px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  form button[type="submit"] {
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: #fff;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }

  form button[type="submit"]:hover {
    background-color: #0056b3;
  }

  .options {
    text-align: center;
    margin-top: 15px;
  }

  .options a {
    color: #007bff;
    text-decoration: none;
  }

  .options a:hover {
    text-decoration: underline;
  }
`;

const injectStyles = () => {
  const style = document.createElement("style");
  style.textContent = styles;
  document.head.appendChild(style);
};

export default SignIn;