import { Assets, Container } from 'pixi.js';
import { createButton } from '../commons/Button';
import { GlobalState } from '../../globals/gameState'; 
import { UI_THEME } from '../constants/UIThemeColors';
import { UI_POS } from '../constants/Positions';
import { SoundManager } from '../../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';


export const createWinningsTab = (appWidth: number, appHeight: number) => {
  const container = new Container();
  container.zIndex = 50;

  const balanceTextY = appHeight * 0.046;

  const winningsButton = createButton({
    x: appWidth * UI_POS.WINNINGS_TAB_X,
    y: appHeight * UI_POS.WINNINGS_TAB_Y,
    width: appWidth * UI_POS.WINNINGS_TAB_WIDTH,
    height: Math.max(appHeight * UI_POS.WINNINGS_TAB_MAX_HEIGHT_RATIO, UI_POS.WINNINGS_TAB_MIN_HEIGHT),
    texture: Assets.get('valueBar'),
    borderRadius: 15,
    // fontFamily: 'GameFont',
    label: '999',
    textSize: Math.max(27, appHeight * 0.035),
    textColor: UI_THEME.INPUT_TEXT,
    bold: true,
    onClick: () => {
      SoundManager.playUIClick();
      console.log('Balance button clicked');
      recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'balanceButton' });
    },
  });

  // Resize method
  const resize = (newWidth: number, newHeight: number) => {

    // Update button position using setPosition method
    (winningsButton as any).setPosition(newWidth * UI_POS.WINNINGS_TAB_X, newHeight * UI_POS.WINNINGS_TAB_Y);

    // Update button size using setSize method
    (winningsButton as any).setSize(newWidth * UI_POS.WINNINGS_TAB_WIDTH, Math.max(newHeight * UI_POS.WINNINGS_TAB_MAX_HEIGHT_RATIO, UI_POS.WINNINGS_TAB_MIN_HEIGHT));
  };

  container.addChild(winningsButton);

  // Add resize method to container for external access
  (container as any).resize = resize;

  return container;
};

export default createWinningsTab;