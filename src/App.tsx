import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './navigation/PrivateRoute';
import { ApiProvider } from './contexts/ApiContext';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import MainLayout from './navigation/MainLayout';
import PublicNews from './pages/news/PublicNews';
import Subscriptions from './pages/Subscriptions';
import Explore from './pages/Explore';
import NewsDetail from './pages/news/NewsDetail';
import CreatePoll from './components/CreatePoll';
import Polls from './pages/poll/Polls';
import { UserProvider } from './contexts/UserContext';
import PublicRoute from './navigation/PublicRoute';
import DemoLayout from './navigation/DemoLayout';
import DemoCreatorProfile from './demo/DemoCreatorProfile';
import DemoExploreCreators from './demo/DemoExploreCreators';
import DemoNewsFeed from './demo/DemoNewsFeed';
import DemoSupporterDashboard from './demo/DemoSupporterDashboard';
import DemoPoll from './demo/DemoPoll';
import SignUp from './pages/SignUp';
import SubscribedNews from './pages/news/SubscribedNews';
import Channels from './pages/channel/Channels';
import ChannelDetail from './pages/channel/ChannelDetail';

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
              <Route path="public-news" element={<PublicNews />} />
              <Route path="channels" element={<Channels />} />
              <Route path="subscribed-news" element={<SubscribedNews />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="explore" element={<Explore />} />
              <Route path="entry/:id" element={<NewsDetail />} />
              <Route path="create-poll" element={<CreatePoll />} />
              <Route path="polls" element={<Polls />} />
              <Route path="channels/:channelId" element={<ChannelDetail />} />
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
