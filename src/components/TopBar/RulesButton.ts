import { Assets, Container } from 'pixi.js';
import { createButton } from '../commons/Button';
import { UI_POS } from '../constants/Positions';
import { SoundManager } from '../../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';

export const createRulesButton = (appWidth: number, appHeight: number): Container => {
  const container = new Container();
  container.zIndex = 50;

  const rulesButton = createButton({
    x: appWidth * UI_POS.RULES_BUTTON_X,
    y: appHeight * UI_POS.RULES_BUTTON_Y,
    width: Math.max(appHeight * UI_POS.RULES_BUTTON_MAX_HEIGHT_RATIO, UI_POS.RULES_BUTTON_MIN_HEIGHT),
    height: Math.max(appHeight * UI_POS.RULES_BUTTON_MAX_HEIGHT_RATIO, UI_POS.RULES_BUTTON_MIN_HEIGHT),
    texture: Assets.get('Rules'),
    borderRadius: 10,
    onClick: () => {
      SoundManager.playUIClick();
      console.log('Rules button clicked');
      recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'rulesButton' });
    },
  });

  const resize = (newWidth: number, newHeight: number) => {
    if (!rulesButton) return;
    (rulesButton as any).setPosition(newWidth * UI_POS.RULES_BUTTON_X, newHeight * UI_POS.RULES_BUTTON_Y);
    (rulesButton as any).setSize(Math.max(newHeight * UI_POS.RULES_BUTTON_MAX_HEIGHT_RATIO, UI_POS.RULES_BUTTON_MIN_HEIGHT), Math.max(newHeight * UI_POS.RULES_BUTTON_MAX_HEIGHT_RATIO, UI_POS.RULES_BUTTON_MIN_HEIGHT));
  };

  container.addChild(rulesButton);

  // Add resize method to container for external access
  (container as any).resize = resize;

  return container;
};

export default createRulesButton;