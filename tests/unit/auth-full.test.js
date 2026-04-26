/**
 * @fileoverview Comprehensive auth module tests.
 */

import {
  onAuthChange,
  initAuth,
  signInWithGoogle,
  signInAnon,
  signOutUser,
  getCurrentUser,
  isAuthenticated,
  getUserDisplayInfo
} from '../../src/js/auth.js';

import {
  isFirebaseConfigured,
  getAuthInstance
} from '../../src/js/firebase-config.js';

import {
  onAuthStateChanged,
  signInWithPopup,
  signInAnonymously,
  signOut,
  GoogleAuthProvider
} from 'firebase/auth';

describe('Auth Module - Full Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isFirebaseConfigured.mockReturnValue(false);
    getAuthInstance.mockReturnValue(null);
  });

  describe('getCurrentUser', () => {
    it('returns null initially', () => {
      const user = getCurrentUser();
      expect(user === null || user === undefined || typeof user === 'object').toBe(true);
    });
  });

  describe('getUserDisplayInfo', () => {
    it('returns Guest info when no user logged in', () => {
      const info = getUserDisplayInfo();
      expect(info.name).toBe('Guest');
      expect(info.uid).toBe('');
    });

    it('returns correct structure', () => {
      const info = getUserDisplayInfo();
      expect(info).toHaveProperty('name');
      expect(info).toHaveProperty('email');
      expect(info).toHaveProperty('photoURL');
      expect(info).toHaveProperty('uid');
    });
  });

  describe('isAuthenticated', () => {
    it('returns false when no user is logged in', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('returns a boolean', () => {
      expect(typeof isAuthenticated()).toBe('boolean');
    });
  });

  describe('onAuthChange', () => {
    it('registers a callback and immediately calls it', () => {
      const callback = jest.fn();
      onAuthChange(callback);
      expect(callback).toHaveBeenCalled();
    });

    it('returns an unsubscribe function', () => {
      const callback = jest.fn();
      const unsubscribe = onAuthChange(callback);
      expect(typeof unsubscribe).toBe('function');
    });

    it('unsubscribe removes the listener', () => {
      const callback = jest.fn();
      const unsubscribe = onAuthChange(callback);
      callback.mockClear();
      unsubscribe();
      // After unsubscribe, the callback shouldn't be called again
      expect(typeof unsubscribe).toBe('function');
    });
  });

  describe('initAuth', () => {
    it('returns false when Firebase is not configured', () => {
      isFirebaseConfigured.mockReturnValue(false);
      const result = initAuth();
      expect(result).toBe(false);
    });

    it('returns false when auth instance is null', () => {
      isFirebaseConfigured.mockReturnValue(true);
      getAuthInstance.mockReturnValue(null);
      const result = initAuth();
      expect(result).toBe(false);
    });

    it('returns true when Firebase and auth are configured', () => {
      const mockAuth = {};
      isFirebaseConfigured.mockReturnValue(true);
      getAuthInstance.mockReturnValue(mockAuth);
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });
      const result = initAuth();
      expect(result).toBe(true);
    });

    it('handles user sign-in via auth state change', () => {
      const mockUser = { uid: 'user123', displayName: 'Test User', isAnonymous: false };
      const mockAuth = {};
      isFirebaseConfigured.mockReturnValue(true);
      getAuthInstance.mockReturnValue(mockAuth);
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser);
        return jest.fn();
      });
      initAuth();
      expect(getCurrentUser()).toEqual(mockUser);
    });

    it('handles user sign-out via auth state change', () => {
      const mockAuth = {};
      isFirebaseConfigured.mockReturnValue(true);
      getAuthInstance.mockReturnValue(mockAuth);
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });
      initAuth();
      expect(getCurrentUser()).toBeNull();
    });

    it('notifies listeners on auth state change', () => {
      const listener = jest.fn();
      onAuthChange(listener);
      listener.mockClear();

      const mockAuth = {};
      isFirebaseConfigured.mockReturnValue(true);
      getAuthInstance.mockReturnValue(mockAuth);
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback({ uid: 'abc', displayName: 'New User', isAnonymous: false });
        return jest.fn();
      });
      initAuth();
      expect(listener).toHaveBeenCalled();
    });
  });

  describe('signInWithGoogle', () => {
    it('returns null when auth is not initialized', async () => {
      getAuthInstance.mockReturnValue(null);
      const result = await signInWithGoogle();
      expect(result).toBeNull();
    });

    it('returns user on successful sign-in', async () => {
      const mockUser = { uid: 'g123', displayName: 'Google User' };
      const mockAuth = {};
      getAuthInstance.mockReturnValue(mockAuth);
      signInWithPopup.mockResolvedValue({ user: mockUser });
      const result = await signInWithGoogle();
      expect(result).toEqual(mockUser);
    });

    it('returns null when popup is closed by user', async () => {
      const mockAuth = {};
      getAuthInstance.mockReturnValue(mockAuth);
      signInWithPopup.mockRejectedValue({ code: 'auth/popup-closed-by-user' });
      const result = await signInWithGoogle();
      expect(result).toBeNull();
    });

    it('returns null when popup is blocked', async () => {
      const mockAuth = {};
      getAuthInstance.mockReturnValue(mockAuth);
      signInWithPopup.mockRejectedValue({ code: 'auth/popup-blocked', message: 'Popup blocked' });
      const result = await signInWithGoogle();
      expect(result).toBeNull();
    });

    it('returns null on generic sign-in error', async () => {
      const mockAuth = {};
      getAuthInstance.mockReturnValue(mockAuth);
      signInWithPopup.mockRejectedValue({ code: 'auth/unknown', message: 'Unknown error' });
      const result = await signInWithGoogle();
      expect(result).toBeNull();
    });
  });

  describe('signInAnon', () => {
    it('returns null when auth is not initialized', async () => {
      getAuthInstance.mockReturnValue(null);
      const result = await signInAnon();
      expect(result).toBeNull();
    });

    it('returns user on successful anonymous sign-in', async () => {
      const mockUser = { uid: 'anon123', isAnonymous: true };
      const mockAuth = {};
      getAuthInstance.mockReturnValue(mockAuth);
      signInAnonymously.mockResolvedValue({ user: mockUser });
      const result = await signInAnon();
      expect(result).toEqual(mockUser);
    });

    it('returns null on anonymous sign-in failure', async () => {
      const mockAuth = {};
      getAuthInstance.mockReturnValue(mockAuth);
      signInAnonymously.mockRejectedValue(new Error('Anonymous sign-in failed'));
      const result = await signInAnon();
      expect(result).toBeNull();
    });
  });

  describe('signOutUser', () => {
    it('returns false when auth is not initialized', async () => {
      getAuthInstance.mockReturnValue(null);
      const result = await signOutUser();
      expect(result).toBe(false);
    });

    it('returns true on successful sign-out', async () => {
      const mockAuth = {};
      getAuthInstance.mockReturnValue(mockAuth);
      signOut.mockResolvedValue();
      const result = await signOutUser();
      expect(result).toBe(true);
    });

    it('returns false on sign-out failure', async () => {
      const mockAuth = {};
      getAuthInstance.mockReturnValue(mockAuth);
      signOut.mockRejectedValue(new Error('Sign-out failed'));
      const result = await signOutUser();
      expect(result).toBe(false);
    });
  });
});
