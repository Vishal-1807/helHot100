import { Assets, Container, Graphics } from 'pixi.js';
import { createSimplePositionedContainer } from '../commons/PositionedContainer';
import { createButton } from '../commons/Button';
import { UI_POS } from '../constants/Positions';
import { SoundManager } from '../../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';

export const createSettingsPopup = (appWidth: number, appHeight: number, onClose?: () => void): Container => {
  const container = new Container();
  container.zIndex = 100;

  // Create dark translucent background overlay
  const backgroundOverlay = new Graphics();
  backgroundOverlay.rect(0, 0, appWidth, appHeight);
  backgroundOverlay.fill({ color: 0x000000, alpha: 0.6 }); // Dark semi-transparent background
  backgroundOverlay.eventMode = 'static'; // Make it interactive to catch clicks
  backgroundOverlay.on('pointerdown', () => {
    // Close popup when clicking on the background overlay
    if (onClose) {
      onClose();
    }
  });
  container.addChild(backgroundOverlay);

  const settingsPopup = createSimplePositionedContainer({
    gameContainerWidth: appWidth * UI_POS.SETTINGS_POPUP_WIDTH,
    gameContainerHeight: appHeight * UI_POS.SETTINGS_POPUP_HEIGHT,
    width: '80%',
    height: '80%',
    x: appWidth * 0.5,
    y: appHeight * 0.5,
    anchor: { x: 0.5, y: 0.5 },
    transparent: false,
    backgroundTexture: Assets.get('settingsPopup'),
    // textureFit: 'contain'
  });

  const closeButton = createButton({
    x: settingsPopup.container.x + (settingsPopup.container.width/2) * UI_POS.CLOSE_BUTTON_X,
    y: settingsPopup.container.y - (settingsPopup.container.height/2) * UI_POS.CLOSE_BUTTON_Y,
    width: settingsPopup.container.height * UI_POS.CLOSE_BUTTON_HEIGHT,
    height: settingsPopup.container.height * UI_POS.CLOSE_BUTTON_HEIGHT,
    anchor: { x: 0.5, y: 0.5 },
    texture: Assets.get('closeButton'),
    onClick: () => {
      SoundManager.playUIClick();
      recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'closeButton' });
      if (onClose) {
        onClose();
      } else {
        // Fallback behavior - hide the container
        container.visible = false;
      }
    }
  });

  const resize = (newWidth: number, newHeight: number) => {
    // Resize the background overlay to cover the new dimensions
    backgroundOverlay.clear();
    backgroundOverlay.rect(0, 0, newWidth, newHeight);
    backgroundOverlay.fill({ color: 0x000000, alpha: 0.6 });

    // Update the settings popup dimensions and position
    if (settingsPopup.updateDimensions) {
      settingsPopup.updateDimensions(newWidth, newHeight);
    }

    // Recalculate popup position (centered)
    settingsPopup.container.x = newWidth * 0.5;
    settingsPopup.container.y = newHeight * 0.5;

    // Update close button position relative to the new popup position
    closeButton.x = settingsPopup.container.x + (settingsPopup.container.width/2) * UI_POS.CLOSE_BUTTON_X;
    closeButton.y = settingsPopup.container.y - (settingsPopup.container.height/2) * UI_POS.CLOSE_BUTTON_Y;
  };

  container.addChild(settingsPopup.container);
  container.addChild(closeButton);

  // Prevent popup from closing when clicking on the popup content itself
  settingsPopup.container.eventMode = 'static';
  settingsPopup.container.on('pointerdown', (e) => {
    e.stopPropagation(); // Stop the event from bubbling up to the background overlay
  });

  // Add resize method to container for external access
  (container as any).resize = resize;

  return container;
};

export default createSettingsPopup;