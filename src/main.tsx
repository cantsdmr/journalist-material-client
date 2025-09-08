import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ApiProvider } from '@/contexts/ApiContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { AppProvider } from './contexts/AppContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Set document title with version
document.title = `Meta Journo v${__APP_VERSION__}`;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <ApiProvider>
            <ProfileProvider>
              <ThemeProvider>
                <AppProvider>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <App />
                  </LocalizationProvider>
                </AppProvider>
              </ThemeProvider>
            </ProfileProvider>
          </ApiProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
