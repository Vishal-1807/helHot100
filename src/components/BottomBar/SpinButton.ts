import { Container, Assets, Application } from 'pixi.js';
import { createButton } from '../commons';
import { UI_POS } from '../constants/Positions';
import { UI_THEME } from '../constants/UIThemeColors';
import { SoundManager } from '../../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';
import { ICONS_PER_REEL, TOTAL_REELS, WIN_POPUP_TYPES } from '../constants/GameConstants';
import { ShowWinPopup } from '../popups/WinPopup';
import { createMultiplePayline } from '../commons';
import { animateReelSpin, stopReelAnimation, stopReelAnimationSequential } from '../Logic/reelAnimation';
import { tempSlotIconsNames } from '../constants/GameConstants';

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
    onClick: () => {
      console.log('Spin button clicked - starting reel animation');

      // Stop any existing animation first
      stopReelAnimation({ reelContainer });

      // Generate random final icons for each reel column (5 reels, 4 icons each)
      const finalIcons: string[][] = [];
      for (let col = 0; col < TOTAL_REELS; col++) {
        const columnIcons: string[] = [];
        for (let row = 0; row < ICONS_PER_REEL; row++) {
          const randomIcon = tempSlotIconsNames[Math.floor(Math.random() * tempSlotIconsNames.length)];
          columnIcons.push(randomIcon);
        }
        finalIcons.push(columnIcons);
      }

      // Start the animated reel spin with custom speed and duration
      animateReelSpin({
        reelContainer,
        duration: 1000,
        speed: 0.7 // 2.5x speed for faster spinning
      });

      // After animation completes, stop reels sequentially from left to right
      setTimeout(() => {
        console.log('Starting sequential reel stop - left to right');
        // Stop reels sequentially with custom bounce settings
        stopReelAnimationSequential({
          reelContainer,
          finalIcons,
          delayBetweenReels: 300,
          bounceHeight: 110,
          bounceDuration: 300,
          bounceDelay: 30
        });

        // After all reels have stopped (5 reels * 300ms delay = 1.5 seconds)
        setTimeout(() => {
          console.log('All reels stopped - checking for wins');
          // Here you can add logic to:
          // 1. Check for winning combinations
          // 2. Show win popup if needed
          // 3. Update balance, etc.

          // Example: Show win popup (uncomment if needed)
          // const parentContainer = gameContainer.container || gameContainer;
          // ShowWinPopup(parentContainer, WIN_POPUP_TYPES.TOTAL_WIN, 100);
        }, 2000); // Wait for all reels to stop
      }, 1000);

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

  return container;
}

export default createSpinButton;
    