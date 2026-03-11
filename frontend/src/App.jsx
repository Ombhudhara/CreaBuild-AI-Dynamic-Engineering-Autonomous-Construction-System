import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout & Protection
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import GuestRoute from './components/GuestRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ConfigPage from './pages/ConfigPage';
import AnalysisPage from './pages/AnalysisPage';
import UserManagementPage from './pages/UserManagementPage';
import ProjectsPage from './pages/ProjectsPage';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glassmorphism border-white/10 text-white',
          style: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          },
        }}
      />

      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        } />
        <Route path="/signup" element={
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        } />

        {/* PROTECTED ROUTES */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        <Route path="/projects" element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        } />

        <Route path="/projects/create" element={
          <RoleProtectedRoute allowedRoles={['admin', 'engineer']}>
            <CreateProjectPage />
          </RoleProtectedRoute>
        } />

        <Route path="/projects/edit/:id" element={
          <RoleProtectedRoute allowedRoles={['admin', 'engineer']}>
            <ProjectDetailsPage />
          </RoleProtectedRoute>
        } />

        <Route path="/config" element={
          <RoleProtectedRoute allowedRoles={['admin', 'engineer']}>
            <ConfigPage />
          </RoleProtectedRoute>
        } />

        <Route path="/analysis" element={
          <RoleProtectedRoute allowedRoles={['admin', 'engineer']}>
            <AnalysisPage />
          </RoleProtectedRoute>
        } />

        <Route path="/users" element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <UserManagementPage />
          </RoleProtectedRoute>
        } />

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
