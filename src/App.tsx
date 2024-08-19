import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './navigation/PrivateRoute';
import { ApiProvider } from './contexts/ApiContext';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import MainLayout from './navigation/MainLayout';
import Feed from './pages/Feed';
import Subscriptions from './pages/Subscriptions';
import Explore from './pages/Explore';
import EntryDetails from './pages/EntryDetails';
import Reels from './pages/Reels';
import CreatePoll from './components/CreatePoll';
import Polls from './pages/Polls';
import DivisionProfile from './pages/DivisionProfile';
import CreateOrEditNews from './components/CreateNews';
import { UserProvider } from './contexts/UserContext';

const App: React.FC = () => {  
  return (
    <AuthProvider>
      <ApiProvider>
        <UserProvider>
          <Routes>
            <Route
              path=""
              element={
                <LandingPage />
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="app/*" element={<PrivateRoute><MainLayout /></PrivateRoute>} >
              <Route path="feed" element={<Feed />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="explore" element={<Explore />} />
              <Route path="entry/:id" element={<EntryDetails />} />
              <Route path="reels" element={<Reels />} />
              <Route path="create-news" element={<CreateOrEditNews />} />
              <Route path="create-poll" element={<CreatePoll />} />
              <Route path="polls" element={<Polls />} />
              <Route path="profile/:creatorId" element={<DivisionProfile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          </UserProvider>
      </ApiProvider>
    </AuthProvider>
  );
};

export default App;
