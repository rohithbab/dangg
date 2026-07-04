import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DASHBOARD_NAV_ITEMS } from './routes/dashboardRoutes';

const AnalyticsDashboardPage = lazy(() => import('./pages/AnalyticsDashboardPage').then(m => ({ default: m.AnalyticsDashboardPage })));
const RevenueOverviewPage = lazy(() => import('./pages/RevenueOverviewPage').then(m => ({ default: m.RevenueOverviewPage })));
const PayoutManagementPage = lazy(() => import('./pages/PayoutManagementPage').then(m => ({ default: m.PayoutManagementPage })));
const PendingVerificationPage = lazy(() => import('./pages/PendingVerificationPage').then(m => ({ default: m.PendingVerificationPage })));
const UserManagementPage = lazy(() => import('./pages/UserManagementPage').then(m => ({ default: m.UserManagementPage })));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage').then(m => ({ default: m.UserProfilePage })));
const MaleUserProfilePage = lazy(() => import('./pages/MaleUserProfilePage').then(m => ({ default: m.MaleUserProfilePage })));
const FemaleUserProfilePage = lazy(() => import('./pages/FemaleUserProfilePage').then(m => ({ default: m.FemaleUserProfilePage })));
const ChatStatisticsPage = lazy(() => import('./pages/ChatStatisticsPage').then(m => ({ default: m.ChatStatisticsPage })));
const ChatTranscriptPage = lazy(() => import('./pages/ChatTranscriptPage').then(m => ({ default: m.ChatTranscriptPage })));
const ChatReplayPage = lazy(() => import('./pages/ChatReplayPage').then(m => ({ default: m.ChatReplayPage })));
const ChatDetailPage = lazy(() => import('./pages/ChatDetailPage').then(m => ({ default: m.ChatDetailPage })));
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage').then(m => ({ default: m.PlaceholderPage })));

function PageLoader() {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
    </div>
  );
}

function Lazy({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

const IMPLEMENTED_ROUTES = new Set([
  'analytics', 'revenue', 'payout', 'verification',
  'users', 'chats', 'chat-detail', 'transcript',
]);

const placeholderRoutes = DASHBOARD_NAV_ITEMS.filter(
  (item) => !IMPLEMENTED_ROUTES.has(item.id),
).map((item) => ({
  path: item.path.slice(1),
  element: (
    <Lazy>
      <PlaceholderPage
        title={item.title}
        description={`${item.label} workspace — aligned with the admin design system.`}
      />
    </Lazy>
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
      { path: 'analytics', element: <Lazy><AnalyticsDashboardPage /></Lazy> },
      { path: 'revenue', element: <Lazy><RevenueOverviewPage /></Lazy> },
      { path: 'payout', element: <Lazy><PayoutManagementPage /></Lazy> },
      { path: 'verification', element: <Lazy><PendingVerificationPage /></Lazy> },
      { path: 'users', element: <Lazy><UserManagementPage /></Lazy> },
      { path: 'users/:userId', element: <Lazy><UserProfilePage /></Lazy> },
      { path: 'users/male/:userId', element: <Lazy><MaleUserProfilePage /></Lazy> },
      { path: 'users/female/:userId', element: <Lazy><FemaleUserProfilePage /></Lazy> },
      { path: 'chats', element: <Lazy><ChatStatisticsPage /></Lazy> },
      { path: 'chats/detail', element: <Lazy><ChatDetailPage /></Lazy> },
      { path: 'transcript', element: <Lazy><ChatTranscriptPage /></Lazy> },
      { path: 'transcript/:chatId', element: <Lazy><ChatReplayPage /></Lazy> },
      ...placeholderRoutes,
      { path: '*', element: <Navigate to="/analytics" replace /> },
    ],
  },
]);
