// Test to verify win popup timing for auto spin vs manual spin
import { ShowWinPopup } from '../components/popups/WinPopup';
import { Container } from 'pixi.js';

// Mock PIXI.js components for testing
jest.mock('pixi.js', () => ({
  Container: jest.fn().mockImplementation(() => ({
    addChild: jest.fn(),
    removeChild: jest.fn(),
    destroy: jest.fn(),
    zIndex: 0,
    x: 0,
    y: 0,
    scale: { x: 0, y: 0 }
  })),
  Graphics: jest.fn().mockImplementation(() => ({
    rect: jest.fn().mockReturnThis(),
    fill: jest.fn().mockReturnThis(),
    eventMode: 'static'
  })),
  Text: jest.fn().mockImplementation(() => ({
    anchor: { set: jest.fn() },
    x: 0,
    y: 0,
    text: ''
  })),
  Assets: {
    get: jest.fn().mockReturnValue({})
  }
}));

// Mock GSAP
jest.mock('gsap', () => ({
  to: jest.fn((target, config) => {
    // Simulate immediate completion for testing
    if (config.onComplete) {
      setTimeout(config.onComplete, 0);
    }
    return {};
  }),
  delayedCall: jest.fn((delay, callback) => {
    // Simulate delayed call with actual timing for testing
    setTimeout(callback, delay * 1000);
    return {};
  })
}));

// Mock createButton
jest.mock('../components/commons/Button', () => ({
  createButton: jest.fn().mockReturnValue({
    x: 0,
    y: 0,
    scale: { x: 0, y: 0 }
  })
}));

describe('Win Popup Auto Spin Timing', () => {
  let mockContainer: Container;

  beforeEach(() => {
    mockContainer = new Container();
    jest.clearAllMocks();
  });

  test('should complete faster for auto spin', async () => {
    const startTime = Date.now();
    
    await ShowWinPopup(800, 600, mockContainer, 'bigWin', {
      winAmount: 1000,
      isAutoSpin: true
    });
    
    const duration = Date.now() - startTime;
    
    // Should complete in approximately 1.5 seconds (allowing for some variance)
    expect(duration).toBeLessThan(2000);
    expect(duration).toBeGreaterThan(1000);
  });

  test('should take longer for manual spin', async () => {
    const startTime = Date.now();
    
    await ShowWinPopup(800, 600, mockContainer, 'bigWin', {
      winAmount: 1000,
      isAutoSpin: false
    });
    
    const duration = Date.now() - startTime;
    
    // Should complete in approximately 3 seconds (allowing for some variance)
    expect(duration).toBeLessThan(4000);
    expect(duration).toBeGreaterThan(2500);
  });

  test('should default to manual spin timing when isAutoSpin not specified', async () => {
    const startTime = Date.now();
    
    await ShowWinPopup(800, 600, mockContainer, 'bigWin', {
      winAmount: 1000
      // isAutoSpin not specified, should default to false
    });
    
    const duration = Date.now() - startTime;
    
    // Should complete in approximately 3 seconds (manual spin timing)
    expect(duration).toBeLessThan(4000);
    expect(duration).toBeGreaterThan(2500);
  });
});
