import { Assets, Container } from 'pixi.js';
import { createButton } from '../commons/Button';
import { GlobalState } from '../../globals/gameState'; 
import { UI_THEME } from '../constants/UIThemeColors';
import { UI_POS } from '../constants/Positions';
import { SoundManager } from '../../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';

export const createBalanceTab = (appWidth: number, appHeight: number) => {
  const container = new Container();
  container.zIndex = 50;

  const balanceTab = createButton({
    x: appWidth * UI_POS.BALANCE_TAB_X,
    y: appHeight * UI_POS.BALANCE_TAB_Y,
    width: appWidth * UI_POS.BALANCE_TAB_WIDTH,
    height: Math.max(appHeight * UI_POS.BALANCE_TAB_MAX_HEIGHT_RATIO, UI_POS.BALANCE_TAB_MIN_HEIGHT),
    texture: Assets.get('valueBar'),
    // fontFamily: 'GameFont',
    label: '99999',
    textSize: Math.max(25, appHeight * 0.035),
    textColor: UI_THEME.INPUT_TEXT,
    bold: true,
    onClick: () => {
      SoundManager.playUIClick();
      console.log('Balance button clicked');
      recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'balanceButton' });
    },
  });

  const updateBalance = (balance: number) => {
    (balanceTab as any).setLabel(balance.toFixed(2).toString());
  };

  GlobalState.addBalanceChangeListener(updateBalance);

  const resize = (newWidth: number, newHeight: number) => {

    if(!balanceTab) return;
    // Update button position using setPosition method
    (balanceTab as any).setPosition(newWidth * UI_POS.BALANCE_TAB_X, newHeight * UI_POS.BALANCE_TAB_Y);

    // Update button size using setSize method
    (balanceTab as any).setSize(newWidth * UI_POS.BALANCE_TAB_WIDTH, Math.max(newHeight * UI_POS.BALANCE_TAB_MAX_HEIGHT_RATIO, UI_POS.BALANCE_TAB_MIN_HEIGHT));
  };

  container.addChild(balanceTab);

  // Add resize method to container for external access
  (container as any).resize = resize;

  return container;
};

export default createBalanceTab;