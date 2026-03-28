// Mock Firebase for demo mode
// Replace with real Firebase config for production

// Simulate Firebase Auth for demo
class MockAuth {
  currentUser = null;
}

// Create mock instances that won't throw errors
export const auth = new MockAuth();

// Mock provider for sign-in attempts
export class MockGoogleAuthProvider {
  constructor() {
    this.providerId = 'google.com';
  }
}

export const googleProvider = new MockGoogleAuthProvider();
export const db = null;

// Mock core Firebase functions for demo
export const signOutMock = async () => Promise.resolve();

export default {
  auth,
  googleProvider,
  db,
};

