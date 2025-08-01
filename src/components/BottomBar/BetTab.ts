import { Assets, Container } from 'pixi.js';
import { createButton } from '../commons/Button';
import { GlobalState } from '../../globals/gameState';
import { UI_THEME } from '../constants/UIThemeColors';
import { UI_POS } from '../constants/Positions';
import { addButtonReferences } from '../../utils/gameButtonStateManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';
import { SoundManager } from '../../utils/SoundManager';

export const createBetTab = (appWidth: number, appHeight: number) => {
  const container = new Container();
  container.zIndex = 50;

  let currentStakeAmount = GlobalState.getStakeAmount();

  const spacing = appWidth * 0.025

  const betAmountTextY = GlobalState.smallScreen ? appHeight * 0.046 : appHeight * 0.037;

  // Store button references for position updates
  let valueBarRef: any, minusButtonRef: any, plusButtonRef: any, betAmountTextRef: any;

  // Function to update button positions
  const updateButtonPositions = () => {
    const y_pos = appHeight * UI_POS.BET_TAB_Y;
    console.log(`BetTab: Updating positions to y=${y_pos} (gameStarted=${GlobalState.getGameStarted()})`);

    if (valueBarRef) valueBarRef.y = y_pos;
    if (minusButtonRef) minusButtonRef.y = y_pos;
    if (plusButtonRef) plusButtonRef.y = y_pos;

    updateTextPosition(y_pos);
  };

  // Function to update text position
  const updateTextPosition = (y_pos: number) => {
    if (betAmountTextRef) betAmountTextRef.setPosition(appWidth * 0.05, y_pos - betAmountTextY);
  };

  // Function to update the value bar label
  const updateValueBarLabel = () => {
    currentStakeAmount = GlobalState.getStakeAmount();
    if (valueBarRef?.children?.[2]) { // Text is typically the third child
      const textChild = valueBarRef.children[2];
      if (textChild.text !== undefined) {
        textChild.text = `${currentStakeAmount}`;
      }
    }
    recordUserActivity(ActivityTypes.BET_CHANGE);
  };

  // Comprehensive resize method
  const resize = (newWidth: number, newHeight: number) => {

    const newSpacing = newWidth * 0.025;
    const newBetAmountTextY = GlobalState.smallScreen ? newHeight * 0.046 : newHeight * 0.037;
    const y_pos = newHeight * UI_POS.BET_TAB_Y;

    // Update value bar using Button methods
    if (valueBarRef) {
      (valueBarRef as any).setPosition(newWidth * UI_POS.BET_TAB_X, y_pos);
      (valueBarRef as any).setSize(Math.max(newWidth * UI_POS.VALUE_BAR_WIDTH, 100), Math.max(newHeight * UI_POS.BET_TAB_MAX_HEIGHT_RATIO, UI_POS.BET_TAB_MIN_HEIGHT));
    }

    // Update minus button using Button methods
    if (minusButtonRef && valueBarRef) {
      const valueBarPos = (valueBarRef as any).getPosition();
      const valueBarSize = (valueBarRef as any).getSize();
      (minusButtonRef as any).setPosition(valueBarPos.x - valueBarSize.width / 2 - newSpacing, y_pos);
      (minusButtonRef as any).setSize(Math.max(newHeight * UI_POS.BET_TAB_MAX_HEIGHT_RATIO, UI_POS.BET_TAB_MIN_HEIGHT), Math.max(newHeight * UI_POS.BET_TAB_MAX_HEIGHT_RATIO, UI_POS.BET_TAB_MIN_HEIGHT));
    }

    // Update plus button using Button methods
    if (plusButtonRef && valueBarRef) {
      const valueBarPos = (valueBarRef as any).getPosition();
      const valueBarSize = (valueBarRef as any).getSize();
      (plusButtonRef as any).setPosition(valueBarPos.x + valueBarSize.width / 2 + newSpacing, y_pos);
      (plusButtonRef as any).setSize(Math.max(newHeight * UI_POS.BET_TAB_MAX_HEIGHT_RATIO, UI_POS.BET_TAB_MIN_HEIGHT), Math.max(newHeight * UI_POS.BET_TAB_MAX_HEIGHT_RATIO, UI_POS.BET_TAB_MIN_HEIGHT));
    }

    // Update text position
    if (betAmountTextRef) {
      betAmountTextRef.setPosition(newWidth * 0.05, y_pos - newBetAmountTextY);
    }
  };

  // Calculate initial position
  let y_pos = appHeight * UI_POS.BET_TAB_Y;

  const valueBar = createButton({
    x: appWidth * UI_POS.BET_TAB_X,
    y: y_pos,
    width: Math.max(appWidth * UI_POS.VALUE_BAR_WIDTH, 100),
    height: Math.max(appHeight * UI_POS.BET_TAB_MAX_HEIGHT_RATIO, UI_POS.BET_TAB_MIN_HEIGHT),
    label: `${currentStakeAmount}`,
    texture: Assets.get('valueBar'),
    borderRadius: 10, 
    textColor: UI_THEME.INPUT_TEXT,
    textSize: Math.max(25, appHeight * 0.025),
    bold: true,
    onClick: () => {
      recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'valueBar' });
      console.log('ValueBar button clicked');
    },
  });
  valueBarRef = valueBar;

  const minusButton = createButton({
    x: valueBar.x - valueBar.width / 2 - spacing,
    y: y_pos,
    width: Math.max(appHeight * UI_POS.BET_TAB_MAX_HEIGHT_RATIO, UI_POS.BET_TAB_MIN_HEIGHT),
    height: Math.max(appHeight * UI_POS.BET_TAB_MAX_HEIGHT_RATIO, UI_POS.BET_TAB_MIN_HEIGHT),
    borderRadius: 10,
    texture: Assets.get('minusButton'),
    onClick: () => {
      SoundManager.playBetDecrease();
      console.log('Minus button clicked');
      GlobalState.cycleBetDown();
      updateValueBarLabel();
    },
  });
  minusButtonRef = minusButton;

  const plusButton = createButton({
    x: valueBar.x + valueBar.width / 2 + spacing,
    y: y_pos,
    width: Math.max(appHeight * UI_POS.BET_TAB_MAX_HEIGHT_RATIO, UI_POS.BET_TAB_MIN_HEIGHT),
    height: Math.max(appHeight * UI_POS.BET_TAB_MAX_HEIGHT_RATIO, UI_POS.BET_TAB_MIN_HEIGHT),
    borderRadius: 10,
    texture: Assets.get('plusButton'),
    onClick: () => {
      SoundManager.playBetIncrease();
      console.log('Plus button clicked');
      GlobalState.cycleBetUp();
      updateValueBarLabel();
    },
  });
  plusButtonRef = plusButton;

  // Add game state listeners to update positions when game starts/ends
  GlobalState.addGameStartedListener(() => {
    console.log('BetTab: Game started - updating positions');
    updateButtonPositions();
  });

  GlobalState.addGameEndedListener(() => {
    console.log('BetTab: Game ended - updating positions');
    updateButtonPositions();
  });

  // Register buttons with the button state manager
  addButtonReferences({
    betTabButtons: {
      valueBar: valueBar,
      minusButton: minusButton,
      plusButton: plusButton
    }
  });

  container.addChild(valueBar);
  container.addChild(minusButton);
  container.addChild(plusButton);

  // Add resize method to container for external access
  (container as any).resize = resize;

  return container;
};

export default createBetTab;