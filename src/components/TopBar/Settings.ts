import { Assets, Container } from 'pixi.js';
import { createButton } from '../commons/Button';
import { UI_POS } from '../constants/Positions';
import { SoundManager } from '../../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';
import { createSettingsPopup } from '../popups/SettingsPopup';

export const createSettingsButton = (appWidth: number, appHeight: number, gameContainerWidth?: number, gameContainerHeight?: number, gameAreaContainer?: Container): Container => {
  const container = new Container();
  container.zIndex = 50;

  // Create settings popup (initially hidden)
  let settingsPopup: Container | null = null;

  const showSettingsPopup = () => {
    if (!settingsPopup) {
      // Use game container dimensions if provided, otherwise fall back to app dimensions
      const popupWidth = gameContainerWidth;
      const popupHeight = gameContainerHeight;
      settingsPopup = createSettingsPopup(popupWidth, popupHeight, hideSettingsPopup);

      // Add popup to game area container if available, otherwise to button container
      const targetContainer = gameAreaContainer || container;
      targetContainer.addChild(settingsPopup);
    }
    settingsPopup.visible = true;
    SoundManager.playPopup();
  };

  const hideSettingsPopup = () => {
    if (settingsPopup) {
      settingsPopup.visible = false;
    }
  };

  const settingsButton = createButton({
    x: appWidth * UI_POS.SETTINGS_BUTTON_X,
    y: appHeight * UI_POS.SETTINGS_BUTTON_Y,
    width: Math.max(appHeight * UI_POS.SETTINGS_BUTTON_MAX_HEIGHT_RATIO, UI_POS.SETTINGS_BUTTON_MIN_HEIGHT),
    height: Math.max(appHeight * UI_POS.SETTINGS_BUTTON_MAX_HEIGHT_RATIO, UI_POS.SETTINGS_BUTTON_MIN_HEIGHT),
    texture: Assets.get('settings'),
    borderRadius: 10,
    onClick: () => {
      SoundManager.playUIClick();
      console.log('Settings button clicked');
      recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'settingsButton' });
      showSettingsPopup();
    },
  });
  
  const resize = (newWidth: number, newHeight: number, newGameContainerWidth?: number, newGameContainerHeight?: number) => {
    (settingsButton as any).setPosition(newWidth * UI_POS.SETTINGS_BUTTON_X, newHeight * UI_POS.SETTINGS_BUTTON_Y);
    (settingsButton as any).setSize(Math.max(newHeight * UI_POS.SETTINGS_BUTTON_MAX_HEIGHT_RATIO, UI_POS.SETTINGS_BUTTON_MIN_HEIGHT), Math.max(newHeight * UI_POS.SETTINGS_BUTTON_MAX_HEIGHT_RATIO, UI_POS.SETTINGS_BUTTON_MIN_HEIGHT));

    // Update game container dimensions for future popup creation
    if (newGameContainerWidth !== undefined) gameContainerWidth = newGameContainerWidth;
    if (newGameContainerHeight !== undefined) gameContainerHeight = newGameContainerHeight;

    // Resize popup if it exists (whether visible or not)
    if (settingsPopup) {
      // Use updated game container dimensions if available
      const popupWidth = gameContainerWidth;
      const popupHeight = gameContainerHeight;

      // Call the popup's resize method if it exists
      if (typeof (settingsPopup as any).resize === 'function') {
        (settingsPopup as any).resize(popupWidth, popupHeight);
      }
    }
  };

  container.addChild(settingsButton);

  // Add methods to container for external access
  (container as any).resize = resize;
  (container as any).hideSettingsPopup = hideSettingsPopup;
  (container as any).showSettingsPopup = showSettingsPopup;

  return container;
};

export default createSettingsButton;