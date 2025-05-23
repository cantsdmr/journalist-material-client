import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PATHS, NEWS, CHANNEL, POLL, ACCOUNT } from '@/constants/paths';
import { useApp } from '@/contexts/AppContext';

// Layouts
import MainLayout from '@/components/navigation/MainLayout';
import StudioLayout from '@/components/navigation/StudioLayout';
import PrivateRoute from '@/components/navigation/PrivateRoute';

// Home pages
// import GetStarted from '@/pages/auth/GetStarted';

// Auth pages
import Login from '@/pages/auth/Login';
import SignUp from '@/pages/auth/SignUp';
import PostSignUpFlow from '@/pages/auth/PostSignUpFlow';

// Main app pages
import LandingPage from '@/pages/LandingPage';
// import Explore from '@/pages/Explore';
// import Subscriptions from '@/pages/Subscriptions';

// News pages
import ListNews from '@/pages/app/news/ListNews';
import ViewNews from '@/pages/app/news/ViewNews';

// Channel pages
import ListChannels from '@/pages/app/channel/ListChannels';
import ViewChannel from '@/pages/app/channel/ViewChannel';

// Poll pages
import ListPolls from '@/pages/app/poll/ListPoll';
import ViewPoll from '@/pages/app/poll/ViewPoll';

// Account pages
import Account from '@/pages/app/account/Account';

// Studio pages
import CreateNewsStudio from '@/pages/studio/news/CreateNews.studio';
import EditNewsStudio from '@/pages/studio/news/EditNews.studio';
import ViewNewsStudio from '@/pages/studio/news/ViewNews.studio';
import ListNewsStudio from '@/pages/studio/news/ListNews.studio';
// import NewsAnalytics from '@/pages/studio/news/NewsAnalytics';

import ListChannelsStudio from '@/pages/studio/channel/ListChannels.studio';
import CreateChannelStudio from '@/pages/studio/channel/CreateChannel.studio';

// import ChannelAnalytics from '@/pages/studio/channel/ChannelAnalytics';
import NotFound from './pages/NotFound';
import ViewChannelStudio from './pages/studio/channel/ViewChannel.studio';
import LoadingScreen from '@/components/common/LoadingScreen';
import ErrorScreen from '@/components/common/ErrorScreen';
import EditChannel from './pages/studio/channel/EditChannel.studio';
import ListPollsStudio from '@/pages/studio/poll/ListPolls.studio';
import CreatePollStudio from '@/pages/studio/poll/CreatePoll.studio';
import EditPollStudio from '@/pages/studio/poll/EditPoll.studio';
import ViewPollStudio from '@/pages/studio/poll/ViewPoll.studio';

const App: React.FC = () => {
  const { isLoading, error } = useApp();
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <Routes>
      {/* Home Routes */}
      <Route path={PATHS.HOME} element={<LandingPage />} />

      {/* Auth Routes */}
      <Route path={PATHS.LOGIN} element={<Login />} />
      <Route path={PATHS.SIGNUP} element={<SignUp />} />
      <Route path={PATHS.POST_SIGNUP} element={<PostSignUpFlow />} />

      {/* Main App Routes */}
      <Route path={`${PATHS.APP_ROOT}/*`} element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path={`${NEWS.ROOT}/*`}>
          <Route path={NEWS.SUBPATHS.TRENDING} element={<ListNews isSubscribed={false} />} />
          <Route path={NEWS.SUBPATHS.MY_FEED} element={<ListNews isSubscribed={true} />} />
          <Route path={`${NEWS.VIEW}`} element={<ViewNews />} />
        </Route>
        <Route path={`${CHANNEL.ROOT}/*`}>
          <Route index element={<ListChannels />} />
          <Route path={`${CHANNEL.VIEW}`} element={<ViewChannel />} />
        </Route>
        <Route path={`${POLL.ROOT}/*`}>
          <Route index element={<ListPolls />} />
          <Route path={`${POLL.VIEW}`} element={<ViewPoll />} />
        </Route>
        <Route path={`${ACCOUNT.ROOT}/*`}>
          <Route index element={<Account />} />
        </Route>
      </Route>

      {/* Studio Routes */}
      <Route path={`${PATHS.STUDIO_ROOT}/*`} element={<PrivateRoute><StudioLayout /></PrivateRoute>}>
        {/* <Route index element={<Studio />} /> */}
        <Route path={`${NEWS.ROOT}/*`}>
          <Route index element={<ListNewsStudio isSubscribed={false} />} />
          <Route path={`${NEWS.CREATE}`} element={<CreateNewsStudio />} />
          <Route path={`${NEWS.EDIT}/:id`} element={<EditNewsStudio />} />
          <Route path={`${NEWS.VIEW}`} element={<ViewNewsStudio />} />
        </Route>
        <Route path={`${CHANNEL.ROOT}/*`}>
          <Route index element={<ListChannelsStudio />} />
          <Route path={`${CHANNEL.CREATE}`} element={<CreateChannelStudio />} />
          <Route path={`${CHANNEL.VIEW}`} element={<ViewChannelStudio />} />
          <Route path={`${CHANNEL.EDIT}/:id`} element={<EditChannel />} />
        </Route>
        <Route path={`${POLL.ROOT}/*`}>
          <Route index element={<ListPollsStudio />} />
          <Route path={`${POLL.CREATE}`} element={<CreatePollStudio />} />
          <Route path={`${POLL.EDIT}/:id`} element={<EditPollStudio />} />
          <Route path={`${POLL.VIEW}`} element={<ViewPollStudio />} />
        </Route>
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
