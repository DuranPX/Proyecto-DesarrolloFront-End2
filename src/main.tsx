import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux'; // Importa Provider
import {store} from './store/store';

const CLIENT_ID_GOOGLE = "1027084347923-82orajp9vrfb0eurgrrf2k5bguuv0kqc.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> {/* Envuelve tu aplicación con Provider y pasa el store */}
      <BrowserRouter>
        <GoogleOAuthProvider clientId={CLIENT_ID_GOOGLE}>
          <App />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);