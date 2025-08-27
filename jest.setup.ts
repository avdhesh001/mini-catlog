import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage for Jest (native module is not available in Jest env)
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock Reanimated
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Mock RN Localize and initialize i18n to English for tests
jest.mock('react-native-localize', () => ({
  getLocales: () => [{ languageCode: 'en' }],
}));

try {
  const { setupI18n } = require('./src/i18n');
  setupI18n();
} catch {}

// Mock navigation helpers to avoid setOptions errors in tests
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ setOptions: jest.fn(), navigate: jest.fn() }),
  };
});
