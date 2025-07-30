import { Container, Graphics, Sprite, Assets } from 'pixi.js';
import { createButton } from '../commons/Button';

interface SimplePopupOptions {
  width: number;
  height: number;
  onClose: () => void;
  panelWidthScale?: number;
  panelHeightScale?: number;
  closeButtonTexture?: string;
}

interface SimplePopupDimensions {
  panelX: number;
  panelY: number;
  panelWidth: number;
  panelHeight: number;
  containerWidth: number;
  containerHeight: number;
}

const createSimplePopup = ({
  width,
  height,
  onClose,
  panelWidthScale = 0.9,
  panelHeightScale = 0.9,
  closeButtonTexture = 'backButton'
}: SimplePopupOptions) => {
  const container = new Container();
  container.zIndex = 200;

  // Calculate dimensions
  const calculateDimensions = (w: number, h: number): SimplePopupDimensions => {
    const panelWidth = w * panelWidthScale;
    const panelHeight = h * panelHeightScale;
    const panelX = (w - panelWidth) / 2;
    const panelY = (h - panelHeight) / 2;

    return {
      panelX,
      panelY,
      panelWidth,
      panelHeight,
      containerWidth: w,
      containerHeight: h
    };
  };

  let dimensions = calculateDimensions(width, height);

  // Background with semi-transparent dark overlay
  const background = new Graphics();
  background.rect(0, 0, width, height);
  background.fill({ color: 0x000000, alpha: 0.7 });
  background.eventMode = 'static';
  background.on('pointerdown', onClose); // Close when clicking outside
  container.addChild(background);

  // Popup panel using the provided texture
  const panel = new Sprite(Assets.get('popup'));
  panel.width = dimensions.panelWidth;
  panel.height = dimensions.panelHeight;
  panel.x = dimensions.panelX;
  panel.y = dimensions.panelY;
  panel.eventMode = 'static';
  panel.on('pointerdown', (e) => { e.stopPropagation(); });
  container.addChild(panel);

  // Close button
  const closeButton = createButton({
    texture: Assets.get(closeButtonTexture),
    width: height * 0.08,
    height: height * 0.08,
    x: dimensions.panelX + width * 0.08,
    y: dimensions.panelY + (height * 0.13),
    anchor: { x: 0.5, y: 0.5 },
    onClick: onClose
  });
  container.addChild(closeButton);

  // Content container for user-added content
  const contentContainer = new Container();
  contentContainer.x = dimensions.panelX;
  contentContainer.y = dimensions.panelY;
  container.addChild(contentContainer);

  // Resize function
  const resize = (newWidth: number, newHeight: number) => {
    dimensions = calculateDimensions(newWidth, newHeight);

    // Update background
    background.clear();
    background.rect(0, 0, newWidth, newHeight);
    background.fill({ color: 0x000000, alpha: 0.7 });

    // Update panel
    panel.width = dimensions.panelWidth;
    panel.height = dimensions.panelHeight;
    panel.x = dimensions.panelX;
    panel.y = dimensions.panelY;

    // Update close button
    closeButton.x = dimensions.panelX + newWidth * 0.08;
    closeButton.y = dimensions.panelY + (newHeight * 0.13);
    closeButton.width = newHeight * 0.08;
    closeButton.height = newHeight * 0.08;

    // Update content container position
    contentContainer.x = dimensions.panelX;
    contentContainer.y = dimensions.panelY;
  };

  // Public API
  const popupAPI = {
    resize,
    getContentContainer: () => contentContainer
  };

  (container as any).resize = resize;
  (container as any).api = popupAPI;

  return container;
};

export default createSimplePopup;