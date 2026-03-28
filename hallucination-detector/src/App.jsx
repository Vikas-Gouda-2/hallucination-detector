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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full px-4"
    >
      <nav
        className="max-w-2xl mx-auto flex items-center justify-between gap-4 px-6 py-3.5 rounded-2xl glass shadow-glass backdrop-blur-xl transition-all duration-300"
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Logo */}
        <motion.a
          href={user ? '/dashboard' : '/'}
          className="flex items-center gap-2.5 group flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-xl">🧠</span>
          <span className="font-display font-bold text-white group-hover:text-indigo-400 transition-colors hidden sm:inline">
            Truth<span className="text-indigo-400">Lens</span>
          </span>
        </motion.a>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <motion.a
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
              </motion.a>
            );
          })}
        </div>

        {/* CTA / Sign Out */}
        {user ? (
          <motion.button
            onClick={logout}
            className="ml-auto px-5 py-2 rounded-lg text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-all duration-300 border border-white/10"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Out
          </motion.button>
        ) : (
          <motion.a
            href="/"
            className="ml-auto px-5 py-2 rounded-lg text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Launch
          </motion.a>
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
