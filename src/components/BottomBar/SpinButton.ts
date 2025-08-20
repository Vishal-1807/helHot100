import { Container, Assets } from 'pixi.js';
import { createButton } from '../commons';
import { UI_POS } from '../constants/Positions';
import { SoundManager } from '../../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';
import { spinClickHandler } from '../Logic/spinClickHandler';

export const createSpinButton = (appWidth: number, appHeight: number, gameContainer: any, reelContainer: any): Container => {
  const container = new Container();
  container.zIndex = 50;

  let spinButtonRef: any;
  let multiplePayline: any;

  const spinButton = createButton({
    x: appWidth * UI_POS.SPIN_BUTTON_X,
    y: appHeight * UI_POS.SPIN_BUTTON_Y,
    width: appWidth * UI_POS.SPIN_BUTTON_WIDTH,
    height: Math.max(appHeight * UI_POS.SPIN_BUTTON_MAX_HEIGHT_RATIO, UI_POS.SPIN_BUTTON_MIN_HEIGHT),
    borderRadius: 10,
    texture: Assets.get('spinButton'),
    onClick: async () => {
      await spinClickHandler(reelContainer, gameContainer, false);
      console.log('Spin button clicked - starting reel animation');
      // -------- payline example --------- //
      // multiplePayline = createMultiplePayline([
      //   {
      //     positions: [[0,0], [2,1], [1,2], [2,3], [0,4]],
      //     options: {
      //       color: 0x800080, // purple
      //       width: 3,
      //       alpha: 1,
      //       glow: true,
      //       glowBlur: 10,
      //       glowColor: 0xFF4444, // Lighter red glow
      //       pulse: true,
      //       pulseDuration: 1.0,
      //       pulseMinAlpha: 0.3,
      //       pulseMaxAlpha: 1.0,
      //       extensionLength: appWidth * 0.05,
      //       // offset: 0 // Manual offset: no offset for first payline
      //     }
      //   },
      //   {
      //     positions: [[1,0], [2,1], [1,2], [2,3], [0,4]],
      //     options: {
      //       color: 0x00ff00, // green
      //       width: 3,
      //       alpha: 1,
      //       glow: true,
      //       glowBlur: 10,
      //       glowColor: 0xFF4444, // Darker black glow
      //       pulse: true,
      //       pulseDuration: 1.0,
      //       pulseMinAlpha: 0.3,
      //       pulseMaxAlpha: 1.0,
      //       extensionLength: appWidth * 0.05,
      //       // offset: 5 // Manual offset: 5px below the first payline
      //     }
      //   }
      // ], 8); // Default offset step (used if offset not specified)
	    // gameContainer.gameArea.addChild(multiplePayline);  

      SoundManager.playUIClick();
      recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'spinButton' });
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

  return container;
}

export default createSpinButton;
    