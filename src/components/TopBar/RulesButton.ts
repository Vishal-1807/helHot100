import { Assets, Container } from 'pixi.js';
import { createButton } from '../commons/Button';
import { UI_POS } from '../constants/Positions';
import { SoundManager } from '../../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';
import { createCommonPopup } from '../../components';
import { TOTAL_RULE_PAGES } from '../constants/GameConstants';
import { createPaylinesPage } from '../popups/popupContent/RulesPages/paylinesRules';
import { GlobalState } from '../../globals/gameState';

export const createRulesButton = (appWidth: number, appHeight: number, gameContainer: any, appStage?: Container): Container => {
  const container = new Container();
  container.zIndex = 50;

  const bounds = gameContainer.getGameAreaBounds();
  let gameContainerWidth = bounds.width;
  let gameContainerHeight = bounds.height;

  let rulesPopup: Container | null = null;
  let pages: any[] = [];

  const updatePageVisibility = () => {
    if (pages.length === 0) return;

    const currentPage = GlobalState.rulesPage;
    pages.forEach((page, index) => {
      // Page index starts from 0, but rulesPage starts from 1
      page.visible = (index + 1) === currentPage;
    });
    console.log(`📖 Showing rules page ${currentPage} of ${pages.length}`);
  };

  const showRulesPopup = () => {
    if (!rulesPopup) {
      // Use game container dimensions if provided, otherwise fall back to app dimensions
      const gameWidth = gameContainerWidth;
      const gameHeight = gameContainerHeight;
      rulesPopup = createCommonPopup(gameWidth, gameHeight, true, hideRulesPopup, updatePageVisibility);

      // Create all rule pages
      for (let i = 1; i <= TOTAL_RULE_PAGES; i++) {
        const pageTexture = Assets.get(`PaylinePage${i}`);
        const page = createPaylinesPage(rulesPopup, pageTexture);
        pages.push(page);
        rulesPopup.addChild(page);
      }

      // Show the current page
      updatePageVisibility();

      // Add popup to game area container if available, otherwise to button container
      const targetContainer = appStage || container;
      targetContainer.addChild(rulesPopup);
    }
    rulesPopup.visible = true;
    updatePageVisibility();
    SoundManager.playPopup();
  };

  const hideRulesPopup = () => {
    if (rulesPopup) {
      rulesPopup.visible = false;
    }
  };

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
      showRulesPopup();
    },
  });

  const resize = (newWidth: number, newHeight: number, gameContainer: any) => {
    (rulesButton as any).setPosition(newWidth * UI_POS.RULES_BUTTON_X, newHeight * UI_POS.RULES_BUTTON_Y);
    (rulesButton as any).setSize(Math.max(newHeight * UI_POS.RULES_BUTTON_MAX_HEIGHT_RATIO, UI_POS.RULES_BUTTON_MIN_HEIGHT), Math.max(newHeight * UI_POS.RULES_BUTTON_MAX_HEIGHT_RATIO, UI_POS.RULES_BUTTON_MIN_HEIGHT));

    const bounds = gameContainer.getGameAreaBounds();
    let newGameContainerWidth = bounds.width;
    let newGameContainerHeight = bounds.height;
    // Update game container dimensions for future popup creation
    if (newGameContainerWidth !== undefined) gameContainerWidth = newGameContainerWidth;
    if (newGameContainerHeight !== undefined) gameContainerHeight = newGameContainerHeight;

    const popupWidth = gameContainerWidth;
    const popupHeight = gameContainerHeight;
    // Resize popup if it exists (whether visible or not)
    if (rulesPopup) {
      if (typeof (rulesPopup as any).resize === 'function') {
        (rulesPopup as any).resize(popupWidth, popupHeight);
      }
    }
    if(pages) {
      pages.forEach((page: any) => {
        if (typeof page.resize === 'function') {
          page.resize(popupWidth, popupHeight);
        }
      });
      // Update page visibility after resize
      updatePageVisibility();
    }
  };

  container.addChild(rulesButton);

  // Add resize method to container for external access
  (container as any).resize = resize;

  // Expose setDisabled and getDisabled methods for button state manager
  (container as any).setDisabled = (disabled: boolean) => {
    if (rulesButton && typeof (rulesButton as any).setDisabled === 'function') {
      (rulesButton as any).setDisabled(disabled);
    }
  };

  (container as any).getDisabled = (): boolean => {
    if (rulesButton && typeof (rulesButton as any).getDisabled === 'function') {
      return (rulesButton as any).getDisabled();
    }
    return false;
  };

  return container;
};

export default createRulesButton;