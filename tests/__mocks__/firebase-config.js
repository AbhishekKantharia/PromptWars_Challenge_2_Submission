export const initializeFirebase = jest.fn().mockResolvedValue(true);
export const isFirebaseConfigured = jest.fn().mockReturnValue(false);
export const getAuthInstance = jest.fn().mockReturnValue(null);
export const getAnalyticsInstance = jest.fn().mockReturnValue(null);
export const getDbInstance = jest.fn().mockReturnValue(null);
export const getAppInstance = jest.fn().mockReturnValue(null);