import { Container, Graphics, Sprite, Texture, Assets } from 'pixi.js';
import { createButton } from '../commons/Button';

export const createReelColumn = ({
    gameContainerWidth,
    gameContainerHeight,
    xRatio,
    yRatio,
    widthRatio,
    heightRatio,
  }: {
    gameContainerWidth: number;
    gameContainerHeight: number;
    xRatio: number;
    yRatio: number;
    widthRatio: number;
    heightRatio: number;
  }) => {
    const container = new Container();
    container.zIndex = 100;
  
    const reelColumn = createButton({
      x: gameContainerWidth * xRatio,
      y: gameContainerHeight * yRatio,
      anchor: { x: 0.5, y: 0.5 },
      width: gameContainerWidth * widthRatio,
      height: gameContainerHeight * heightRatio,
      texture: Assets.get('reelColumn'),
    });
  
    const resize = (newWidth: number, newHeight: number) => {
      (reelColumn as any).setPosition(newWidth * xRatio, newHeight * yRatio);
      (reelColumn as any).setSize(newWidth * widthRatio, newHeight * heightRatio);
    };
  
    container.addChild(reelColumn);
    (container as any).resize = resize;
  
    return container;
  };
  
  export default createReelColumn;