import { Container, Assets } from 'pixi.js';
import { createButton } from '../commons/Button';
import { UI_POS } from '../constants/Positions';
import { UI_THEME } from '../constants/UIThemeColors';
import { SoundManager } from '../../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';

export const createAutoSpinButton = (appWidth: number, appHeight: number, onClick: () => void): Container => {
  const container = new Container();
  container.zIndex = 50;

  let autoSpinButtonRef: any;

  const autoSpinButton = createButton({
    x: appWidth * UI_POS.AUTO_SPIN_BUTTON_X,
    y: appHeight * UI_POS.AUTO_SPIN_BUTTON_Y,
    width: appWidth * UI_POS.AUTO_SPIN_BUTTON_WIDTH,
    height: Math.max(appHeight * UI_POS.AUTO_SPIN_BUTTON_MAX_HEIGHT_RATIO, UI_POS.AUTO_SPIN_BUTTON_MIN_HEIGHT),
    texture: Assets.get('autoSpinButton'),
    onClick: () => {
      SoundManager.playUIClick();
      console.log('Auto spin button clicked');
      recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'autoSpinButton' });
    },
  });
  autoSpinButtonRef = autoSpinButton;

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

  return container;
};

export default createAutoSpinButton;
