import { Container, Assets } from 'pixi.js';
import { createButton } from './commons/Button';
import { UI_POS } from './constants/Positions';
import { UI_THEME } from './constants/UIThemeColors';
import { SoundManager } from '../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../utils/gameActivityManager';

export const createSpinButton = (appWidth: number, appHeight: number, onClick: () => void): Container => {
  const container = new Container();
  container.zIndex = 50;

  let currentAppWidth = appWidth;
  let currentAppHeight = appHeight;

  let spinButtonRef: any;

  const spinButton = createButton({
    x: appWidth * UI_POS.SPIN_BUTTON_X,
    y: appHeight * UI_POS.SPIN_BUTTON_Y,
    width: appWidth * UI_POS.SPIN_BUTTON_WIDTH,
    height: Math.max(appHeight * UI_POS.SPIN_BUTTON_MAX_HEIGHT_RATIO, UI_POS.SPIN_BUTTON_MIN_HEIGHT),
    texture: Assets.get('spinButton'),
    onClick: () => {
      SoundManager.playUIClick();
      console.log('Spin button clicked');
      recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'spinButton' });
    },
  });
  spinButtonRef = spinButton;

  const resize = (newWidth: number, newHeight: number) => {
    currentAppWidth = newWidth;
    currentAppHeight = newHeight;

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
    