//Create a simple container with width and height as appwdith and appheight
//dont add background
import { Container, Graphics, Sprite, Texture, Assets } from 'pixi.js';
import { createReelColumn } from './ReelColumn';
import { UI_POS } from '../constants/Positions';
import { TOTAL_REELS } from '../constants/GameConstants';

export const createReelContainer = (gameContainerWidth: number, gameContainerHeight: number) => {
    const container = new Container();
    container.zIndex = 100;
    const totalReels = TOTAL_REELS;

    const REEL_COLUMN_WIDTH_RATIO = (1 - (UI_POS.REEL_CONTAINER_EDGES_SPACING_RATIO * 2)) / totalReels;

    const REEL_COLUMN_X_RATIO = UI_POS.REEL_CONTAINER_EDGES_SPACING_RATIO + (REEL_COLUMN_WIDTH_RATIO / 2) + ((totalReels-3) * Math.abs(UI_POS.REEL_COLUMN_OFFSET_RATIO));

    const reelColumns: any[] = [];

    for (let i = 0; i < totalReels; i++) {
        const reelColumn = createReelColumn({gameContainerWidth: gameContainerWidth, 
                                              gameContainerHeight: gameContainerHeight, 
                                              xRatio: i > 0 ? REEL_COLUMN_X_RATIO + (i * REEL_COLUMN_WIDTH_RATIO) + (UI_POS.REEL_COLUMN_OFFSET_RATIO * i) : REEL_COLUMN_X_RATIO, 
                                              yRatio: UI_POS.REEL_COLUMN_Y_RATIO, 
                                          widthRatio: REEL_COLUMN_WIDTH_RATIO, 
                                          heightRatio: UI_POS.REEL_COLUMN_HEIGHT_RATIO,
                                          columnNumber: i,
                                        });
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

