import { startSpin, endSpin } from "../../utils/gameButtonStateManager";
import { stopReelAnimation, stopReelAnimationSequential } from "./reelAnimation";
import { animateReelSpin } from "./reelAnimation";
import { sendRoundStartEvent } from "../../WebSockets/roundStart";
import { GlobalState } from "../../globals/gameState";
import { ICONS_PER_REEL, TOTAL_REELS, WIN_POPUP_TYPES, slotIconMapping } from "../constants/GameConstants";
import { createMultiplePayline, clearPaylines } from "../commons/createPayline";
import { createSpriteFromLoadedAssets } from "../commons/Sprites";
import { createButton } from "../commons/Button";
import { ShowWinPopup } from "../popups/WinPopup";

// Mapping from regular icon names to their win sprite counterparts
const iconToWinSpriteMapping: { [key: string]: string } = {
  'watermelonIcon': 'watermelonWin',
  'sevenIcon': 'sevenWin',
  'plumIcon': 'plumWin',
  'grapesIcon': 'grapesWin',
  'cherryIcon': 'cherryWin',
  'lemonIcon': 'lemonWin',
  'scatterIcon': 'scatterWin',
  'wildIcon': 'wildWin'
};

// Function to convert winning positions to animated sprites
const convertWinningPositionsToSprites = (reelContainer: any, paylineMatrices: number[][][]) => {
  console.log('🎰 Converting winning positions to sprites...');

  // Get all unique winning positions from all payline matrices
  const winningPositions = new Set<string>();
  paylineMatrices.forEach(matrix => {
    matrix.forEach(([row, col]) => {
      winningPositions.add(`${row},${col}`);
    });
  });

  console.log('🎯 Winning positions:', Array.from(winningPositions));

  // Get icon positions from GlobalState
  const iconPositions = GlobalState.getIconPosition();
  if (!iconPositions || iconPositions.length === 0) {
    console.warn('⚠️ No icon positions found in GlobalState');
    return;
  }

  // Convert each winning position to sprite
  winningPositions.forEach(positionKey => {
    const [row, col] = positionKey.split(',').map(Number);

    // Get the icon position from GlobalState
    if (!iconPositions[row] || !iconPositions[row][col]) {
      console.warn(`⚠️ Icon position not found in GlobalState for [${row}, ${col}]`);
      return;
    }

    const iconPosition = iconPositions[row][col];
    console.log(`📍 Found icon position for [${row}, ${col}]:`, iconPosition);

    // Get the reel column container to find the actual slot icon
    const reelColumnContainer = reelContainer.children[col];
    if (!reelColumnContainer) {
      console.warn(`⚠️ Reel column ${col} not found`);
      return;
    }

    // The slot icons are children of the reel column container
    // The first child (index 0) is the reel column background
    // Slot icons start from index 1, so icon at row 0 is at index 1, row 1 is at index 2, etc.
    const slotIconIndex = row + 1;
    const slotIcon = reelColumnContainer.children[slotIconIndex];

    if (!slotIcon) {
      console.warn(`⚠️ Slot icon at position [${row}, ${col}] not found. Container has ${reelColumnContainer.children.length} children`);
      return;
    }

    // Get the current icon from the reel matrix to determine which win sprite to use
    const reelMatrix = GlobalState.getReelMatrix();
    if (!reelMatrix || !reelMatrix[row] || !reelMatrix[row][col]) {
      console.warn(`⚠️ Could not get icon from reel matrix at [${row}, ${col}]`);
      return;
    }

    const currentIconKey = reelMatrix[row][col];
    const currentIconName = slotIconMapping[currentIconKey];
    const winSpriteName = iconToWinSpriteMapping[currentIconName];

    if (!winSpriteName) {
      console.warn(`⚠️ No win sprite mapping found for ${currentIconName} (from ${currentIconKey})`);
      return;
    }

    // Check if it's already a sprite (avoid double conversion)
    if (currentIconName.includes('Win')) {
      console.log(`✅ Position [${row}, ${col}] already has win sprite`);
      return;
    }

    console.log(`🔄 Converting [${row}, ${col}] from ${currentIconName} to ${winSpriteName}`);

    // Get the reel column (first child of the container) to calculate proper positioning
    const reelColumn = reelColumnContainer.children[0];
    const ICON_HEIGHT = (reelColumn as any).height / ICONS_PER_REEL;

    // Create the animated sprite with proper sizing
    const winSprite = createSpriteFromLoadedAssets(winSpriteName, {
      width: ICON_HEIGHT * 1.05,
      height: ICON_HEIGHT * 1.05,
      anchor: 0.5,
      animationSpeed: 0.20,
      loop: true,
      autoplay: true
    });

    // Remove the old slot icon from the container
    reelColumnContainer.removeChild(slotIcon);

    // Create a new button with the animated sprite texture using the same positioning logic as original icons
    const newSlotIcon = createButton({
      x: (reelColumn as any).x,
      y: (reelColumn as any).y - (reelColumn as any).height/2 + (ICON_HEIGHT/2) + (ICON_HEIGHT * row),
      width: (reelColumn as any).width * 0.98,
      height: ICON_HEIGHT * 1.05,
      anchor: { x: 0.5, y: 0.5 },
      texture: winSprite,
      shadow: false,
      onClick: () => {
        console.log('Winning slot icon clicked');
      },
    });

    // Set the z-index to ensure it appears above other elements
    newSlotIcon.zIndex = 250; // Higher than regular icons (200)

    // Add the new slot icon to the container at the same index
    reelColumnContainer.addChildAt(newSlotIcon, slotIconIndex);

    // Update the icon position in GlobalState to match the new position
    GlobalState.setIconPosition(row, col, {
      x: newSlotIcon.x,
      y: newSlotIcon.y + newSlotIcon.height/1.8
    });

    console.log(`✅ Successfully converted position [${row}, ${col}] to animated sprite`);
    console.log(`   New position: (${newSlotIcon.x}, ${newSlotIcon.y})`);
  });
};

export const spinClickHandler = async (reelContainer: any, gameContainer: any, isAutoSpin: boolean = false): Promise<void> => {
  // Mark that a round is in progress
  GlobalState.setIsRoundInProgress(true);

  // Disable autoSpin when manual spin is started (but not when started by auto button)
  if (!isAutoSpin && GlobalState.getIsAutoSpin()) {
    console.log('🔄 Manual spin detected - disabling autoSpin');
    GlobalState.setIsAutoSpin(false);
  }

  return new Promise(async (resolve, reject) => {
    try {
      const paylineOptions = {
    color: 0x800080, // purple
    width: 3,
    alpha: 1,
    glow: true,
    glowBlur: 10,
    glowColor: 0xFF4444, // Lighter red glow
    pulse: true,
    pulseDuration: 1.0,
    pulseMinAlpha: 0.3,
    pulseMaxAlpha: 1.0,
    extensionLength: reelContainer.width * 0.05,
    // offset: 0 // Manual offset: no offset for first payline
  }

  const colors = [0xFF4444, 0x44FF44, 0x4444FF, 0xFF44FF, 0xFFFF00, 0xFF00FF];

  console.log('Spin button clicked - starting reel animation');
  // Disable all buttons during spin
  console.log('🔧 DEBUG: About to call startSpin()');
  startSpin();
  console.log('🔧 DEBUG: startSpin() called');

  // Clear previous paylines before starting new spin
  // console.log(`Before clearing: ${gameContainer.gameArea.children.length} children in gameArea`);
  clearPaylines(gameContainer.gameArea);
  // console.log(`After clearing: ${gameContainer.gameArea.children.length} children in gameArea`);

  // Stop any existing animation first
  stopReelAnimation({ reelContainer });

  // Start the animated reel spin with custom speed and duration
  animateReelSpin({
    reelContainer,
    duration: 1300,
    speed: 1.5 // 2.5x speed for faster spinning
  });

  // Call the websocket event for round start
  await sendRoundStartEvent();

  const multiplePaylinesParams = [];

  // Store final icons for each reel column (5 reels, 4 icons each)
  const finalIcons: string[][] = [];
  for (let col = 0; col < TOTAL_REELS; col++) {
    const columnIcons: string[] = [];
    for (let row = 0; row < ICONS_PER_REEL; row++) {
      console.log(GlobalState.getReelMatrix()[row][col], row, col, 'column icons');
      const icon = GlobalState.getReelMatrix()[row][col];
      columnIcons.push(slotIconMapping[icon]);
    }
    finalIcons.push(columnIcons);
  }

    // After animation completes, stop reels sequentially from left to right
    setTimeout(() => {
      try {
        console.log('Starting sequential reel stop - left to right');
        // Stop reels sequentially with custom bounce settings
        stopReelAnimationSequential({
          reelContainer,
          finalIcons,
          delayBetweenReels: 300,
          bounceHeight: 70,
          bounceDuration: 300,
          bounceDelay: 30
        });

        // After all reels have stopped (5 reels * 300ms delay = 1.5 seconds)
        setTimeout(() => {
          try {
            console.log('All reels stopped - checking for wins');

            // add paylines from payline matrix
            const paylineMatrices = GlobalState.getPaylineMatrices();
            for(let i = 0; i < paylineMatrices.length - 1; i++) {
              console.log(paylineMatrices[i], 'matrix payline');
              multiplePaylinesParams.push({positions:paylineMatrices[i], options: {...paylineOptions, color: colors[i%colors.length]}});
            }
            const payline = createMultiplePayline(multiplePaylinesParams);
            gameContainer.gameArea.addChild(payline);

            // Convert winning positions to animated sprites
            if (paylineMatrices.length > 0) {
              convertWinningPositionsToSprites(reelContainer, paylineMatrices);
            }

            // NOW trigger reward listeners after reels stopped and paylines are displayed
            console.log('🎉 All reels stopped and paylines displayed - triggering reward listeners');
            GlobalState.triggerRewardListeners();

            // SHow big win popup if reward greater than 5 times the bet amount
            const reward = GlobalState.getReward();
            const betAmount = GlobalState.getStakeAmount();
            if (reward > betAmount * 5) {
              console.log('🎉 Big win detected - showing popup');
              ShowWinPopup(gameContainer.container.width, gameContainer.container.height, gameContainer.container, WIN_POPUP_TYPES.BIG_WIN, { winAmount: reward });
            }

            // Re-enable all buttons after spin completes
            console.log('🔧 DEBUG: About to call endSpin()');
            endSpin();
            console.log('🔧 DEBUG: endSpin() called');

            // Mark that the round is complete
            GlobalState.setIsRoundInProgress(false);

            // Here you can add logic to:
            // 1. Check for winning combinations
            // 2. Show win popup if needed
            // 3. Update balance, etc.

            // Example: Show win popup (uncomment if needed)
            // const parentContainer = gameContainer.container || gameContainer;
            // ShowWinPopup(parentContainer, WIN_POPUP_TYPES.TOTAL_WIN, 100);

            // Resolve the promise to indicate the round is complete
            resolve();
          } catch (error) {
            console.error('Error in final spin completion:', error);
            GlobalState.setIsRoundInProgress(false);
            endSpin();
            reject(error);
          }
        }, 2000); // Wait for all reels to stop
      } catch (error) {
        console.error('Error in reel stop sequence:', error);
        GlobalState.setIsRoundInProgress(false);
        endSpin();
        reject(error);
      }
    }, 1000);

    } catch (error) {
      console.error('Error in spinClickHandler:', error);
      // Ensure round in progress flag is reset even on error
      GlobalState.setIsRoundInProgress(false);
      // Re-enable buttons on error
      endSpin();
      reject(error); // Reject the promise with the error
    }
  });
};