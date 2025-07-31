//Create a simple container with width and height as appwdith and appheight
//dont add background
import { Container, Graphics, Sprite, Texture, Assets } from 'pixi.js';
import { createReelColumn } from './ReelColumn';
import { REEL_COLUMN_WIDTH_RATIO, REEL_COLUMN_HEIGHT_RATIO, REEL_COLUMN_Y_RATIO, TOTAL_REELS, REEL_CONTAINER_EDGES_SPACING_RATIO, REEL_COLUMN_OFFSET_RATIO } from '../constants/GameConstants';

export const createReelContainer = (gameContainerWidth: number, gameContainerHeight: number) => {
    const container = new Container();
    container.zIndex = 100;
    const totalReels = TOTAL_REELS;

    const REEL_COLUMN_WIDTH_RATIO = (1 - (REEL_CONTAINER_EDGES_SPACING_RATIO * 2)) / totalReels;

    const REEL_COLUMN_X_RATIO = REEL_CONTAINER_EDGES_SPACING_RATIO + (REEL_COLUMN_WIDTH_RATIO / 2) + ((totalReels-3) * Math.abs(REEL_COLUMN_OFFSET_RATIO));

    const reelColumns: any[] = [];

    for (let i = 0; i < totalReels; i++) {
        const reelColumn = createReelColumn({gameContainerWidth: gameContainerWidth, 
                                              gameContainerHeight: gameContainerHeight, 
                                              xRatio: i > 0 ? REEL_COLUMN_X_RATIO + (i * REEL_COLUMN_WIDTH_RATIO) + (REEL_COLUMN_OFFSET_RATIO * i) : REEL_COLUMN_X_RATIO, 
                                              yRatio: REEL_COLUMN_Y_RATIO, 
                                          widthRatio: REEL_COLUMN_WIDTH_RATIO, 
                                          heightRatio: REEL_COLUMN_HEIGHT_RATIO});
        reelColumns.push(reelColumn);
    }

    const resize = (newWidth: number, newHeight: number) => {
        reelColumns.forEach((reelColumn: any) => {
            reelColumn.resize(newWidth, newHeight);
        });
    };

    reelColumns.forEach((reelColumn: any) => {
        container.addChild(reelColumn);
    });

    (container as any).resize = resize;

    return container;
};

export default createReelContainer;

