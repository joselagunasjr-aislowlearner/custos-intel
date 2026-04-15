import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ProjectListPage } from './components/projects/ProjectListPage';
import { ProjectDetailPage } from './components/projects/ProjectDetailPage';
import { CodeReferencePage } from './components/codes/CodeReferencePage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
        { index: true, element: <Navigate to="/projects" replace /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <RegisterPage /> },
        {
          path: 'projects',
          element: <ProtectedRoute><ProjectListPage /></ProtectedRoute>,
        },
        {
          path: 'projects/:id',
          element: <ProtectedRoute><ProjectDetailPage /></ProtectedRoute>,
        },
        {
          path: 'codes',
          element: <ProtectedRoute><CodeReferencePage /></ProtectedRoute>,
        },
        {
          path: 'codes/:category',
          element: <ProtectedRoute><CodeReferencePage /></ProtectedRoute>,
        },
      ],
    },
  ],
  { basename: '/custos-intel/' },
);
