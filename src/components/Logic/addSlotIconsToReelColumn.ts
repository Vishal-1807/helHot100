import { Container, Graphics, Sprite, Texture, Assets } from 'pixi.js';
import { createButton } from '../commons/Button';
import {TOTAL_REELS, ICONS_PER_REEL} from '../constants/GameConstants';
import { getSecureRandomNumber } from '../commons/getRandom';
import { GlobalState } from '../../globals/gameState';

export const addSlotIcons = (reelColumn: any, reelColumnContainer: any, columnNumber: number, icons: any[]) => {
    const slotIcons: any[] = [];

    const ICON_HEIGHT = reelColumn.height / ICONS_PER_REEL;

    for (let i = 0; i < ICONS_PER_REEL; i++) {
        const slotIcon = createButton({
            x: reelColumn.x,
            y: reelColumn.y - reelColumn.height/2 + (ICON_HEIGHT/2) + (ICON_HEIGHT * i),
            width: ICON_HEIGHT * 1.05,
            anchor: { x: 0.5, y: 0.5 },
            height: ICON_HEIGHT * 1.05,
            texture: Assets.get(icons[Math.floor(getSecureRandomNumber(0, icons.length-1))]),
            shadow: false,
            onClick: () => {
                console.log('Slot icon clicked');
            },
        });
        console.log(slotIcon.x, slotIcon.y, 'slot icon position');
        //use the exposed button get position method
        GlobalState.setIconPosition(i, columnNumber, {x: slotIcon.x, y: slotIcon.y + slotIcon.height/1.8});
        slotIcon.zIndex = 200;
        slotIcons.push(slotIcon);
    }

    const resizeSlotIcons = (newWidth: number, newHeight: number, reelColumn: any) => {
        // Get the current reel column size and position after it has been resized
        const reelColumnSize = (reelColumn as any).getSize();
        const reelColumnPos = (reelColumn as any).getPosition();
        const reelColumnWidth = reelColumnSize.width;
        const reelColumnHeight = reelColumnSize.height;
        const newIconHeight = reelColumnHeight / ICONS_PER_REEL;

        for (let i = 0; i < slotIcons.length; i++) {
            // Use the reel column's current position and size for positioning
            (slotIcons[i] as any).setPosition(
                reelColumnPos.x,
                reelColumnPos.y - reelColumnHeight/2 + (newIconHeight/2) + (newIconHeight * i)
            );
            // Use the reel column's width for sizing
            (slotIcons[i] as any).setSize(reelColumnWidth * 0.98, newIconHeight);
        }
    };

    for (let i = 0; i < slotIcons.length; i++) {
        reelColumnContainer.addChild(slotIcons[i]);
    }

    return {slotIcons, resizeSlotIcons};
};

export default addSlotIcons;
        