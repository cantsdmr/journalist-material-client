import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ApiProvider } from '@/contexts/ApiContext';
import { UserProvider } from '@/contexts/UserContext';
import { AppProvider } from './contexts/AppContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ApiProvider>
          <UserProvider>
            <ThemeProvider>
              <AppProvider>
                <App />
              </AppProvider>
            </ThemeProvider>
          </UserProvider>
        </ApiProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
