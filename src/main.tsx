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
import { NotificationProvider } from '@/contexts/NotificationContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <ApiProvider>
            <UserProvider>
              <ThemeProvider>
                <AppProvider>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <App />
                  </LocalizationProvider>
                </AppProvider>
              </ThemeProvider>
            </UserProvider>
          </ApiProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
