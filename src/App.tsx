import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PATHS, NEWS, CHANNEL, POLL, ACCOUNT, SEARCH, EXPENSE_ORDER, ADMIN, SUBSCRIPTION } from '@/constants/paths';
import { useApp } from '@/contexts/AppContext';

// Layouts
import MainLayout from '@/components/navigation/MainLayout';
import StudioLayout from '@/components/navigation/StudioLayout';
import AdminLayout from '@/components/navigation/AdminLayout';
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
import DiscoverNews from '@/pages/app/news/DiscoverNews';

// Channel pages
import ListChannels from '@/pages/app/channel/ListChannels';
import ViewChannel from '@/pages/app/channel/ViewChannel';

// Poll pages
import ListPolls from '@/pages/app/poll/ListPoll';
import ViewPoll from '@/pages/app/poll/ViewPoll';

// Account pages
import Account from '@/pages/app/account/Account';
import Settings from '@/pages/app/account/Settings';

// Expense Order pages
import ListExpenseOrders from '@/pages/app/expense-order/ListExpenseOrders';
import ViewExpenseOrder from '@/pages/app/expense-order/ViewExpenseOrder';

// Search page
import SearchPage from '@/pages/SearchPage';

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
import EditChannel from './pages/studio/channel/EditChannel.studio';
import ListPollsStudio from '@/pages/studio/poll/ListPolls.studio';
import CreatePollStudio from '@/pages/studio/poll/CreatePoll.studio';
import EditPollStudio from '@/pages/studio/poll/EditPoll.studio';
import ViewPollStudio from '@/pages/studio/poll/ViewPoll.studio';

// Studio Expense Order pages
import ListExpenseOrdersStudio from '@/pages/studio/expense-order/ListExpenseOrders.studio';
import CreateExpenseOrderStudio from '@/pages/studio/expense-order/CreateExpenseOrder.studio';
import EditExpenseOrderStudio from '@/pages/studio/expense-order/EditExpenseOrder.studio';
import ViewExpenseOrderStudio from '@/pages/studio/expense-order/ViewExpenseOrder.studio';

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard';
import UserManagement from '@/pages/admin/users';
import ChannelManagement from '@/pages/admin/channels';
// import SubscriptionIndex from '@/pages/admin/subscriptions';
import SubscriptionManagement from '@/pages/admin/subscriptions/Management';
import SubscriptionAnalytics from '@/pages/admin/subscriptions/Analytics';
import RevenueTracking from '@/pages/admin/subscriptions/Revenue';
import PlatformAnalytics from '@/pages/admin/analytics';
import AdminSettings from '@/pages/admin/settings';

// New Admin pages
import NewsAdmin from '@/pages/admin/NewsAdmin';
import PollAdmin from '@/pages/admin/PollAdmin';
import ChannelAdmin from '@/pages/admin/ChannelAdmin';
import ExpenseOrderAdmin from '@/pages/admin/ExpenseOrderAdmin';
import PayoutAdmin from '@/pages/admin/PayoutAdmin';
import SubscriptionAdmin from '@/pages/admin/SubscriptionAdmin';
import UserAdmin from '@/pages/admin/UserAdmin';
import TagAdmin from '@/pages/admin/TagAdmin';

const App: React.FC = () => {
  const { isLoading } = useApp();

  if (isLoading) {
    return <LoadingScreen />;
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
          <Route path={NEWS.SUBPATHS.TRENDING} element={<ListNews key="trending" filters={{ trending: true }} />} />
          <Route path={NEWS.SUBPATHS.MY_FEED} element={<ListNews key="feed" filters={{ feed: true }} />} />
          <Route path={NEWS.SUBPATHS.DISCOVER} element={<DiscoverNews />} />
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
          <Route path={ACCOUNT.SETTINGS} element={<Settings />} />
        </Route>
        <Route path={`${EXPENSE_ORDER.ROOT}/*`}>
          <Route index element={<ListExpenseOrders />} />
          <Route path={`${EXPENSE_ORDER.VIEW}`} element={<ViewExpenseOrder />} />
        </Route>
        <Route path={SEARCH.ROOT} element={<SearchPage />} />
      </Route>

      {/* Studio Routes */}
      <Route path={`${PATHS.STUDIO_ROOT}/*`} element={<PrivateRoute><StudioLayout /></PrivateRoute>}>
        {/* <Route index element={<Studio />} /> */}
        <Route path={`${NEWS.ROOT}/*`}>
          <Route index element={<ListNewsStudio />} />
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
        <Route path={`${EXPENSE_ORDER.ROOT}/*`}>
          <Route index element={<ListExpenseOrdersStudio />} />
          <Route path={`${EXPENSE_ORDER.CREATE}`} element={<CreateExpenseOrderStudio />} />
          <Route path={`${EXPENSE_ORDER.EDIT}/:id`} element={<EditExpenseOrderStudio />} />
          <Route path={`${EXPENSE_ORDER.VIEW}`} element={<ViewExpenseOrderStudio />} />
        </Route>
        <Route path={SEARCH.ROOT} element={<SearchPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path={`${PATHS.ADMIN_ROOT}/*`} element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path={ADMIN.DASHBOARD} element={<AdminDashboard />} />
        <Route path={ADMIN.NEWS} element={<NewsAdmin />} />
        <Route path={ADMIN.POLLS} element={<PollAdmin />} />
        <Route path={ADMIN.CHANNELS} element={<ChannelAdmin />} />
        <Route path={ADMIN.EXPENSE_ORDERS} element={<ExpenseOrderAdmin />} />
        <Route path={ADMIN.PAYOUTS} element={<PayoutAdmin />} />
        <Route path={ADMIN.TAGS} element={<TagAdmin />} />
        <Route path={ADMIN.USERS} element={<UserAdmin />} />
        <Route path={`${ADMIN.SUBSCRIPTIONS}/*`}>
          <Route index element={<SubscriptionAdmin />} />
          <Route path={SUBSCRIPTION.MANAGEMENT} element={<SubscriptionManagement />} />
          <Route path={SUBSCRIPTION.ANALYTICS} element={<SubscriptionAnalytics />} />
          <Route path={SUBSCRIPTION.REVENUE} element={<RevenueTracking />} />
        </Route>
        <Route path={ADMIN.ANALYTICS} element={<PlatformAnalytics />} />
        <Route path={ADMIN.SETTINGS} element={<AdminSettings />} />
        
        {/* Legacy routes for backwards compatibility */}
        <Route path="users" element={<UserManagement />} />
        <Route path="channels" element={<ChannelManagement />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
