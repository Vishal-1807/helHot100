import { Assets, Container } from 'pixi.js';
import { createButton } from '../commons/Button';
import { UI_POS } from '../constants/Positions';
import { SoundManager } from '../../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';
import { createCommonPopup } from '../../components';
import { createAudioSettings } from '../popups/popupContent/audioSettings';

export const createSettingsButton = (appWidth: number, appHeight: number, gameContainer: any, appStage?: Container): Container => {
  const container = new Container();
  container.zIndex = 50;

  const bounds = gameContainer.getGameAreaBounds();
  let gameContainerWidth = bounds.width;
  let gameContainerHeight = bounds.height;

  // Create settings popup (initially hidden)
  let settingsPopup: Container | null = null;
  let audioSettings: Container | null = null;

  const showSettingsPopup = () => {
    if (!settingsPopup) {
      // Use game container dimensions if provided, otherwise fall back to app dimensions
      const popupWidth = gameContainerWidth;
      const popupHeight = gameContainerHeight;
      settingsPopup = createCommonPopup(popupWidth, popupHeight, false, hideSettingsPopup);

      audioSettings =  createAudioSettings(settingsPopup);
      settingsPopup.addChild(audioSettings);

      // Add popup to game area container if available, otherwise to button container
      const targetContainer = appStage || container;
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
  
  const resize = (newWidth: number, newHeight: number, gameContainer: any) => {
    (settingsButton as any).setPosition(newWidth * UI_POS.SETTINGS_BUTTON_X, newHeight * UI_POS.SETTINGS_BUTTON_Y);
    (settingsButton as any).setSize(Math.max(newHeight * UI_POS.SETTINGS_BUTTON_MAX_HEIGHT_RATIO, UI_POS.SETTINGS_BUTTON_MIN_HEIGHT), Math.max(newHeight * UI_POS.SETTINGS_BUTTON_MAX_HEIGHT_RATIO, UI_POS.SETTINGS_BUTTON_MIN_HEIGHT));

    const bounds = gameContainer.getGameAreaBounds();
    let newGameContainerWidth = bounds.width;
    let newGameContainerHeight = bounds.height;
    // Update game container dimensions for future popup creation
    if (newGameContainerWidth !== undefined) gameContainerWidth = newGameContainerWidth;
    if (newGameContainerHeight !== undefined) gameContainerHeight = newGameContainerHeight;

    const popupWidth = gameContainerWidth;
    const popupHeight = gameContainerHeight;
    // Resize popup if it exists (whether visible or not)
    if (settingsPopup) {
      if (typeof (settingsPopup as any).resize === 'function') {
        (settingsPopup as any).resize(popupWidth, popupHeight);
      }
    }
    if (audioSettings) {
      if (typeof (audioSettings as any).resize === 'function') {
        (audioSettings as any).resize(popupWidth, popupHeight);
      }
    }
  };

  container.addChild(settingsButton);

  // Add methods to container for external access
  (container as any).resize = resize;
  (container as any).hideSettingsPopup = hideSettingsPopup;
  (container as any).showSettingsPopup = showSettingsPopup;

  // Expose setDisabled and getDisabled methods for button state manager
  (container as any).setDisabled = (disabled: boolean) => {
    if (settingsButton && typeof (settingsButton as any).setDisabled === 'function') {
      (settingsButton as any).setDisabled(disabled);
    }
  };

  (container as any).getDisabled = (): boolean => {
    if (settingsButton && typeof (settingsButton as any).getDisabled === 'function') {
      return (settingsButton as any).getDisabled();
    }
    return false;
  };

  return container;
};

export default createSettingsButton;