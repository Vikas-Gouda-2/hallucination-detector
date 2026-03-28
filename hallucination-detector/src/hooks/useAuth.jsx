import { useState, useEffect, useContext, createContext } from 'react';
import { auth } from '../lib/firebase';

// Create Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if Firebase is available (mock mode check)
  const isFirebaseAvailable = auth && typeof auth === 'object';

  useEffect(() => {
    // In demo mode, start with no auth required
    setLoading(false);
  }, []);

  // Sign in with Google - Demo mode allows direct entry
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Demo mode: Create mock user
      setUser({
        uid: 'demo-user-' + Date.now(),
        email: 'demo@truthlens.ai',
        displayName: 'Demo User',
        photoURL: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70),
      });
    } catch (err) {
      console.error('❌ Sign in error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setUser(null);
    } catch (err) {
      console.error('❌ Sign out error:', err);
      setError(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
