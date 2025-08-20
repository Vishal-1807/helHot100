import { Container, Graphics, Sprite, Texture, Assets } from 'pixi.js';
import { createButton } from '../commons/Button';
import {TOTAL_REELS, ICONS_PER_REEL} from '../constants/GameConstants';
import { getSecureRandomNumber } from '../commons/getRandom';
import { GlobalState } from '../../globals/gameState';
import { createSpriteFromLoadedAssets } from '../commons';

export const addSlotIcons = (reelColumn: any, reelColumnContainer: any, columnNumber: number, icons: any[], useIconsInOrder: boolean = false) => {
    const slotIcons: any[] = [];

    const ICON_HEIGHT = reelColumn.height / ICONS_PER_REEL;

    for (let i = 0; i < ICONS_PER_REEL; i++) {
        let icon: string;
        if (useIconsInOrder) {
            // Use the specific icon from the array in order (for final icons after spin)
            icon = i < icons.length ? icons[i] : icons[Math.floor(getSecureRandomNumber(0, icons.length-1))];
            console.log(`Column ${columnNumber}, Row ${i}: Using final icon ${icon} in order`);
        } else {
            // Use random icon from the array (for initial load)
            icon = icons[Math.floor(getSecureRandomNumber(0, icons.length-1))];
            console.log(`Column ${columnNumber}, Row ${i}: Using random icon ${icon}`);
        }
        const slotIcon = createButton({
            x: reelColumn.x,
            y: reelColumn.y - reelColumn.height/2 + (ICON_HEIGHT/2) + (ICON_HEIGHT * i),
            width: reelColumn.width * 0.98,
            anchor: { x: 0.5, y: 0.5 },
            height: ICON_HEIGHT * 1.05,
            texture: icon == 'lemonWin' || icon == 'plumWin' ? createSpriteFromLoadedAssets(icon, {width: ICON_HEIGHT * 1.05, height: ICON_HEIGHT * 1.05}) : Assets.get(icon),
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
        