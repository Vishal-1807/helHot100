import { Assets, Container, Graphics, Text, TextStyle, Texture, Sprite } from 'pixi.js';
import { UI_POS } from '../constants/Positions';
import { Z_INDEX } from '../constants/ZIndex';
import { createButton } from '../commons'; // Adjust path as needed
import { createSpriteFromLoadedAssets } from '../commons/Sprites';
import { gsap } from 'gsap';

/**
 * Shows a win popup with zoom animation that automatically closes after a specified duration
 * @param appWidth - Application width
 * @param appHeight - Application height
 * @param parentContainer - Container to add the popup to
 * @param winType - Type of win popup ('totalWin' or 'bigWin') for texture
 * @param options - Optional configuration for text, texture/sprite, and timing
 * @returns Promise that resolves when popup animation completes
 */
interface WinPopupOptions {
  winAmount?: number;
  textContent?: string;
  textRelativeX?: number; // Relative X position to popup (0 to 1)
  textRelativeY?: number; // Relative Y position to popup (0 to 1)
  textStyle?: Partial<TextStyle>;
  texture?: Sprite | Texture; // Optional sprite or texture to use for the popup
  isAutoSpin?: boolean; // Whether this popup is part of an auto spin sequence
  spriteOptions?: { // Optional sprite animation options for animated popups
    animationSpeed?: number;
    loop?: boolean;
    autoplay?: boolean;
  };
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

    const { winAmount, textContent, textRelativeX = 0.5, textRelativeY = 0.5, textStyle, texture, isAutoSpin = false, spriteOptions = {} } = options;

    // Determine popup duration based on spin type
    const popupDuration = isAutoSpin ? 1.5 : 3; // 1.5 seconds for auto spin, 3 seconds for manual spin
    console.log(`⏱️ Popup duration set to ${popupDuration} seconds (${isAutoSpin ? 'auto' : 'manual'} spin)`);

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
        height: appWidth * UI_POS.WIN_POPUP_HEIGHT,
        texture: texture,
        anchor: { x: 0.5, y: 0.5 },
        onClick: () => {
          console.log('Win popup clicked - could close early here');
        },
      });
    } else if (winType === 'bigWin') {
      // Create animated sprite for bigWin
      console.log(`✅ Creating animated sprite for bigWin popup...`);
      try {
        const animatedSprite = createSpriteFromLoadedAssets('bigWin', {
          x: 0, // Position relative to container
          y: 0, // Position relative to container
          width: appWidth * UI_POS.WIN_POPUP_WIDTH,
          height: appHeight * UI_POS.WIN_POPUP_HEIGHT,
          anchor: 0.5,
          animationSpeed: spriteOptions.animationSpeed || 0.5,
          loop: spriteOptions.loop !== undefined ? spriteOptions.loop : true,
          autoplay: spriteOptions.autoplay !== undefined ? spriteOptions.autoplay : true,
          animationName: "big win hell hot" // Specify the animation name from the JSON
        });

        // Create a container to hold the animated sprite and make it clickable
        winPopup = new Container();
        winPopup.x = appWidth * UI_POS.WIN_POPUP_X;
        winPopup.y = appHeight * UI_POS.WIN_POPUP_Y;
        winPopup.addChild(animatedSprite);

        // Make the container interactive
        winPopup.eventMode = 'static';
        winPopup.cursor = 'pointer';
        winPopup.on('pointerdown', () => {
          console.log('Animated win popup clicked - could close early here');
        });

        console.log(`✅ Animated bigWin sprite created successfully`);
      } catch (error) {
        console.error(`❌ Failed to create animated sprite for bigWin:`, error);
        // Fallback to static texture
        const fetchedTexture = Assets.get<Texture>(winType);
        if (fetchedTexture) {
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
        } else {
          console.error(`❌ No fallback texture found for '${winType}'`);
          resolve();
          return;
        }
      }
    } else {
      // Check if texture exists for other win types
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
      const displayText = textContent || (winAmount !== undefined ? winAmount.toFixed(2) : '0');
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
              // Format the number to show 2 decimal places for floats
              const currentValue = this.targets()[0].value;
              winText.text = currentValue.toFixed(2);
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
      duration: 0.3,
      ease: 'back.out(1.7)',
      onComplete: () => {
        console.log(`✅ Zoom-in animation completed, waiting ${popupDuration} seconds...`);
        // After zoom in, wait for the specified duration then zoom out and remove
        gsap.delayedCall(popupDuration, () => {
          console.log('🎬 Starting zoom-out animation...');
          gsap.to(winPopup.scale, {
            x: 0,
            y: 0,
            duration: 0.2,
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