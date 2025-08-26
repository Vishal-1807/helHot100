import { Assets, Graphics } from 'pixi.js';
import { TOTAL_REELS, ICONS_PER_REEL, blurredSlotIconsNames } from '../constants/GameConstants';
import { getSecureRandomNumber } from '../commons/getRandom';
import { addSlotIcons } from './addSlotIconsToReelColumn';
import { createButton } from '../commons/Button';

// TypeScript interfaces for function parameters
export interface AnimateReelSpinParams {
  reelContainer: any;
  duration?: number;
  speed?: number; // Speed multiplier (1 = normal, 2 = double speed, 0.5 = half speed)
  finalIcons?: string[][];
  delayBetweenReels?: number; // Delay in milliseconds between starting each reel (default: 200ms)
  useEasing?: boolean; // Whether to use easing (slow start, speed up, slow down) (default: true)
}

export interface StopSingleReelParams {
  reelColumnContainer: any;
  columnIndex: number;
  finalIcons?: string[];
  pulseScale?: number; // Scale multiplier for pulse effect (default: 1.1)
  pulseDuration?: number; // Duration of pulse animation (default: 400ms)
  pulseDelay?: number; // Delay before pulse starts (default: 50ms)
}

export interface StopReelAnimationSequentialParams {
  reelContainer: any;
  finalIcons?: string[][];
  delayBetweenReels?: number;
  pulseScale?: number; // Scale multiplier for pulse effect (default: 1.1)
  pulseDuration?: number; // Duration of pulse animation (default: 400ms)
  pulseDelay?: number; // Delay before pulse starts (default: 50ms)
}

export interface StopReelAnimationParams {
  reelContainer: any;
  finalIcons?: string[][];
  pulseScale?: number; // Scale multiplier for pulse effect (default: 1.1)
  pulseDuration?: number; // Duration of pulse animation (default: 400ms)
  pulseDelay?: number; // Delay before pulse starts (default: 50ms)
}

export interface PulseEffectParams {
  slotIcons: any[];
  pulseScale?: number; // Scale multiplier (default: 1.1)
  duration?: number; // Duration of pulse animation (default: 400ms)
  delayBetweenIcons?: number; // Delay between each icon's pulse (default: 50ms)
}

// Animation state tracking
const animationStates = new Map<any, {
  isAnimating: boolean;
  animationIcons: any[];
  mask?: Graphics;
  resizeFunction?: (newWidth: number, newHeight: number) => void;
}>();

export const animateReelSpin = (params: AnimateReelSpinParams) => {
  const {
    reelContainer,
    duration = 400,
    speed = 1,
    finalIcons,
    delayBetweenReels = 250, // Increased default delay for more noticeable sequential effect
    useEasing = true
  } = params;

  // Start each reel sequentially from left to right
  reelContainer.children.forEach((reelColumnContainer: any, columnIndex: number) => {
    // Calculate delay for this reel (left to right)
    const startDelay = columnIndex * delayBetweenReels;

    // Start this reel's animation after the calculated delay
    setTimeout(() => {
      animateSingleReel(reelColumnContainer, columnIndex, duration, speed, useEasing);
    }, startDelay);
  });
};

// Helper function to animate a single reel with easing
const animateSingleReel = (reelColumnContainer: any, columnIndex: number, duration: number, speed: number, useEasing: boolean) => {
    // Stop any existing animation and clean up first
    const existingState = animationStates.get(reelColumnContainer);
    if (existingState) {
      existingState.isAnimating = false;
      existingState.animationIcons.forEach((icon: any) => {
        if (icon && icon.parent) {
          icon.parent.removeChild(icon);
          icon.destroy();
        }
      });
      // Clean up mask
      if (existingState.mask) {
        if (existingState.mask.parent) {
          existingState.mask.parent.removeChild(existingState.mask);
        }
        existingState.mask.destroy();
      }
      animationStates.delete(reelColumnContainer);
    }

    // Clear existing slot icons
    reelColumnContainer.clearSlotIcons();

    // Remove any remaining children except the reel column button
    const reelColumnButton = reelColumnContainer.children[0];
    while (reelColumnContainer.children.length > 1) {
      const child = reelColumnContainer.children[reelColumnContainer.children.length - 1];
      reelColumnContainer.removeChild(child);
      if (child.destroy) child.destroy();
    }

    // Calculate icon dimensions
    const ICON_HEIGHT = reelColumnButton.height / ICONS_PER_REEL;
    const ICON_WIDTH = reelColumnButton.width * 0.98;

    // Use localBounds to get reel column boundaries
    const localBounds = reelColumnButton.getLocalBounds();
    const animationStartY = reelColumnButton.y + localBounds.y + (ICON_HEIGHT / 2); // Center of first icon

    // Create more icons for seamless continuous animation
    const totalAnimationIcons = ICONS_PER_REEL+4;
    const animationIcons: any[] = [];

    // Start icons at the animation start point
    for (let i = 0; i < totalAnimationIcons; i++) {
      const randomIconName = blurredSlotIconsNames[Math.floor(getSecureRandomNumber(0, blurredSlotIconsNames.length - 1))];
      const slotIcon = createButton({
        x: reelColumnButton.x,
        y: animationStartY + (ICON_HEIGHT * i),
        width: ICON_WIDTH,
        anchor: { x: 0.5, y: 0.5 },
        height: ICON_HEIGHT * 1.05,
        texture: Assets.get(randomIconName),
        shadow: false,
        onClick: () => {
          console.log('Animated slot icon clicked');
        },
      });
      slotIcon.zIndex = 200;
      animationIcons.push(slotIcon);
      reelColumnContainer.addChild(slotIcon);
    }

    // Create mask to hide icons outside the reel area
    const mask = new Graphics();
    mask.rect(
      localBounds.x,
      localBounds.y+8,
      localBounds.width,
      localBounds.height-20
    );
    mask.fill(0xffffff);
    mask.x = reelColumnButton.x;
    mask.y = reelColumnButton.y;
    reelColumnContainer.addChild(mask);

    // Apply mask to all animation icons
    animationIcons.forEach((icon: any) => {
      icon.mask = mask;
    });

    // Animation speed and easing setup
    const baseAnimationSpeed = (reelColumnButton.height + ICON_HEIGHT * 2) / (duration / 40); // 60fps
    let currentSpeed = baseAnimationSpeed * speed; // Apply speed multiplier

    // Easing variables - improved for more pronounced effect
    let animationStartTime = Date.now();
    const easingDuration = duration;
    const minSpeedMultiplier = 0.8; // Start much slower (30% of normal speed)
    const maxSpeedMultiplier = 2.0; // Higher peak speed (200% of normal speed)

    // Create resize function for animated icons
    const resizeAnimatedIcons = () => {
      const reelColumnSize = (reelColumnButton as any).getSize();
      const reelColumnPos = (reelColumnButton as any).getPosition();
      const reelColumnWidth = reelColumnSize.width;
      const reelColumnHeight = reelColumnSize.height;
      const newIconHeight = reelColumnHeight / ICONS_PER_REEL;
      const newIconWidth = reelColumnWidth * 0.98;

      // Use localBounds for consistent positioning
      const localBounds = reelColumnButton.getLocalBounds();
      const newAnimationStartY = reelColumnPos.y + localBounds.y + (newIconHeight / 2);

      // Update mask size and position
      const state = animationStates.get(reelColumnContainer);
      if (state && state.mask) {
        state.mask.clear();
        state.mask.rect(
          localBounds.x,
          localBounds.y,
          localBounds.width,
          localBounds.height
        );
        state.mask.fill(0xffffff);
        state.mask.x = reelColumnPos.x;
        state.mask.y = reelColumnPos.y;
      }

      animationIcons.forEach((icon: any, index: number) => {
        if (icon && typeof icon.setSize === 'function') {
          (icon as any).setSize(newIconWidth, newIconHeight);
          // Position icons relative to the new animation start position
          const iconY = newAnimationStartY + (newIconHeight * index);
          (icon as any).setPosition(reelColumnPos.x, iconY);
        }
      });
    };

    // Store animation state
    animationStates.set(reelColumnContainer, {
      isAnimating: true,
      animationIcons,
      mask,
      resizeFunction: () => resizeAnimatedIcons()
    });

    // Animation loop with easing
    const animate = () => {
      const state = animationStates.get(reelColumnContainer);
      if (!state || !state.isAnimating) return;

      // Calculate easing if enabled
      let animationSpeed = currentSpeed;
      if (useEasing) {
        const elapsed = Date.now() - animationStartTime;
        const progress = Math.min(elapsed / easingDuration, 1);

        // Easing function: slow start, speed up, then slow down (ease-in-out-cubic)
        const easeInOutCubic = (t: number) => {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const easedProgress = easeInOutCubic(progress);
        const speedMultiplier = minSpeedMultiplier + (maxSpeedMultiplier - minSpeedMultiplier) * easedProgress;
        animationSpeed = baseAnimationSpeed * speed * speedMultiplier;
      }

      // Get current bounds for boundary checking
      const currentLocalBounds = reelColumnButton.getLocalBounds();
      const currentAnimationEndY = reelColumnButton.y + currentLocalBounds.y + currentLocalBounds.height - (ICON_HEIGHT / 2);
      const currentAnimationStartY = reelColumnButton.y + currentLocalBounds.y + (ICON_HEIGHT / 2);

      animationIcons.forEach((icon: any) => {
        if (!icon) return;

        const currentPos = (icon as any).getPosition();
        const newY = currentPos.y + animationSpeed;

        if (newY > currentAnimationEndY + ICON_HEIGHT) {
          const randomIconName = blurredSlotIconsNames[Math.floor(getSecureRandomNumber(0, blurredSlotIconsNames.length - 1))];
          (icon as any).setTexture(Assets.get(randomIconName));

          // Find the topmost icon position
          let topMostY = currentAnimationStartY;
          animationIcons.forEach((otherIcon: any) => {
            if (otherIcon !== icon) {
              const otherPos = (otherIcon as any).getPosition();
              if (otherPos.y < currentAnimationStartY && otherPos.y < topMostY) {
                topMostY = otherPos.y;
              }
            }
          });

          const newIconY = topMostY < currentAnimationStartY ? topMostY - ICON_HEIGHT : currentAnimationStartY - ICON_HEIGHT;
          (icon as any).setPosition(currentPos.x, newIconY);
        } else {
          (icon as any).setPosition(currentPos.x, newY);
        }
      });

      if (state.isAnimating) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    if (!(reelColumnContainer as any).originalResize) {
      (reelColumnContainer as any).originalResize = reelColumnContainer.resize;
    }

    const originalResize = (reelColumnContainer as any).originalResize;
    reelColumnContainer.resize = (newWidth: number, newHeight: number) => {
      if (originalResize && typeof originalResize === 'function') {
        originalResize(newWidth, newHeight);
      }
      const state = animationStates.get(reelColumnContainer);
      if (state && state.resizeFunction) {
        state.resizeFunction(newWidth, newHeight);
      }
    };
};

// Function to animate smooth pulse effect on final icons
const animatePulseEffect = (params: PulseEffectParams) => {
  const {
    slotIcons,
    pulseScale = 1.1,
    duration = 400,
    delayBetweenIcons = 50
  } = params;

  if (!slotIcons || slotIcons.length === 0) return;

  slotIcons.forEach((icon: any, index: number) => {
    if (!icon || typeof icon.setSize !== 'function') return;

    const originalSize = (icon as any).getSize();
    const startTime = Date.now();

    const pulse = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ultra-smooth easing function for pulse (ease-in-out-sine)
      const easeInOutSine = (t: number) => {
        return -(Math.cos(Math.PI * t) - 1) / 2;
      };

      const easedProgress = easeInOutSine(progress);

      // Create a smooth pulse using sine wave for natural scaling
      const pulseProgress = Math.sin(easedProgress * Math.PI); // Creates smooth 0->1->0 curve
      const scaleMultiplier = 1 + (pulseScale - 1) * pulseProgress;

      const newWidth = originalSize.width * scaleMultiplier;
      const newHeight = originalSize.height * scaleMultiplier;

      (icon as any).setSize(newWidth, newHeight);

      if (progress < 1) {
        requestAnimationFrame(pulse);
      } else {
        // Ensure final size is exactly the original size
        (icon as any).setSize(originalSize.width, originalSize.height);
      }
    };

    // Start pulse animation with a slight delay for each icon to create a wave effect
    setTimeout(() => {
      requestAnimationFrame(pulse);
    }, index * delayBetweenIcons);
  });
};

// Function to stop a single reel column
export const stopSingleReel = (params: StopSingleReelParams) => {
  const {
    reelColumnContainer,
    columnIndex,
    finalIcons,
    pulseScale = 1.1,
    pulseDuration = 400,
    pulseDelay = 50
  } = params;

  const state = animationStates.get(reelColumnContainer);
  if (state) {
    state.isAnimating = false;

    // Clean up animated icons more thoroughly
    state.animationIcons.forEach((icon: any) => {
      try {
        if (icon && icon.parent) {
          icon.parent.removeChild(icon);
          icon.destroy();
        }
      } catch (error) {
        console.warn('Error removing animated icon:', error);
      }
    });

    // Clean up mask
    if (state.mask) {
      try {
        if (state.mask.parent) {
          state.mask.parent.removeChild(state.mask);
        }
        state.mask.destroy();
      } catch (error) {
        console.warn('Error removing mask:', error);
      }
    }

    animationStates.delete(reelColumnContainer);
  }

  try {
    reelColumnContainer.clearSlotIcons();
  } catch (error) {
    console.warn('Error clearing slot icons:', error);
  }

  if (finalIcons) {
    const reelColumnButton = reelColumnContainer.children[0];
    const { slotIcons, resizeSlotIcons } = addSlotIcons(reelColumnButton, reelColumnContainer, columnIndex, finalIcons, true);

    // Add pulse effect to the final icons
    setTimeout(() => {
      animatePulseEffect({
        slotIcons,
        pulseScale,
        duration: pulseDuration,
        delayBetweenIcons: 50
      });
    }, pulseDelay);

    const originalResize = (reelColumnContainer as any).originalResize || reelColumnContainer.resize;

    if (!(reelColumnContainer as any).originalResize) {
      (reelColumnContainer as any).originalResize = reelColumnContainer.resize;
    }

    reelColumnContainer.resize = (newWidth: number, newHeight: number) => {
      if (originalResize && typeof originalResize === 'function') {
        originalResize(newWidth, newHeight);
      }
      resizeSlotIcons(newWidth, newHeight, reelColumnButton);
    };
  }
};

// Function to stop reel animation sequentially from left to right
export const stopReelAnimationSequential = (params: StopReelAnimationSequentialParams) => {
  const {
    reelContainer,
    finalIcons,
    delayBetweenReels = 500,
    pulseScale = 1.1,
    pulseDuration = 400,
    pulseDelay = 50
  } = params;

  reelContainer.children.forEach((reelColumnContainer: any, columnIndex: number) => {
    setTimeout(() => {
      const columnFinalIcons = finalIcons ? finalIcons[columnIndex] : undefined;
      stopSingleReel({
        reelColumnContainer,
        columnIndex,
        finalIcons: columnFinalIcons,
        pulseScale,
        pulseDuration,
        pulseDelay
      });
    }, columnIndex * delayBetweenReels);
  });
};

// Function to stop reel animation immediately (all at once)
export const stopReelAnimation = (params: StopReelAnimationParams) => {
  const {
    reelContainer,
    finalIcons,
    pulseScale = 1.1,
    pulseDuration = 400,
    pulseDelay = 50
  } = params;

  reelContainer.children.forEach((reelColumnContainer: any, columnIndex: number) => {
    const columnFinalIcons = finalIcons ? finalIcons[columnIndex] : undefined;
    stopSingleReel({
      reelColumnContainer,
      columnIndex,
      finalIcons: columnFinalIcons,
      pulseScale,
      pulseDuration,
      pulseDelay
    });
  });
};

// Backward compatibility functions (deprecated - use object parameter versions instead)
export const animateReelSpinLegacy = (reelContainer: any, duration: number = 3000, finalIcons?: string[][]) => {
  console.warn('animateReelSpinLegacy is deprecated. Use animateReelSpin with object parameters instead.');
  return animateReelSpin({ reelContainer, duration, finalIcons });
};

export const stopSingleReelLegacy = (reelColumnContainer: any, columnIndex: number, finalIcons?: string[]) => {
  console.warn('stopSingleReelLegacy is deprecated. Use stopSingleReel with object parameters instead.');
  return stopSingleReel({ reelColumnContainer, columnIndex, finalIcons });
};

export const stopReelAnimationSequentialLegacy = (reelContainer: any, finalIcons?: string[][], delayBetweenReels: number = 500) => {
  console.warn('stopReelAnimationSequentialLegacy is deprecated. Use stopReelAnimationSequential with object parameters instead.');
  return stopReelAnimationSequential({ reelContainer, finalIcons, delayBetweenReels });
};

export const stopReelAnimationLegacy = (reelContainer: any, finalIcons?: string[][]) => {
  console.warn('stopReelAnimationLegacy is deprecated. Use stopReelAnimation with object parameters instead.');
  return stopReelAnimation({ reelContainer, finalIcons });
};

// Original static blur function (for compatibility)
export const reelAnimation = (reelContainer: any) => {
  reelContainer.children.forEach((reelColumnContainer: any, index: number) => {
    reelColumnContainer.clearSlotIcons();
    const reelColumnButton = reelColumnContainer.children[0];
    const { resizeSlotIcons } = addSlotIcons(reelColumnButton, reelColumnContainer, index, blurredSlotIconsNames);

    if (!(reelColumnContainer as any).originalResize) {
      (reelColumnContainer as any).originalResize = reelColumnContainer.resize;
    }

    const originalResize = (reelColumnContainer as any).originalResize;
    reelColumnContainer.resize = (newWidth: number, newHeight: number) => {
      if (originalResize && typeof originalResize === 'function') {
        originalResize(newWidth, newHeight);
      }
      resizeSlotIcons(newWidth, newHeight, reelColumnButton);
    };
  });
};