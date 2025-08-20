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
    // calling window function to redirect to home in react
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
    borderRadius: 10,
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

  // Expose setDisabled and getDisabled methods for button state manager
  (container as any).setDisabled = (disabled: boolean) => {
    if (homeButton && typeof (homeButton as any).setDisabled === 'function') {
      (homeButton as any).setDisabled(disabled);
    }
  };

  (container as any).getDisabled = (): boolean => {
    if (homeButton && typeof (homeButton as any).getDisabled === 'function') {
      return (homeButton as any).getDisabled();
    }
    return false;
  };

  return container;
};

export default createHomeButton;