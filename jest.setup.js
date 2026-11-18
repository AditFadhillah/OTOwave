/* global jest */
jest.mock('react-native-track-player', () => ({
  __esModule: true,
  default: {
    setupPlayer: jest.fn(),
    updateOptions: jest.fn(),
    addEventListener: jest.fn(),
    registerPlaybackService: jest.fn(),
  },
  Capability: {},
  Event: {},
  AppKilledPlaybackBehavior: {},
}));
