import { Container, Assets } from 'pixi.js';
import { createButton } from '../../../commons/Button';
import { UI_POS } from '../../../constants/Positions';

export const createPaylinesPage = (settingsPopup: Container, texture): Container => {
  const container = new Container();

  let paylinesImageRef: any;

  const paylinesImage = createButton({
    x: settingsPopup.width * UI_POS.RULES_PAGE_X_RATIO,
    y: settingsPopup.height * UI_POS.RULES_PAGE_Y_RATIO,
    width: settingsPopup.width * UI_POS.RULES_PAGE_WIDTH_RATIO,
    height: settingsPopup.height * UI_POS.RULES_PAGE_HEIGHT_RATIO,
    texture: texture,
    anchor: { x: 0.5, y: 0.5 },
    shadow: false,
    hoverTint: 'none',
  });
  paylinesImageRef = paylinesImage;

  const resize = (newWidth: number, newHeight: number) => {
    paylinesImageRef.setPosition(newWidth * 0.5, newHeight * 0.5);
    paylinesImageRef.setSize(newWidth * 0.7, newHeight * 0.7);
  };

  container.addChild(paylinesImage);

  (container as any).resize = resize;

  return container;
};
