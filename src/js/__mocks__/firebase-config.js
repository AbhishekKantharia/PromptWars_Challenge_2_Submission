/**
 * Manual mock for firebase-config.js.
 * Placed in src/js/__mocks__/ so Jest automatically uses it
 * when any module imports './firebase-config.js'.
 * Call jest.mock('../firebase-config.js') in tests to activate.
 */
export const initializeFirebase = jest.fn().mockResolvedValue(true);
export const isFirebaseConfigured = jest.fn().mockReturnValue(false);
export const getAuthInstance = jest.fn().mockReturnValue(null);
export const getAnalyticsInstance = jest.fn().mockReturnValue(null);
export const getDbInstance = jest.fn().mockReturnValue(null);
export const getAppInstance = jest.fn().mockReturnValue(null);
