// Test to verify autoplay stops after current round completes
import { GlobalState } from '../globals/gameState';

describe('Autoplay Round Completion', () => {
  beforeEach(() => {
    // Reset state before each test
    GlobalState.setIsAutoSpin(false);
    GlobalState.setIsRoundInProgress(false);
  });

  test('should track round in progress state', () => {
    // Initially no round in progress
    expect(GlobalState.getIsRoundInProgress()).toBe(false);

    // Start a round
    GlobalState.setIsRoundInProgress(true);
    expect(GlobalState.getIsRoundInProgress()).toBe(true);

    // End the round
    GlobalState.setIsRoundInProgress(false);
    expect(GlobalState.getIsRoundInProgress()).toBe(false);
  });

  test('should track autoplay state', () => {
    // Initially autoplay is off
    expect(GlobalState.getIsAutoSpin()).toBe(false);

    // Start autoplay
    GlobalState.setIsAutoSpin(true);
    expect(GlobalState.getIsAutoSpin()).toBe(true);

    // Stop autoplay
    GlobalState.setIsAutoSpin(false);
    expect(GlobalState.getIsAutoSpin()).toBe(false);
  });

  test('should handle autoplay stop during round', () => {
    // Start autoplay and a round
    GlobalState.setIsAutoSpin(true);
    GlobalState.setIsRoundInProgress(true);

    // Stop autoplay while round is in progress
    GlobalState.setIsAutoSpin(false);

    // Round should still be in progress
    expect(GlobalState.getIsRoundInProgress()).toBe(true);
    expect(GlobalState.getIsAutoSpin()).toBe(false);

    // Complete the round
    GlobalState.setIsRoundInProgress(false);
    expect(GlobalState.getIsRoundInProgress()).toBe(false);
  });
});
