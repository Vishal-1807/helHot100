import { Container, Assets } from 'pixi.js';
import { createButton } from '../commons/Button';
import { createSpriteFromLoadedAssets } from '../commons/Sprites';
import { UI_POS } from '../constants/Positions';
import { SoundManager } from '../../utils/SoundManager';
import { ActivityTypes, recordUserActivity } from '../../utils/gameActivityManager';
import { GlobalState } from '../../globals/gameState';

export const createTurboButton = (appWidth: number, appHeight: number) => {
    const turboButtonContainer = new Container();
    let turboActiveSprite: any = null;

    const turboButton = createButton({
        x: appWidth * UI_POS.TURBO_BUTTON_X,
        y: appHeight * UI_POS.TURBO_BUTTON_Y,
        width: Math.max(appHeight * UI_POS.TURBO_BUTTON_MAX_HEIGHT_RATIO, UI_POS.TURBO_BUTTON_MIN_HEIGHT),
        height: Math.max(appHeight * UI_POS.TURBO_BUTTON_MAX_HEIGHT_RATIO, UI_POS.TURBO_BUTTON_MIN_HEIGHT),
        texture: Assets.get('turbo'),
        borderRadius: 10,
        shadow: false,
        onClick: () => {
            // Toggle turbo mode
            const currentTurboMode = GlobalState.getIsTurboMode();
            GlobalState.setIsTurboMode(!currentTurboMode);

            // Update button appearance based on turbo state
            const newTurboMode = GlobalState.getIsTurboMode();
            if (newTurboMode) {
                // Turbo is ON - create and show animated sprite
                try {
                    // Remove existing sprite if any
                    if (turboActiveSprite) {
                        turboButtonContainer.removeChild(turboActiveSprite);
                        turboActiveSprite = null;
                    }

                    // Hide the regular button
                    turboButton.visible = false;

                    // Create animated sprite
                    turboActiveSprite = createSpriteFromLoadedAssets('turboActive', {
                        x: appWidth * UI_POS.TURBO_BUTTON_X,
                        y: appHeight * UI_POS.TURBO_BUTTON_Y,
                        width: Math.max(appHeight * UI_POS.TURBO_BUTTON_MAX_HEIGHT_RATIO, UI_POS.TURBO_BUTTON_MIN_HEIGHT) + appHeight * 0.5,
                        height: Math.max(appHeight * UI_POS.TURBO_BUTTON_MAX_HEIGHT_RATIO, UI_POS.TURBO_BUTTON_MIN_HEIGHT),
                        anchor: 0.5,
                        animationSpeed: 0.5,
                        loop: true,
                        autoplay: true
                    });

                    // Make sprite interactive
                    turboActiveSprite.interactive = true;
                    turboActiveSprite.cursor = 'pointer';
                    turboActiveSprite.on('pointerdown', () => {
                        // Same click handler logic
                        const currentMode = GlobalState.getIsTurboMode();
                        GlobalState.setIsTurboMode(!currentMode);

                        // Hide sprite and show regular button
                        if (turboActiveSprite) {
                            turboButtonContainer.removeChild(turboActiveSprite);
                            turboActiveSprite = null;
                        }
                        turboButton.visible = true;

                        SoundManager.playUIClick();
                        recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'turboButton', turboMode: false });
                        console.log('🚀 Turbo mode DISABLED');
                    });

                    turboButtonContainer.addChild(turboActiveSprite);
                    console.log('🚀 Turbo mode ENABLED with animated sprite');
                } catch (error) {
                    console.error('❌ Failed to create turboActive sprite:', error);
                    // Fallback to showing regular button
                    turboButton.visible = true;
                }
            } else {
                // Turbo is OFF - show regular button and hide sprite
                if (turboActiveSprite) {
                    turboButtonContainer.removeChild(turboActiveSprite);
                    turboActiveSprite = null;
                }
                turboButton.visible = true;
                console.log('🚀 Turbo mode DISABLED');
            }

            SoundManager.playUIClick();
            recordUserActivity(ActivityTypes.BUTTON_CLICK, { buttonName: 'turboButton', turboMode: newTurboMode });
        },
    });
    turboButtonContainer.addChild(turboButton);

    const resize = (newWidth: number, newHeight: number) => {
        // Resize regular button
        (turboButton as any).setPosition(newWidth * UI_POS.TURBO_BUTTON_X, newHeight * UI_POS.TURBO_BUTTON_Y);
        (turboButton as any).setSize(Math.max(newHeight * UI_POS.TURBO_BUTTON_MAX_HEIGHT_RATIO, UI_POS.TURBO_BUTTON_MIN_HEIGHT), Math.max(newHeight * UI_POS.TURBO_BUTTON_MAX_HEIGHT_RATIO, UI_POS.TURBO_BUTTON_MIN_HEIGHT));

        // Resize animated sprite if it exists
        if (turboActiveSprite) {
            turboActiveSprite.x = newWidth * UI_POS.TURBO_BUTTON_X;
            turboActiveSprite.y = newHeight * UI_POS.TURBO_BUTTON_Y;
            turboActiveSprite.width = Math.max(newHeight * UI_POS.TURBO_BUTTON_MAX_HEIGHT_RATIO, UI_POS.TURBO_BUTTON_MIN_HEIGHT);
            turboActiveSprite.height = Math.max(newHeight * UI_POS.TURBO_BUTTON_MAX_HEIGHT_RATIO, UI_POS.TURBO_BUTTON_MIN_HEIGHT);
        }
    };

    (turboButtonContainer as any).resize = resize;

    return turboButtonContainer;
};

export default createTurboButton;