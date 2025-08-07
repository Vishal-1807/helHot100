import { Assets, Container, Graphics, Text, TextStyle, Texture, Sprite } from 'pixi.js';
import { UI_POS } from '../constants/Positions';
import { Z_INDEX } from '../constants/ZIndex';
import { createButton } from '../commons'; // Adjust path as needed
import { gsap } from 'gsap';

/**
 * Shows a win popup with zoom animation that automatically closes after 3 seconds
 * @param appWidth - Application width
 * @param appHeight - Application height
 * @param parentContainer - Container to add the popup to
 * @param winType - Type of win popup ('totalWin' or 'bigWin') for texture
 * @param options - Optional configuration for text and texture/sprite
 * @returns Promise that resolves when popup animation completes
 */
interface WinPopupOptions {
  winAmount?: number;
  textContent?: string;
  textRelativeX?: number; // Relative X position to popup (0 to 1)
  textRelativeY?: number; // Relative Y position to popup (0 to 1)
  textStyle?: Partial<TextStyle>;
  texture?: Sprite | Texture; // Optional sprite or texture to use for the popup
}

export const ShowWinPopup = (
  appWidth: number,
  appHeight: number,
  parentContainer: Container,
  winType: string = 'totalWin',
  options: WinPopupOptions = {}
): Promise<void> => {
  return new Promise((resolve) => {
    console.log(`🎉 ShowWinPopup called with dimensions: ${appWidth}x${appHeight}, winType: ${winType}`);

    const { winAmount, textContent, textRelativeX = 0.5, textRelativeY = 0.5, textStyle, texture } = options;

    // Create the popup container
    const popupContainer = new Container();
    popupContainer.zIndex = Z_INDEX.POPUP_OVERLAY;

    // Create dark translucent background overlay
    const backgroundOverlay = new Graphics();
    backgroundOverlay.rect(0, 0, appWidth, appHeight);
    backgroundOverlay.fill({ color: 0x000000, alpha: 0.6 });
    backgroundOverlay.eventMode = 'static';
    popupContainer.addChild(backgroundOverlay);

    // Create the win popup button
    let winPopup: Container;
    let popupWidth: number;
    let popupHeight: number;

    if (texture) {
      console.log(`✅ Using provided texture/sprite for win popup`);
      winPopup = createButton({
        x: appWidth * UI_POS.WIN_POPUP_X,
        y: appHeight * UI_POS.WIN_POPUP_Y,
        width: appWidth * UI_POS.WIN_POPUP_WIDTH,
        height: appHeight * UI_POS.WIN_POPUP_HEIGHT,
        texture: texture,
        anchor: { x: 0.5, y: 0.5 },
        onClick: () => {
          console.log('Win popup clicked - could close early here');
        },
      });
    } else {
      // Check if texture exists
      const fetchedTexture = Assets.get<Texture>(winType);
      if (!fetchedTexture) {
        console.error(`❌ Texture '${winType}' not found in Assets.`);
        resolve();
        return;
      }
      console.log(`✅ Texture '${winType}' found, creating popup...`);
      winPopup = createButton({
        x: appWidth * UI_POS.WIN_POPUP_X,
        y: appHeight * UI_POS.WIN_POPUP_Y,
        width: appWidth * UI_POS.WIN_POPUP_WIDTH,
        height: appHeight * UI_POS.WIN_POPUP_HEIGHT,
        texture: fetchedTexture,
        anchor: { x: 0.5, y: 0.5 },
        onClick: () => {
          console.log('Win popup clicked - could close early here');
        },
      });
    }

    popupWidth = appWidth * UI_POS.WIN_POPUP_WIDTH;
    popupHeight = appHeight * UI_POS.WIN_POPUP_HEIGHT;
    popupContainer.addChild(winPopup);
    console.log('✅ Win popup button created and added to popup container');

    // Create text if provided
    let winText: Text | null = null;
    if (textContent || winAmount !== undefined) {
      const displayText = textContent || winAmount?.toString() || '0';
      winText = new Text(displayText, {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff,
        align: 'center',
        ...textStyle
      });

      // Set anchor and position after creation
      winText.anchor.set(0.5, 0.5);
      winText.x = winPopup.x + (textRelativeX - 0.5) * popupWidth;
      winText.y = winPopup.y + (textRelativeY - 0.5) * popupHeight;

      popupContainer.addChild(winText);
      console.log('✅ Win text created and added to popup container');

      // Animate number counting if winAmount is provided
      if (winAmount !== undefined) {
        console.log('🎬 Starting number counting animation...');
        gsap.to({ value: 0 }, {
          value: winAmount,
          duration: 1,
          onUpdate: function () {
            if (winText) {
              winText.text = Math.floor(this.targets()[0].value).toString();
            }
          },
          ease: 'power2.out'
        });
      }
    }

    // Set initial scale to 0 for zoom-in effect
    winPopup.scale.set(0);
    console.log('✅ Initial scale set to 0');

    // Add popup to parent container
    parentContainer.addChild(popupContainer);
    console.log('✅ Popup container added to parent container');

    // Animate zoom in
    console.log('🎬 Starting zoom-in animation...');
    gsap.to(winPopup.scale, {
      x: 1,
      y: 1,
      duration: 0.5,
      ease: 'back.out(1.7)',
      onComplete: () => {
        console.log('✅ Zoom-in animation completed, waiting 3 seconds...');
        // After zoom in, wait 3 seconds then zoom out and remove
        gsap.delayedCall(3, () => {
          console.log('🎬 Starting zoom-out animation...');
          gsap.to(winPopup.scale, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: 'back.in(1.7)',
            onComplete: () => {
              console.log('✅ Zoom-out animation completed, cleaning up...');
              // Remove popup from parent container
              parentContainer.removeChild(popupContainer);
              popupContainer.destroy();
              console.log('✅ Popup cleaned up successfully');
              resolve();
            }
          });
        });
      }
    });
  });
};