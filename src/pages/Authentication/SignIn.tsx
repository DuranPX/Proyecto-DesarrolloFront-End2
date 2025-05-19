import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store'; // importa tu tipo
import { setUser } from '../../store/userSlice'; // Ajusta según tu estructura
import { createCustomerOnLogin } from '../../services/CustomerService'; // Importa la función
import { hasRequiredUserData } from '../../services/CustomerService'; // Importa la función

interface OauthJwtPayload {
  name: string;
  email: string;
  picture: string;
}

const GITHUB_CLIENT_ID = "Ov23liIAQVbQXMdFEVwF";
const MICROSOFT_CLIENT_ID = "ade20827-082b-4aa1-82c1-541e776fb3c1";

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Manejar login con Google
  const handleGoogleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode<OauthJwtPayload>(credentialResponse.credential);
      const userData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        provider: "google",
        token: credentialResponse.credential,
      };
      dispatch(setUser(userData));
      // Llama SIEMPRE a createCustomerOnLogin
      dispatch(createCustomerOnLogin(userData));
      // Si faltan datos, navega a perfil para completarlos
      if (!hasRequiredUserData(userData)) {
        navigate("/perfil");
        return;
      }
      navigate("/");
    }
  };

  // Redirige al login de GitHub
  const handleGitHubLogin = () => {
    localStorage.setItem("oauth_provider", "github");
    const redirectUri = encodeURIComponent(window.location.origin + "/signin");
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user`;
  };

  const handleMicrosoftLogin = () => {
    localStorage.setItem("oauth_provider", "microsoft");
    const redirectUri = encodeURIComponent(window.location.origin + "/signin");
    const scope = encodeURIComponent("https://graph.microsoft.com/user.read");
    window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${MICROSOFT_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=${scope}`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      const provider = localStorage.getItem("oauth_provider");

      const exchangeCode = async () => {
        try {
          const endpoint =
            provider === "microsoft"
              ? "http://127.0.0.1:5000/microsoft"
              : "http://127.0.0.1:5000/github";

          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            if (
              provider === "microsoft" &&
              errorData?.error === "invalid_grant" &&
              errorData?.error_description?.includes("The code has expired")
            ) {
              console.log("Código de Microsoft expirado. Iniciando nuevo login.");
              localStorage.removeItem("oauth_provider");
              handleMicrosoftLogin();
              return;
            }
            throw new Error(`Error al intercambiar código de ${provider}`);
          }

          const userData = await response.json();
          const userPayload = {
            name: userData.name,
            email: userData.email,
            picture: userData.picture || userData.avatar_url || "", // Soporta ambos campos
            provider: provider || "unknown",
            token: userData.token,
          };
          dispatch(setUser(userPayload));
          dispatch(createCustomerOnLogin(userPayload));
          if (!hasRequiredUserData(userPayload)) {
            localStorage.removeItem("oauth_provider");
            navigate("/perfil");
            return;
          }
          localStorage.removeItem("oauth_provider");
          navigate("/");
        } catch (error) {
          console.error("Error de login OAuth:", error);
        } finally {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      };

      exchangeCode();
    }
  }, [dispatch, navigate]);

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
        <button onClick={handleMicrosoftLogin}>
          <span className='icon' />
          Iniciar sesión con Microsoft</button>
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
  body {
    background: linear-gradient(135deg, #F6F0F0, #F2DC2A30);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }

  .container {
    background: #ffffff;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(17, 17, 17, 0.15);
    width: 100%;
    max-width: 420px;
    border: 1px solid #ddd;
  }

  h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #2a003f; /* Morado oscuro */
    font-size: 26px;
  }

  .oauth-buttons {
    
  
  };`

const injectStyles = () => {
  const style = document.createElement("style");
  style.textContent = styles;
  document.head.appendChild(style);
}
export default SignIn;