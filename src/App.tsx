import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './navigation/PrivateRoute';
import { ApiProvider } from './contexts/ApiContext';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import MainLayout from './navigation/MainLayout';
import Feed from './pages/news/PublicNews';
import Subscriptions from './pages/Subscriptions';
import Explore from './pages/Explore';
import EntryDetails from './pages/EntryDetails';
import Reels from './pages/Reels';
import CreatePoll from './components/CreatePoll';
import Polls from './pages/Polls';
import DivisionProfile from './pages/DivisionProfile';
import { UserProvider } from './contexts/UserContext';
import PublicRoute from './navigation/PublicRoute';
import DemoLayout from './navigation/DemoLayout';
import DemoCreatorProfile from './demo/DemoCreatorProfile';
import DemoExploreCreators from './demo/DemoExploreCreators';
import DemoNewsFeed from './demo/DemoNewsFeed';
import DemoSupporterDashboard from './demo/DemoSupporterDashboard';
import DemoPoll from './demo/DemoPoll';
import SignUp from './pages/SignUp';

const App: React.FC = () => {
  return (
    <AuthProvider>–
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
            <Route path="get-started" element={<SignUp />} />
            <Route path="demo/*" element={<PublicRoute><DemoLayout /></PublicRoute>} >
              <Route path="creator-profile" element={<DemoCreatorProfile />} />
              <Route path="explore-creators" element={<DemoExploreCreators />} />
              <Route path="news-feed" element={<DemoNewsFeed />} />
              <Route path="demo-poll" element={<DemoPoll />} />
              <Route path="supporter-dashboard" element={<DemoSupporterDashboard />} />
            </Route>
            <Route path="app/*" element={<PrivateRoute><MainLayout /></PrivateRoute>} >
              <Route path="feed" element={<Feed />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="explore" element={<Explore />} />
              <Route path="entry/:id" element={<EntryDetails />} />
              <Route path="reels" element={<Reels />} />
              {/* <Route path="create-news" element={<CreateOrEditNews />} /> */}
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
