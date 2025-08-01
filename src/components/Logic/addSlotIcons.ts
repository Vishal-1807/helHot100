import { Container, Graphics, Sprite, Texture, Assets } from 'pixi.js';
import { createButton } from '../commons/Button';
import {TOTAL_REELS, ICONS_PER_REEL} from '../constants/GameConstants';

export const addSlotIcons = (reelColumn: any, reelColumnContainer: any) => {
    const slotIcons: any[] = [];

    const tempSlotIcons = [Assets.get('watermelonIcon'), Assets.get('sevenIcon'), Assets.get('plumIcon'), Assets.get('grapesIcon'), Assets.get('cherryIcon'), Assets.get('lemonIcon'), Assets.get('scatterIcon'), Assets.get('wildIcon')]

    const ICON_HEIGHT = reelColumn.height / ICONS_PER_REEL;

    for (let i = 0; i < ICONS_PER_REEL; i++) {
        const slotIcon = createButton({
            x: reelColumn.x,
            y: reelColumn.y - reelColumn.height/2 + (ICON_HEIGHT/2) + (ICON_HEIGHT * i),
            width: reelColumn.width*0.98,
            height: ICON_HEIGHT,
            texture: tempSlotIcons[Math.floor(Math.random() * tempSlotIcons.length)],
            shadow: false,
            onClick: () => {
                console.log('Slot icon clicked');
            },
        });
        slotIcon.zIndex = 200;
        slotIcons.push(slotIcon);
    }

    for (let i = 0; i < slotIcons.length; i++) {
        reelColumnContainer.addChild(slotIcons[i]);
    }

    return slotIcons;
};

export default addSlotIcons;
        