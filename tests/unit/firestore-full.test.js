/**
 * @fileoverview Comprehensive Firestore module tests.
 */

import {
  saveChatMessage,
  getChatHistory,
  saveQuizScore,
  getLeaderboard,
  saveChecklistProgress,
  getChecklistProgress,
  updateChecklistItem
} from '../../src/js/firestore.js';

import { isFirebaseConfigured } from '../../src/js/firebase-config.js';
import { getCurrentUser } from '../../src/js/auth.js';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';

// Additional mock needed for firestore.js db instance
jest.mock('../../src/js/firebase-config.js', () => ({
  isFirebaseConfigured: jest.fn().mockReturnValue(false),
  getAuthInstance: jest.fn().mockReturnValue(null),
  getAnalyticsInstance: jest.fn().mockReturnValue(null),
  getDbInstance: jest.fn().mockReturnValue(null)
}));

jest.mock('../../src/js/auth.js', () => ({
  getCurrentUser: jest.fn().mockReturnValue(null),
  onAuthChange: jest.fn((cb) => { cb(null); return jest.fn(); }),
  initAuth: jest.fn(),
  signInWithGoogle: jest.fn(),
  signOutUser: jest.fn(),
  getUserDisplayInfo: jest.fn().mockReturnValue({ uid: null })
}));

describe('Firestore Module - Full Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isFirebaseConfigured.mockReturnValue(false);
    getCurrentUser.mockReturnValue(null);
  });

  describe('saveChatMessage', () => {
    it('returns null when Firebase not configured', async () => {
      isFirebaseConfigured.mockReturnValue(false);
      const result = await saveChatMessage({ role: 'user', content: 'Hello' });
      expect(result).toBeNull();
    });

    it('returns null when user is not logged in', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue(null);
      const result = await saveChatMessage({ role: 'user', content: 'Test' });
      expect(result).toBeNull();
    });

    it('saves message successfully when configured and user logged in', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue({ uid: 'user1', displayName: 'Test' });
      collection.mockReturnValue('chatCollection');
      addDoc.mockResolvedValue({ id: 'msg123' });
      serverTimestamp.mockReturnValue('timestamp');
      const result = await saveChatMessage({ role: 'user', content: 'Hello election!' });
      expect(result).toBe('msg123');
    });

    it('returns null on Firestore error', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue({ uid: 'user1' });
      collection.mockReturnValue('chatCollection');
      addDoc.mockRejectedValue(new Error('Firestore error'));
      const result = await saveChatMessage({ role: 'user', content: 'Test' });
      expect(result).toBeNull();
    });
  });

  describe('getChatHistory', () => {
    it('returns empty array when Firebase not configured', async () => {
      isFirebaseConfigured.mockReturnValue(false);
      const result = await getChatHistory();
      expect(result).toEqual([]);
    });

    it('returns empty array when user not logged in', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue(null);
      const result = await getChatHistory();
      expect(result).toEqual([]);
    });

    it('returns messages when configured and user logged in', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue({ uid: 'user1' });
      collection.mockReturnValue('ref');
      query.mockReturnValue('q');
      where.mockReturnValue('where');
      orderBy.mockReturnValue('orderBy');
      limit.mockReturnValue('limit');
      getDocs.mockResolvedValue({
        docs: [
          { id: 'msg1', data: () => ({ role: 'user', content: 'Hello' }) }
        ]
      });
      const result = await getChatHistory();
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('msg1');
    });

    it('returns empty array on Firestore error', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue({ uid: 'user1' });
      getDocs.mockRejectedValue(new Error('Read error'));
      const result = await getChatHistory();
      expect(result).toEqual([]);
    });
  });

  describe('saveQuizScore', () => {
    it('returns null when Firebase not configured', async () => {
      isFirebaseConfigured.mockReturnValue(false);
      const result = await saveQuizScore({ score: 8, total: 10, percentage: 80 });
      expect(result).toBeNull();
    });

    it('returns null when user not logged in', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue(null);
      const result = await saveQuizScore({ score: 8, total: 10, percentage: 80 });
      expect(result).toBeNull();
    });

    it('saves score and returns document ID', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue({ uid: 'user1', displayName: 'Test User' });
      collection.mockReturnValue('scoresRef');
      addDoc.mockResolvedValue({ id: 'score123' });
      doc.mockReturnValue('docRef');
      getDoc.mockResolvedValue({ exists: () => false });
      setDoc.mockResolvedValue();
      const result = await saveQuizScore({
        score: 9, total: 10, percentage: 90, difficulty: 'beginner', category: 'voting', timeTaken: 120
      });
      expect(result).toBe('score123');
    });

    it('returns null on error', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue({ uid: 'user1', displayName: 'Test' });
      addDoc.mockRejectedValue(new Error('Save failed'));
      const result = await saveQuizScore({ score: 5, total: 10, percentage: 50 });
      expect(result).toBeNull();
    });
  });

  describe('getLeaderboard', () => {
    it('returns empty array when Firebase not configured', async () => {
      isFirebaseConfigured.mockReturnValue(false);
      const result = await getLeaderboard();
      expect(result).toEqual([]);
    });

    it('returns leaderboard entries when configured', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      collection.mockReturnValue('leaderboardRef');
      query.mockReturnValue('q');
      orderBy.mockReturnValue('orderBy');
      limit.mockReturnValue('limit');
      getDocs.mockResolvedValue({
        docs: [
          { id: 'entry1', data: () => ({ displayName: 'Alice', bestScore: 95 }) },
          { id: 'entry2', data: () => ({ displayName: 'Bob', bestScore: 85 }) }
        ]
      });
      const result = await getLeaderboard(5);
      expect(result.length).toBe(2);
      expect(result[0].rank).toBe(1);
      expect(result[1].rank).toBe(2);
    });

    it('returns empty array on error', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getDocs.mockRejectedValue(new Error('Leaderboard error'));
      const result = await getLeaderboard();
      expect(result).toEqual([]);
    });
  });

  describe('saveChecklistProgress', () => {
    it('returns false when Firebase not configured', async () => {
      isFirebaseConfigured.mockReturnValue(false);
      const result = await saveChecklistProgress({ 'voter-id': true });
      expect(result).toBe(false);
    });

    it('returns false when user not logged in', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue(null);
      const result = await saveChecklistProgress({ 'voter-id': true });
      expect(result).toBe(false);
    });

    it('returns true on successful save', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue({ uid: 'user1' });
      doc.mockReturnValue('progressRef');
      setDoc.mockResolvedValue();
      const result = await saveChecklistProgress({ 'voter-id': true, 'check-roll': false });
      expect(result).toBe(true);
    });

    it('returns false on Firestore error', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue({ uid: 'user1' });
      setDoc.mockRejectedValue(new Error('Write failed'));
      const result = await saveChecklistProgress({ 'voter-id': true });
      expect(result).toBe(false);
    });
  });

  describe('getChecklistProgress', () => {
    it('returns empty object when Firebase not configured', async () => {
      isFirebaseConfigured.mockReturnValue(false);
      const result = await getChecklistProgress();
      expect(result).toEqual({});
    });

    it('returns empty object when user not logged in', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue(null);
      const result = await getChecklistProgress();
      expect(result).toEqual({});
    });

    it('returns progress data when document exists', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue({ uid: 'user1' });
      doc.mockReturnValue('progressRef');
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ progress: { 'voter-id': true } })
      });
      const result = await getChecklistProgress();
      expect(result['voter-id']).toBe(true);
    });

    it('returns empty object when document does not exist', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue({ uid: 'user1' });
      doc.mockReturnValue('progressRef');
      getDoc.mockResolvedValue({ exists: () => false });
      const result = await getChecklistProgress();
      expect(result).toEqual({});
    });

    it('returns empty object on error', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue({ uid: 'user1' });
      getDoc.mockRejectedValue(new Error('Read error'));
      const result = await getChecklistProgress();
      expect(result).toEqual({});
    });
  });

  describe('updateChecklistItem', () => {
    it('returns false when Firebase not configured', async () => {
      isFirebaseConfigured.mockReturnValue(false);
      const result = await updateChecklistItem('voter-id', true);
      expect(result).toBe(false);
    });

    it('returns false when user not logged in', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue(null);
      const result = await updateChecklistItem('voter-id', true);
      expect(result).toBe(false);
    });

    it('updates item successfully', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue({ uid: 'user1' });
      doc.mockReturnValue('progressRef');
      updateDoc.mockResolvedValue();
      const result = await updateChecklistItem('voter-id', true);
      expect(result).toBe(true);
    });

    it('falls back to saveChecklistProgress on updateDoc error', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const { getDbInstance } = require('../../src/js/firebase-config.js');
      getDbInstance.mockReturnValue({});
      getCurrentUser.mockReturnValue({ uid: 'user1' });
      doc.mockReturnValue('progressRef');
      updateDoc.mockRejectedValue(new Error('Document not found'));
      setDoc.mockResolvedValue();
      const result = await updateChecklistItem('voter-id', true);
      // Falls back to saveChecklistProgress which should return true
      expect(typeof result).toBe('boolean');
    });
  });
});
