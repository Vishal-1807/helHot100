import { Assets, Container, Graphics } from 'pixi.js';
import { createSimplePositionedContainer } from './PositionedContainer';
import { createButton } from './Button';
import { UI_POS } from '../constants/Positions';
import { Z_INDEX } from '../constants/ZIndex';
import { SoundManager } from '../../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';
import { GlobalState } from '../../globals/gameState';
import { TOTAL_RULE_PAGES } from '../constants/GameConstants';

export const createCommonPopup = (appWidth: number, appHeight: number, multiplePages: boolean, onClose?: () => void, onPageChange?: () => void): Container => {
  const container = new Container();
  container.zIndex = Z_INDEX.POPUP_OVERLAY;

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
    backgroundTexture: Assets.get('commonPopup'),
    // textureFit: 'contain'
  });
  container.addChild(settingsPopup.container);

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
  container.addChild(closeButton);

  const previousPage = createButton({
    x: settingsPopup.container.x - (settingsPopup.container.width/2) - (settingsPopup.container.width * UI_POS.NAVIGATION_BUTTON_X),
    y: settingsPopup.container.y,
    width: settingsPopup.container.height * UI_POS.NAVIGATION_BUTTON_WIDTH,
    height: settingsPopup.container.height * UI_POS.NAVIGATION_BUTTON_HEIGHT,
    anchor: { x: 0.5, y: 0.5 },
    texture: Assets.get('previousButton'),
    shadow: false,
    onClick: () => {
      handlePageChange(GlobalState.rulesPage - 1);
      SoundManager.playUIClick();
      recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'previousButton' });
      console.log('Previous page button clicked');
    }
  });
  previousPage.visible = multiplePages;
  container.addChild(previousPage);

  const nextPage = createButton({
    x: settingsPopup.container.x + (settingsPopup.container.width/2) + (settingsPopup.container.width * UI_POS.NAVIGATION_BUTTON_X),
    y: settingsPopup.container.y,
    width: settingsPopup.container.height * UI_POS.NAVIGATION_BUTTON_WIDTH,
    height: settingsPopup.container.height * UI_POS.NAVIGATION_BUTTON_HEIGHT,
    anchor: { x: 0.5, y: 0.5 }, 
    texture: Assets.get('nextButton'),
      
    onClick: () => {
      handlePageChange(GlobalState.rulesPage + 1);
      SoundManager.playUIClick();
      recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'nextButton' });
      console.log('Next page button clicked');
    }
  });
  nextPage.visible = multiplePages;
  container.addChild(nextPage);

  const handlePageChange = (page: number) => {
    // Ensure page is within valid range (1 to TOTAL_RULE_PAGES)
    let newPage = page;
    if (newPage < 1) {
      newPage = TOTAL_RULE_PAGES; // Cycle to last page
    } else if (newPage > TOTAL_RULE_PAGES) {
      newPage = 1; // Cycle to first page
    }

    GlobalState.setRulePage(newPage);
    console.log(`📖 Rules page changed to: ${newPage}`);

    // Call the page change callback if provided
    if (onPageChange) {
      onPageChange();
    }
  };

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
    closeButton.width = settingsPopup.container.height * UI_POS.CLOSE_BUTTON_HEIGHT;
    closeButton.height = settingsPopup.container.height * UI_POS.CLOSE_BUTTON_HEIGHT;

    // Update previous page button position relative to the new popup position
    previousPage.x = settingsPopup.container.x - (settingsPopup.container.width/2) - (settingsPopup.container.height * UI_POS.NAVIGATION_BUTTON_X);
    previousPage.y = settingsPopup.container.y;
    previousPage.width = settingsPopup.container.height * UI_POS.NAVIGATION_BUTTON_WIDTH;
    previousPage.height = settingsPopup.container.height * UI_POS.NAVIGATION_BUTTON_HEIGHT;

    // Update next page button position relative to the new popup position
    nextPage.x = settingsPopup.container.x + (settingsPopup.container.width/2) + (settingsPopup.container.height * UI_POS.NAVIGATION_BUTTON_X);
    nextPage.y = settingsPopup.container.y;
    nextPage.width = settingsPopup.container.height * UI_POS.NAVIGATION_BUTTON_WIDTH;
    nextPage.height = settingsPopup.container.height * UI_POS.NAVIGATION_BUTTON_HEIGHT;
  };

  // Prevent popup from closing when clicking on the popup content itself
  settingsPopup.container.eventMode = 'static';
  settingsPopup.container.on('pointerdown', (e) => {
    e.stopPropagation(); // Stop the event from bubbling up to the background overlay
  });

  // Add resize method to container for external access
  (container as any).resize = resize;
  (container as any).settingsPopup = settingsPopup;

  return container;
};

export default createCommonPopup;