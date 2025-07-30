import { Assets, Container } from 'pixi.js';
import { createButton } from './commons/Button';
import { GlobalState } from '../globals/gameState'; 
import { UI_THEME } from './constants/UIThemeColors';
import { UI_POS } from './constants/Positions';
import { SoundManager } from '../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../utils/gameActivityManager';


export const createBalanceTab = (appWidth: number, appHeight: number) => {
  const container = new Container();
  container.zIndex = 50;

  let currentAppWidth = appWidth;
  let currentAppHeight = appHeight;

  const balanceTextY = appHeight * 0.046;

  const balanceButton = createButton({
    x: appWidth * UI_POS.BALANCE_TAB_X,
    y: appHeight * UI_POS.BALANCE_TAB_Y,
    width: appWidth * UI_POS.BALANCE_TAB_WIDTH,
    height: Math.max(30, appHeight * 0.04),
    color: UI_THEME.BET_VALUEBAR,
    borderColor: UI_THEME.BET_TAB_BORDERCOLOR,
    borderWidth: 2,
    borderRadius: 5,
    texture: Assets.get('balanceTab'),
    label: 'Balance',
    // fontFamily: 'GameFont',
    textSize: Math.max(20, appHeight * 0.025),
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
    currentAppWidth = newWidth;
    currentAppHeight = newHeight;

    // Update button position using setPosition method
    (balanceButton as any).setPosition(newWidth * UI_POS.BALANCE_TAB_X, newHeight * UI_POS.BALANCE_TAB_Y);

    // Update button size using setSize method
    (balanceButton as any).setSize(newWidth * UI_POS.BALANCE_TAB_WIDTH, Math.max(30, newHeight * 0.04));
  };

  container.addChild(balanceButton);

  // Add resize method to container for external access
  (container as any).resize = resize;

  return container;
};

export default createBalanceTab;