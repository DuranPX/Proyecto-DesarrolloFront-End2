import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = "365103856515-j4s08ejbbpropm2cokuuluo6pl1lc05l.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* Envolvemos App con BrowserRouter */}
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);