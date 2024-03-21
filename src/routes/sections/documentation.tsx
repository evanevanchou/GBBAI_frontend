import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DocumentationLayout from 'src/layouts/documentation';

import { SplashScreen } from 'src/components/loading-screen';

// -------------------------------------------

const FaqsPage = lazy(() => import('src/pages/faqs'));
const DocumentationPage = lazy(() => import('src/pages/documentation/list'));

// ----------------------------------------------------------------------

export const docRoutes = [
  {
    path: 'gbb-ai',
    element: (
      <AuthGuard>
        <DocumentationLayout>
          <Suspense fallback={<SplashScreen />}>
            <Outlet />
          </Suspense>
        </DocumentationLayout>
      </AuthGuard>
    ),
    children: [
      {
        path: 'documentation',
        children: [
          { element: <DocumentationPage />, index: true },
          { path: ':section', element: <DocumentationPage /> },
          { path: 'faqs', element: <FaqsPage /> },
        ],
      },
    ],
  },
];
