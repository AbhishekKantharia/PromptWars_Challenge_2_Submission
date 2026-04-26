/**
 * @fileoverview Analytics module full coverage tests.
 */

jest.mock('firebase/analytics', () => ({
  logEvent: jest.fn(),
  getAnalytics: jest.fn().mockReturnValue({}),
  isSupported: jest.fn().mockResolvedValue(true)
}));

import {
  trackEvent,
  trackPageView,
  trackQuizComplete,
  trackChatInteraction,
  trackTimelineView,
  trackGlossaryLookup,
  trackChecklistAction,
  trackAuthEvent
} from '../../src/js/analytics.js';

import { isFirebaseConfigured, getAnalyticsInstance } from '../../src/js/firebase-config.js';

describe('Analytics Module - Full Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('trackEvent', () => {
    it('does nothing when Firebase is not configured', () => {
      isFirebaseConfigured.mockReturnValue(false);
      expect(() => trackEvent('test_event')).not.toThrow();
    });

    it('does nothing when analytics instance is null', () => {
      isFirebaseConfigured.mockReturnValue(true);
      getAnalyticsInstance.mockReturnValue(null);
      expect(() => trackEvent('test_event')).not.toThrow();
    });

    it('logs event when Firebase is configured with valid analytics', () => {
      const { logEvent } = require('firebase/analytics');
      const mockAnalytics = {};
      isFirebaseConfigured.mockReturnValue(true);
      getAnalyticsInstance.mockReturnValue(mockAnalytics);
      trackEvent('test_event', { param: 'value' });
      expect(logEvent).toHaveBeenCalledWith(mockAnalytics, 'test_event', { param: 'value' });
    });

    it('handles errors from logEvent gracefully', () => {
      const { logEvent } = require('firebase/analytics');
      logEvent.mockImplementation(() => { throw new Error('Analytics error'); });
      const mockAnalytics = {};
      isFirebaseConfigured.mockReturnValue(true);
      getAnalyticsInstance.mockReturnValue(mockAnalytics);
      expect(() => trackEvent('test_event')).not.toThrow();
    });
  });

  describe('trackPageView', () => {
    it('calls trackEvent with page_view event', () => {
      isFirebaseConfigured.mockReturnValue(false);
      expect(() => trackPageView('home')).not.toThrow();
    });

    it('includes page_title in params', () => {
      const { logEvent } = require('firebase/analytics');
      logEvent.mockImplementation(() => {});
      const mockAnalytics = {};
      isFirebaseConfigured.mockReturnValue(true);
      getAnalyticsInstance.mockReturnValue(mockAnalytics);
      trackPageView('timeline');
      expect(logEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'page_view',
        expect.objectContaining({ page_title: 'timeline' })
      );
    });
  });

  describe('trackQuizComplete', () => {
    it('does not throw', () => {
      isFirebaseConfigured.mockReturnValue(false);
      expect(() => trackQuizComplete(85, 'beginner', 'voting')).not.toThrow();
    });

    it('passes score, difficulty and category', () => {
      const { logEvent } = require('firebase/analytics');
      logEvent.mockImplementation(() => {});
      const mockAnalytics = {};
      isFirebaseConfigured.mockReturnValue(true);
      getAnalyticsInstance.mockReturnValue(mockAnalytics);
      trackQuizComplete(90, 'intermediate', 'process');
      expect(logEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'quiz_complete',
        expect.objectContaining({ score: 90, difficulty: 'intermediate', category: 'process' })
      );
    });
  });

  describe('trackChatInteraction', () => {
    it('does not throw', () => {
      isFirebaseConfigured.mockReturnValue(false);
      expect(() => trackChatInteraction('message_sent')).not.toThrow();
    });

    it('passes the action parameter', () => {
      const { logEvent } = require('firebase/analytics');
      logEvent.mockImplementation(() => {});
      const mockAnalytics = {};
      isFirebaseConfigured.mockReturnValue(true);
      getAnalyticsInstance.mockReturnValue(mockAnalytics);
      trackChatInteraction('opened');
      expect(logEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'chat_interaction',
        { action: 'opened' }
      );
    });
  });

  describe('trackTimelineView', () => {
    it('does not throw', () => {
      isFirebaseConfigured.mockReturnValue(false);
      expect(() => trackTimelineView('general', 'Polling Day')).not.toThrow();
    });

    it('passes election_type and phase', () => {
      const { logEvent } = require('firebase/analytics');
      logEvent.mockImplementation(() => {});
      const mockAnalytics = {};
      isFirebaseConfigured.mockReturnValue(true);
      getAnalyticsInstance.mockReturnValue(mockAnalytics);
      trackTimelineView('state', 'Campaign');
      expect(logEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'timeline_view',
        { election_type: 'state', phase: 'Campaign' }
      );
    });
  });

  describe('trackGlossaryLookup', () => {
    it('does not throw', () => {
      isFirebaseConfigured.mockReturnValue(false);
      expect(() => trackGlossaryLookup('EVM')).not.toThrow();
    });

    it('passes term to event', () => {
      const { logEvent } = require('firebase/analytics');
      logEvent.mockImplementation(() => {});
      const mockAnalytics = {};
      isFirebaseConfigured.mockReturnValue(true);
      getAnalyticsInstance.mockReturnValue(mockAnalytics);
      trackGlossaryLookup('EPIC');
      expect(logEvent).toHaveBeenCalledWith(mockAnalytics, 'glossary_lookup', { term: 'EPIC' });
    });
  });

  describe('trackChecklistAction', () => {
    it('does not throw', () => {
      isFirebaseConfigured.mockReturnValue(false);
      expect(() => trackChecklistAction('voter-id', true)).not.toThrow();
    });

    it('passes item_id and completed', () => {
      const { logEvent } = require('firebase/analytics');
      logEvent.mockImplementation(() => {});
      const mockAnalytics = {};
      isFirebaseConfigured.mockReturnValue(true);
      getAnalyticsInstance.mockReturnValue(mockAnalytics);
      trackChecklistAction('check-roll', false);
      expect(logEvent).toHaveBeenCalledWith(
        mockAnalytics,
        'checklist_action',
        { item_id: 'check-roll', completed: false }
      );
    });
  });

  describe('trackAuthEvent', () => {
    it('does not throw', () => {
      isFirebaseConfigured.mockReturnValue(false);
      expect(() => trackAuthEvent('google')).not.toThrow();
    });

    it('passes the method parameter', () => {
      const { logEvent } = require('firebase/analytics');
      logEvent.mockImplementation(() => {});
      const mockAnalytics = {};
      isFirebaseConfigured.mockReturnValue(true);
      getAnalyticsInstance.mockReturnValue(mockAnalytics);
      trackAuthEvent('signout');
      expect(logEvent).toHaveBeenCalledWith(mockAnalytics, 'auth_action', { method: 'signout' });
    });
  });
});
