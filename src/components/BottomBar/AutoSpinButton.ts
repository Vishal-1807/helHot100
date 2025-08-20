import { Container, Assets } from 'pixi.js';
import { createButton } from '../commons/Button';
import { UI_POS } from '../constants/Positions';
import { SoundManager } from '../../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';
import {spinClickHandler} from '../../components/Logic/spinClickHandler';
import { GlobalState } from '../../globals/gameState';
import { handleAutoSpinStopped } from '../../utils/gameButtonStateManager';

export const createAutoSpinButton = (appWidth: number, appHeight: number, gameContainer: any, reelContainer: any): Container => {
  const container = new Container();
  container.zIndex = 50;

  let autoSpinButtonRef: any;
  let autoSpinTimeoutId: number | null = null;

  // Function to handle auto-spin loop
  const handleAutoSpinLoop = async () => {
    if (!GlobalState.getIsAutoSpin()) {
      return; // Auto-spin was stopped
    }

    // Safety checks before spinning
    if (!gameContainer || !gameContainer.gameArea) {
      console.error('Auto-spin stopped: gameContainer or gameArea is undefined');
      GlobalState.setIsAutoSpin(false);
      handleAutoSpinStopped();
      return;
    }

    if (!reelContainer) {
      console.error('Auto-spin stopped: reelContainer is undefined');
      GlobalState.setIsAutoSpin(false);
      handleAutoSpinStopped();
      return;
    }

    try {
      // Execute one spin (mark as auto spin)
      await spinClickHandler(reelContainer, gameContainer, true);

      // Check if auto-spin is still active after the spin completes
      if (GlobalState.getIsAutoSpin()) {
        // Schedule the next spin with a small delay
        // spinClickHandler now properly waits for completion, so we just need a brief pause
        autoSpinTimeoutId = setTimeout(() => {
          handleAutoSpinLoop();
        }, 500); // 0.5 second delay between spins
      } else {
        // Auto-spin was stopped during the round, ensure proper cleanup
        console.log('🔄 Auto-spin was stopped during round - cleaning up');
        // Switch back to auto button texture
        if (autoSpinButton && typeof (autoSpinButton as any).setTexture === 'function') {
          (autoSpinButton as any).setTexture(Assets.get('autoSpinButton'));
        }
        handleAutoSpinStopped();
      }
    } catch (error) {
      console.error('Error during auto-spin:', error);
      // Stop auto-spin on error
      GlobalState.setIsAutoSpin(false);
      // Ensure round in progress flag is reset
      GlobalState.setIsRoundInProgress(false);
      // Switch back to auto button texture on error
      if (autoSpinButton && typeof (autoSpinButton as any).setTexture === 'function') {
        (autoSpinButton as any).setTexture(Assets.get('autoSpinButton'));
      }
      // Re-enable all buttons when autospin stops due to error
      handleAutoSpinStopped();
    }
  };

  const autoSpinButton = createButton({
    x: appWidth * UI_POS.AUTO_SPIN_BUTTON_X,
    y: appHeight * UI_POS.AUTO_SPIN_BUTTON_Y,
    width: appWidth * UI_POS.AUTO_SPIN_BUTTON_WIDTH,
    height: Math.max(appHeight * UI_POS.AUTO_SPIN_BUTTON_MAX_HEIGHT_RATIO, UI_POS.AUTO_SPIN_BUTTON_MIN_HEIGHT),
    texture: Assets.get('autoSpinButton'),
    borderRadius: 10,
    onClick: async () => {
      const currentAutoSpinState = GlobalState.getIsAutoSpin();

      // Toggle auto-spin state
      GlobalState.setIsAutoSpin(!currentAutoSpinState);

      if (!currentAutoSpinState) {
        // Starting auto-spin
        console.log('🔄 Auto spin started');
        console.log('🔧 DEBUG: gameContainer:', gameContainer ? 'exists' : 'undefined');
        console.log('🔧 DEBUG: gameContainer.gameArea:', gameContainer?.gameArea ? 'exists' : 'undefined');
        console.log('🔧 DEBUG: reelContainer:', reelContainer ? 'exists' : 'undefined');

        // Switch to stop button texture
        if (autoSpinButton && typeof (autoSpinButton as any).setTexture === 'function') {
          (autoSpinButton as any).setTexture(Assets.get('autoSpinStopButton'));
        }
        handleAutoSpinLoop();
      } else {
        // Stopping auto-spin
        const isRoundInProgress = GlobalState.getIsRoundInProgress();

        if (isRoundInProgress) {
          console.log('🔄 Auto spin stop requested - will finish current round');
          // Don't call handleAutoSpinStopped() here - let the round complete naturally
          // The cleanup will happen in handleAutoSpinLoop after the current round finishes
        } else {
          console.log('🔄 Auto spin stopped');
          // Switch back to auto button texture
          if (autoSpinButton && typeof (autoSpinButton as any).setTexture === 'function') {
            (autoSpinButton as any).setTexture(Assets.get('autoSpinButton'));
          }
          // Re-enable all buttons when autospin is stopped
          handleAutoSpinStopped();
        }

        // Always clear the timeout to prevent scheduling new rounds
        if (autoSpinTimeoutId) {
          clearTimeout(autoSpinTimeoutId);
          autoSpinTimeoutId = null;
        }
      }

      SoundManager.playUIClick();
      console.log('🔄 Auto spin button clicked');
      recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'autoSpinButton' });
    },
  });
  autoSpinButtonRef = autoSpinButton;

  // Function to update button texture based on autoSpin state
  const updateButtonTexture = () => {
    if (autoSpinButton && typeof (autoSpinButton as any).setTexture === 'function') {
      const isAutoSpinActive = GlobalState.getIsAutoSpin();
      const texture = isAutoSpinActive ? Assets.get('autoSpinStopButton') : Assets.get('autoSpinButton');
      (autoSpinButton as any).setTexture(texture);
    }
  };

  // Check and update texture periodically to handle external state changes
  const textureUpdateInterval = setInterval(() => {
    updateButtonTexture();
  }, 100); // Check every 100ms

  const resize = (newWidth: number, newHeight: number) => {
    if(!autoSpinButtonRef) return;
    // Update button position using setPosition method
    (autoSpinButtonRef as any).setPosition(newWidth * UI_POS.AUTO_SPIN_BUTTON_X, newHeight * UI_POS.AUTO_SPIN_BUTTON_Y);

    // Update button size using setSize method
    (autoSpinButtonRef as any).setSize(newWidth * UI_POS.AUTO_SPIN_BUTTON_WIDTH, Math.max(newHeight * UI_POS.AUTO_SPIN_BUTTON_MAX_HEIGHT_RATIO, UI_POS.AUTO_SPIN_BUTTON_MIN_HEIGHT));
  };

  container.addChild(autoSpinButton);

  // Add resize method to container for external access
  (container as any).resize = resize;

  // Expose setDisabled and getDisabled methods for button state manager
  (container as any).setDisabled = (disabled: boolean) => {
    if (autoSpinButton && typeof (autoSpinButton as any).setDisabled === 'function') {
      (autoSpinButton as any).setDisabled(disabled);
    }
  };

  (container as any).getDisabled = (): boolean => {
    if (autoSpinButton && typeof (autoSpinButton as any).getDisabled === 'function') {
      return (autoSpinButton as any).getDisabled();
    }
    return false;
  };

  // Cleanup function to stop auto-spin and clear timeout
  (container as any).cleanup = () => {
    if (autoSpinTimeoutId) {
      clearTimeout(autoSpinTimeoutId);
      autoSpinTimeoutId = null;
    }
    if (textureUpdateInterval) {
      clearInterval(textureUpdateInterval);
    }
    GlobalState.setIsAutoSpin(false);
    // Switch back to auto button texture
    if (autoSpinButton && typeof (autoSpinButton as any).setTexture === 'function') {
      (autoSpinButton as any).setTexture(Assets.get('autoSpinButton'));
    }
    // Re-enable all buttons when autospin is cleaned up
    handleAutoSpinStopped();
  };

  return container;
};

export default createAutoSpinButton;
