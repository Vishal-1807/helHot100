import { Assets, Container } from 'pixi.js';
import { createButton } from '../commons/Button';
import { UI_POS } from '../constants/Positions';
import { SoundManager } from '../../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';

export const createHomeButton = (appWidth: number, appHeight: number): Container => {
  const container = new Container();
  container.zIndex = 50;

  // Default click handler
  let clickHandler = () => {
    console.log('🏠 Home button clicked - no handler set');
    if (typeof (window as any).redirectToHome === 'function') {
        (window as any).redirectToHome();
    }
  };

  const homeButton = createButton({
    x: appWidth * UI_POS.HOME_BUTTON_X,
    y: appHeight * UI_POS.HOME_BUTTON_Y,
    width: Math.max(appHeight * UI_POS.HOME_BUTTON_MAX_HEIGHT_RATIO, UI_POS.HOME_BUTTON_MIN_HEIGHT),
    height: Math.max(appHeight * UI_POS.HOME_BUTTON_MAX_HEIGHT_RATIO, UI_POS.HOME_BUTTON_MIN_HEIGHT),
    texture: Assets.get('home'),
    onClick: () => {
      SoundManager.playUIClick();
      clickHandler();
      recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'homeButton' });
    },
  });

  const resize = (newWidth: number, newHeight: number) => {
    (homeButton as any).setPosition(newWidth * UI_POS.HOME_BUTTON_X, newHeight * UI_POS.HOME_BUTTON_Y);
    (homeButton as any).setSize(Math.max(newHeight * UI_POS.HOME_BUTTON_MAX_HEIGHT_RATIO, UI_POS.HOME_BUTTON_MIN_HEIGHT), Math.max(newHeight * UI_POS.HOME_BUTTON_MAX_HEIGHT_RATIO, UI_POS.HOME_BUTTON_MIN_HEIGHT));
  };

  container.addChild(homeButton);

  // Add resize method to container for external access
  (container as any).resize = resize;

  return container;
};

export default createHomeButton;