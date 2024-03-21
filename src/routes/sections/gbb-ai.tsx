import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// USER
const UserAccountPage = lazy(() => import('src/pages/gbb-ai/user/account'));
// TEST RENDER PAGE BY ROLE
// const PermissionDeniedPage = lazy(() => import('src/pages/gbb-ai/permission'));
// BLANK PAGE
// const BlankPage = lazy(() => import('src/pages/gbb-ai/blank'));
// FUNCTION
const FunctionPage = lazy(() => import('src/pages/gbb-ai/functions/list'));
const FunctionDetailPage = lazy(() => import('src/pages/gbb-ai/functions/details'));
// BENCHMARK
const BenchmarkPage = lazy(() => import('src/pages/gbb-ai/benchmark/list'));
const BenchmarkDetailPage = lazy(() => import('src/pages/gbb-ai/benchmark/details'));
// KB
const KbPage = lazy(() => import('src/pages/gbb-ai/datahub/list'));
const KbDetailPage = lazy(() => import('src/pages/gbb-ai/datahub/details'));
// APP GALLERY
const AppGalleryPage = lazy(() => import('src/pages/gbb-ai/app-gallery/list'));
const AppGalleryAppPage = lazy(() => import('src/pages/gbb-ai/app-gallery/details'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'gbb-ai',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      {
        path: 'app-gallery',
        children: [
          { element: <AppGalleryPage />, index: true },
          { path: 'list', element: <AppGalleryPage /> },
          { path: ':id', element: <AppGalleryAppPage /> },
          { path: ':id/edit', element: <AppGalleryAppPage /> },
        ],
      },
      {
        path: 'function',
        children: [
          { element: <FunctionPage />, index: true },
          { path: 'list', element: <FunctionPage /> },
          { path: ':id', element: <FunctionDetailPage /> },
          { path: ':id/edit', element: <FunctionDetailPage /> },
          // { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'benchmark',
        children: [
          { element: <BenchmarkPage />, index: true },
          { path: 'list', element: <BenchmarkPage /> },
          { path: ':id', element: <BenchmarkDetailPage /> },
          { path: ':id/edit', element: <BenchmarkDetailPage /> },
          // { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'kb',
        children: [
          { element: <KbPage />, index: true },
          { path: 'list', element: <KbPage /> },
          { path: ':id', element: <KbDetailPage /> },
          { path: ':id/edit', element: <KbDetailPage /> },
          // { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'user',
        children: [
          { element: <UserAccountPage />, index: true },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
    ],
  },
];
