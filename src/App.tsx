import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './navigation/PrivateRoute';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import MainLayout from './navigation/MainLayout';
import Subscriptions from './pages/Subscriptions';
import Explore from './pages/Explore';
import NewsDetail from './pages/news/NewsDetail';
import CreatePoll from './components/CreatePoll';
import Polls from './pages/poll/Polls';
import PublicRoute from './navigation/PublicRoute';
import DemoLayout from './navigation/DemoLayout';
import DemoCreatorProfile from './demo/DemoCreatorProfile';
import DemoExploreCreators from './demo/DemoExploreCreators';
import DemoNewsFeed from './demo/DemoNewsFeed';
import DemoSupporterDashboard from './demo/DemoSupporterDashboard';
import DemoPoll from './demo/DemoPoll';
import SignUp from './pages/SignUp';
import Channels from './pages/channel/Channels';
import ChannelDetail from './pages/channel/ChannelDetail';
import NewsList from './pages/news/NewsList';

const App: React.FC = () => {
  return (
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
        <Route path="trending" element={<NewsList isSubscribed={false} />} />
        <Route path="my-feed" element={<NewsList isSubscribed={true} />} />
        <Route path="news/:id" element={<NewsDetail />} />
        <Route path="channels" element={<Channels />} />
        <Route path="channels/:channelId" element={<ChannelDetail />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="explore" element={<Explore />} />
        <Route path="entry/:id" element={<NewsDetail />} />
        <Route path="create-poll" element={<CreatePoll />} />
        <Route path="polls" element={<Polls />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
