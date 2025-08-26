import { Container, Assets } from 'pixi.js';
import { createButton } from '../commons';
import { UI_POS } from '../constants/Positions';
import { SoundManager } from '../../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';
import { spinClickHandler, stopButtonClickHandler } from '../Logic/spinClickHandler';
import { GlobalState } from '../../globals/gameState';

export const createSpinButton = (appWidth: number, appHeight: number, gameContainer: any, reelContainer: any): Container => {
  const container = new Container();
  container.zIndex = 50;

  let spinButtonRef: any;
  let isStopButton = false; // Track current button state

  const spinButton = createButton({
    x: appWidth * UI_POS.SPIN_BUTTON_X,
    y: appHeight * UI_POS.SPIN_BUTTON_Y,
    width: appWidth * UI_POS.SPIN_BUTTON_WIDTH,
    height: Math.max(appHeight * UI_POS.SPIN_BUTTON_MAX_HEIGHT_RATIO, UI_POS.SPIN_BUTTON_MIN_HEIGHT),
    borderRadius: 10,
    texture: Assets.get('spinButton'),
    onClick: async () => {
      // Check if auto spin is active - if so, ignore manual clicks
      const isAutoSpinActive = GlobalState.getIsAutoSpin();
      if (isAutoSpinActive) {
        console.log('🔄 Auto spin is active - ignoring manual spin/stop button click');
        return;
      }

      if (isStopButton) {
        // Handle stop button click (only for manual spins)
        console.log('Stop button clicked - disabling button and showing results');

        // Immediately disable the button to prevent multiple clicks
        if (spinButton && typeof (spinButton as any).setDisabled === 'function') {
          (spinButton as any).setDisabled(true);
        }

        await stopButtonClickHandler(reelContainer, gameContainer, false);
        recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'stopButton' });
      } else {
        // Handle spin button click (manual spin only)
        console.log('Spin button clicked - starting reel animation');
        await spinClickHandler(reelContainer, gameContainer, false);
        recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'spinButton' });
      }

      SoundManager.playUIClick();
    },
  });
  spinButtonRef = spinButton;

  const resize = (newWidth: number, newHeight: number) => {

    if(!spinButtonRef) return;
    // Update button position using setPosition method
    (spinButtonRef as any).setPosition(newWidth * UI_POS.SPIN_BUTTON_X, newHeight * UI_POS.SPIN_BUTTON_Y);

    // Update button size using setSize method
    (spinButtonRef as any).setSize(newWidth * UI_POS.SPIN_BUTTON_WIDTH, Math.max(newHeight * UI_POS.SPIN_BUTTON_MAX_HEIGHT_RATIO, UI_POS.SPIN_BUTTON_MIN_HEIGHT));
  };

  container.addChild(spinButton);

  // Add resize method to container for external access
  (container as any).resize = resize;

  // Expose setDisabled and getDisabled methods for button state manager
  (container as any).setDisabled = (disabled: boolean) => {
    if (spinButton && typeof (spinButton as any).setDisabled === 'function') {
      (spinButton as any).setDisabled(disabled);
    }
  };

  (container as any).getDisabled = (): boolean => {
    if (spinButton && typeof (spinButton as any).getDisabled === 'function') {
      return (spinButton as any).getDisabled();
    }
    return false;
  };

  // Expose texture switching methods for spin-to-stop functionality
  (container as any).switchToStop = () => {
    if (spinButton && typeof (spinButton as any).setTexture === 'function') {
      (spinButton as any).setTexture(Assets.get('stopButton'));
      isStopButton = true;
      console.log('🔄 Spin button switched to stop button texture');
    }
  };

  (container as any).switchToSpin = () => {
    if (spinButton && typeof (spinButton as any).setTexture === 'function') {
      (spinButton as any).setTexture(Assets.get('spinButton'));
      isStopButton = false;
      console.log('🔄 Stop button switched back to spin button texture');
    }
  };

  // Expose setTexture method for external control
  (container as any).setTexture = (texture: any) => {
    if (spinButton && typeof (spinButton as any).setTexture === 'function') {
      (spinButton as any).setTexture(texture);
    }
  };

  return container;
}

export default createSpinButton;
    