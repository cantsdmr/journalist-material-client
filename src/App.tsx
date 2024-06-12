import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Feed from './pages/Feed';
import Subscriptions from './pages/Subscriptions';
import Explore from './pages/Explore';
import EntryDetails from './pages/EntryDetails';
import Reels from './pages/Reels';
import CreatePoll from './components/CreatePoll';
import Polls from './pages/Polls';
import DivisionProfile from './pages/DivisionProfile';
import LandingPage from './pages/LandingPage';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import PrivateRoute from './navigation/PrivateRoute';
import { ApiProvider } from './contexts/ApiContext';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import MainLayout from './navigation/MainLayout';

const App: React.FC = () => {
  const auth = useAuthContext();
  
  return (
    <ApiProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                auth?.isAuthenticated ? <Navigate to="/app/feed" replace /> : <LandingPage />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/app" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route path="feed" element={<Feed />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="explore" element={<Explore />} />
              <Route path="entry/:id" element={<EntryDetails />} />
              <Route path="reels" element={<Reels />} />
              <Route path="create-poll" element={<CreatePoll />} />
              <Route path="polls" element={<Polls />} />
              <Route path="profile/:creatorId" element={<DivisionProfile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ApiProvider>
  );
};

export default App;
