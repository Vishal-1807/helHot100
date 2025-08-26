/**
 * Centralized Game Button State Manager for Slot Game
 * Handles enabling/disabling of all game buttons during spin animations
 * Prevents users from interacting with buttons while reels are spinning
 */

import { Container } from 'pixi.js';
import { GlobalState } from '../globals/gameState';

// Interface for all button references that need state management
interface GameButtonReferences {
  // Top bar buttons
  homeButton?: Container;
  settingsButton?: Container;
  rulesButton?: Container;
  balanceTab?: Container;

  // Bottom bar buttons
  betTabButtons?: {
    valueBar?: Container;
    minusButton?: Container;
    plusButton?: Container;
  };
  spinButton?: Container;
  autoSpinButton?: Container;
  turboButton?: Container;
  winningsTab?: Container;
}

// Global state
let buttonReferences: GameButtonReferences = {};
let isInitialized = false;

/**
 * Initialize the button state manager with all button references
 */
export const initializeButtonStateManager = (buttons: GameButtonReferences): void => {
  if (isInitialized) {
    console.warn('🔘 ButtonStateManager: Already initialized, updating references...');
  }

  buttonReferences = { ...buttonReferences, ...buttons };
  isInitialized = true;

  console.log('🔘 ButtonStateManager: Initialized with button references:', {
    homeButton: !!buttons.homeButton,
    settingsButton: !!buttons.settingsButton,
    rulesButton: !!buttons.rulesButton,
    balanceTab: !!buttons.balanceTab,
    betTabButtons: !!buttons.betTabButtons,
    spinButton: !!buttons.spinButton,
    autoSpinButton: !!buttons.autoSpinButton,
    turboButton: !!buttons.turboButton,
    winningsTab: !!buttons.winningsTab
  });
};

/**
 * Add or update button references (for components created later)
 */
export const addButtonReferences = (buttons: Partial<GameButtonReferences>): void => {
  buttonReferences = { ...buttonReferences, ...buttons };
  console.log('🔘 ButtonStateManager: Added/updated button references');
};

/**
 * Helper function to safely set button disabled state
 */
const setButtonDisabled = (button: Container | undefined, disabled: boolean): void => {
  if (button && typeof (button as any).setDisabled === 'function') {
    (button as any).setDisabled(disabled);
  }
};

/**
 * Helper function to safely set button texture
 */
const setButtonTexture = (button: Container | undefined, texture: any): void => {
  if (button && typeof (button as any).setTexture === 'function') {
    (button as any).setTexture(texture);
  }
};

/**
 * Helper function to safely get button disabled state
 */
const getButtonDisabled = (button: Container | undefined): boolean => {
  if (button && typeof (button as any).getDisabled === 'function') {
    return (button as any).getDisabled();
  }
  return false;
};

/**
 * Disable all buttons during spin animation
 * Called when spin button is clicked
 */
export const disableButtonsDuringSpin = (): void => {
  console.log('🔘 ButtonStateManager: Disabling all buttons during spin...');

  let disabledCount = 0;

  // Disable top bar buttons
  // setButtonDisabled(buttonReferences.homeButton, true);
  setButtonDisabled(buttonReferences.settingsButton, true);
  setButtonDisabled(buttonReferences.rulesButton, true);
  disabledCount += 3;

  // Disable bet tab buttons
  if (buttonReferences.betTabButtons) {
    const { valueBar, minusButton, plusButton } = buttonReferences.betTabButtons;
    setButtonDisabled(valueBar, true);
    setButtonDisabled(minusButton, true);
    setButtonDisabled(plusButton, true);
    disabledCount += 3;
  }

  // Disable spin and auto-spin buttons
  setButtonDisabled(buttonReferences.spinButton, true);
  if (!GlobalState.getIsAutoSpin()) setButtonDisabled(buttonReferences.autoSpinButton, true);
  // Keep turbo button enabled during spins so users can toggle turbo mode
  // setButtonDisabled(buttonReferences.turboButton, true);
  disabledCount += 2;

  console.log(`🔘 ButtonStateManager: ${disabledCount} buttons disabled during spin`);
};

/**
 * Enable all buttons after spin animation completes
 */
export const enableButtonsAfterSpin = (): void => {
  console.log('🔘 ButtonStateManager: Enabling all buttons after spin...');

  let enabledCount = 0;

  // Enable top bar buttons
  // setButtonDisabled(buttonReferences.homeButton, false);
  setButtonDisabled(buttonReferences.settingsButton, false);
  setButtonDisabled(buttonReferences.rulesButton, false);
  enabledCount += 3;

  // Enable bet tab buttons
  if (buttonReferences.betTabButtons) {
    const { valueBar, minusButton, plusButton } = buttonReferences.betTabButtons;
    setButtonDisabled(valueBar, false);
    setButtonDisabled(minusButton, false);
    setButtonDisabled(plusButton, false);
    enabledCount += 3;
  }

  // Enable spin and auto-spin buttons
  setButtonDisabled(buttonReferences.spinButton, false);
  setButtonDisabled(buttonReferences.autoSpinButton, false);
  // Turbo button should always remain enabled
  setButtonDisabled(buttonReferences.turboButton, false);
  enabledCount += 3;

  console.log(`🔘 ButtonStateManager: ${enabledCount} buttons enabled after spin`);
};

/**
 * Get current state of all buttons (for debugging)
 */
export const getButtonStates = (): Record<string, boolean> => {
  const states: Record<string, boolean> = {};

  // Top bar buttons
  states['homeButton'] = getButtonDisabled(buttonReferences.homeButton);
  states['settingsButton'] = getButtonDisabled(buttonReferences.settingsButton);
  states['rulesButton'] = getButtonDisabled(buttonReferences.rulesButton);
  states['balanceTab'] = getButtonDisabled(buttonReferences.balanceTab);

  // Bet tab buttons
  if (buttonReferences.betTabButtons) {
    const { valueBar, minusButton, plusButton } = buttonReferences.betTabButtons;
    states['betTab_valueBar'] = getButtonDisabled(valueBar);
    states['betTab_minus'] = getButtonDisabled(minusButton);
    states['betTab_plus'] = getButtonDisabled(plusButton);
  }

  // Bottom bar buttons
  states['spinButton'] = getButtonDisabled(buttonReferences.spinButton);
  states['autoSpinButton'] = getButtonDisabled(buttonReferences.autoSpinButton);
  states['turboButton'] = getButtonDisabled(buttonReferences.turboButton);
  states['winningsTab'] = getButtonDisabled(buttonReferences.winningsTab);

  return states;
};

/**
 * Handle autospin state changes
 * Call this when autospin is stopped to re-enable all buttons
 */
export const handleAutoSpinStopped = (): void => {
  console.log('🔘 ButtonStateManager: Autospin stopped - enabling all buttons');
  enableButtonsAfterSpin();
  logButtonStates();
};

/**
 * Setup automatic listeners for game state changes
 */
export const setupGameStateListeners = (): void => {
  // Listen for game end to re-enable buttons
  GlobalState.addGameEndedListener(() => {
    console.log('🔘 ButtonStateManager: Game ended - enabling buttons');
    logButtonStates(); // Log states before enabling
    enableButtonsAfterSpin();
    logButtonStates(); // Log states after enabling
  });

  console.log('🔘 ButtonStateManager: Game state listeners registered');
};

/**
 * Start spin - disable all buttons during spin animation
 * Call this when the spin button is clicked
 */
export const startSpin = (): void => {
  console.log('🔘 ButtonStateManager: Starting spin - disabling buttons');
  disableButtonsDuringSpin();
  logButtonStates();
};

/**
 * End spin - enable all buttons after spin animation completes
 * Call this when the spin animation finishes (after all reels stop)
 * Note: Buttons remain disabled if autospin is active
 */
export const endSpin = (): void => {
  const isAutoSpinActive = GlobalState.getIsAutoSpin();

  if (isAutoSpinActive) {
    console.log('🔘 ButtonStateManager: Ending spin - keeping buttons disabled (autospin active)');
    // Keep buttons disabled during autospin, but allow autospin button to remain functional
    // Only enable the autospin button so users can stop autospin
    setButtonDisabled(buttonReferences.autoSpinButton, false);
  } else {
    console.log('🔘 ButtonStateManager: Ending spin - enabling buttons (autospin inactive)');
    enableButtonsAfterSpin();
  }

  logButtonStates();
};

/**
 * Switch spin button to stop button texture and keep it disabled
 * Call this when spin button is clicked and server request is sent
 */
export const switchSpinToStop = (): void => {
  console.log('🔘 ButtonStateManager: Switching spin button to stop button');
  const { spinButton } = buttonReferences;

  if (spinButton && typeof (spinButton as any).switchToStop === 'function') {
    (spinButton as any).switchToStop();
  }

  // Keep the button disabled until server response
  setButtonDisabled(spinButton, true);
};

/**
 * Enable stop button after successful server response
 * Call this when server responds successfully to allow stopping
 */
export const enableStopButton = (): void => {
  console.log('🔘 ButtonStateManager: Enabling stop button');
  const { spinButton } = buttonReferences;
  setButtonDisabled(spinButton, false);
};

/**
 * Switch stop button back to spin button and disable it
 * Call this when stop button is clicked or animations complete
 */
export const switchStopToSpin = (): void => {
  console.log('🔘 ButtonStateManager: Switching stop button back to spin button');
  const { spinButton } = buttonReferences;

  if (spinButton && typeof (spinButton as any).switchToSpin === 'function') {
    (spinButton as any).switchToSpin();
  }

  // Keep disabled until animations complete
  setButtonDisabled(spinButton, true);
};

/**
 * Set spin button disabled state specifically
 * Helper function for external control
 */
export const setSpinButtonDisabled = (disabled: boolean): void => {
  console.log(`🔘 ButtonStateManager: Setting spin button disabled: ${disabled}`);
  setButtonDisabled(buttonReferences.spinButton, disabled);
};

/**
 * Debug function to log current button states
 */
export const logButtonStates = (): void => {
  const states = getButtonStates();
  console.log('🔘 ButtonStateManager: Current button states:', states);

  const disabledButtons = Object.entries(states).filter(([_, disabled]) => disabled);
  const enabledButtons = Object.entries(states).filter(([_, disabled]) => !disabled);

  console.log(`🔘 Disabled buttons (${disabledButtons.length}):`, disabledButtons.map(([name]) => name));
  console.log(`🔘 Enabled buttons (${enabledButtons.length}):`, enabledButtons.map(([name]) => name));
};

/**
 * Cleanup function
 */
export const destroyButtonStateManager = (): void => {
  buttonReferences = {};
  isInitialized = false;
  console.log('🔘 ButtonStateManager: Destroyed');
};
