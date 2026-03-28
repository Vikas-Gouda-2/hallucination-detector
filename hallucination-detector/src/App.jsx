import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Suspense, lazy, useState } from 'react';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ScanDetail from './pages/ScanDetail';
import Demo from './pages/Demo';

// Lazy load heavy pages
const Analytics = lazy(() => import('./pages/Analytics'));
const History = lazy(() => import('./pages/History'));

// Loading fallback
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#020617' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="text-5xl"
      >
        🔍
      </motion.div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

// Floating Capsule Navbar
function FloatingNav({ user, logout }) {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const navItems = user
    ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Analytics', href: '/analytics' },
        { label: 'History', href: '/history' },
        { label: 'Demo', href: '/demo' },
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'Demo', href: '/demo' },
      ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <nav className="flex items-center gap-2 px-4 py-2.5 rounded-full glass shadow-glass" style={{
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(148, 163, 184, 0.12)'
      }}>
        {/* Logo */}
        <a href={user ? '/dashboard' : '/'} className="flex items-center gap-2 mr-4 group">
          <span className="text-xl">🧠</span>
          <span className="font-display font-bold text-white group-hover:text-indigo-400 transition-colors">
            Truth<span className="text-indigo-400">Lens</span>
          </span>
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* CTA / Sign Out */}
        {user ? (
          <button
            onClick={logout}
            className="ml-3 px-4 py-1.5 rounded-full text-sm font-semibold bg-white text-slate-900 hover:bg-slate-200 transition-all duration-200"
          >
            Sign Out
          </button>
        ) : (
          <a
            href="/"
            className="ml-3 px-4 py-1.5 rounded-full text-sm font-semibold bg-white text-slate-900 hover:bg-slate-200 transition-all duration-200"
          >
            Launch App
          </a>
        )}
      </nav>
    </motion.header>
  );
}

// Layout Component
function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen" style={{ background: '#020617' }}>
      <FloatingNav user={user} logout={logout} />
      <div className="pt-20 min-h-screen">
        {children}
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const { loading } = useAuth();

  if (loading) return <LoadingFallback />;

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/demo" element={<Demo />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scan/:scanId"
            element={
              <ProtectedRoute>
                <ScanDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <Analytics />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <History />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
