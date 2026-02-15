import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux'; // Importa Provider
import {store} from './store/store';



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
