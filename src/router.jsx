import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AnalyticsDashboardPage } from './pages/AnalyticsDashboardPage';
import { RevenueOverviewPage } from './pages/RevenueOverviewPage';
import { PayoutManagementPage } from './pages/PayoutManagementPage';
import { PendingVerificationPage } from './pages/PendingVerificationPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { MaleUserProfilePage } from './pages/MaleUserProfilePage';
import { FemaleUserProfilePage } from './pages/FemaleUserProfilePage';
import { ChatStatisticsPage } from './pages/ChatStatisticsPage';
import { ChatTranscriptPage } from './pages/ChatTranscriptPage';
import { ChatReplayPage } from './pages/ChatReplayPage';
import { ChatDetailPage } from './pages/ChatDetailPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DASHBOARD_NAV_ITEMS } from './routes/dashboardRoutes';

const IMPLEMENTED_ROUTES = new Set([
  'analytics',
  'revenue',
  'payout',
  'verification',
  'users',
  'chats',
  'chat-detail',
  'transcript',
]);

const placeholderRoutes = DASHBOARD_NAV_ITEMS.filter(
  (item) => !IMPLEMENTED_ROUTES.has(item.id),
).map((item) => ({
  path: item.path.slice(1),
  element: (
    <PlaceholderPage
      title={item.title}
      description={`${item.label} workspace — aligned with the admin design system.`}
    />
  ),
}));

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/analytics" replace /> },
      { path: 'analytics', element: <AnalyticsDashboardPage /> },
      { path: 'revenue', element: <RevenueOverviewPage /> },
      { path: 'payout', element: <PayoutManagementPage /> },
      { path: 'verification', element: <PendingVerificationPage /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'users/:userId', element: <UserProfilePage /> },
      { path: 'users/male/:userId', element: <MaleUserProfilePage /> },
      { path: 'users/female/:userId', element: <FemaleUserProfilePage /> },
      { path: 'chats', element: <ChatStatisticsPage /> },
      { path: 'chats/detail', element: <ChatDetailPage /> },
      { path: 'transcript', element: <ChatTranscriptPage /> },
      { path: 'transcript/:chatId', element: <ChatReplayPage /> },
      ...placeholderRoutes,
      { path: '*', element: <Navigate to="/analytics" replace /> },
    ],
  },
]);
