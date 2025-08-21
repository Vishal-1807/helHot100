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



/**
 * Parses WinCombo string and processes existing payline matrices
 * Format: "LINE14_CHERRY_3:LINE88_CHERRY_3:LINE0_SCATTER_8:"
 *
 * Rules:
 * - Each WinCombo entry corresponds to paylineMatrices row-wise (in order)
 * - LINEX number doesn't matter - it's just from backend
 * - For all paylines except the last: use only the first "count" positions
 * - For the last payline: use ALL positions (typically for scatter)
 *
 * @param winCombo - The WinCombo string from the server
 * @returns Array of processed payline matrices for rendering
 */
const parseWinCombo = (winCombo: string): number[][][] => {
  console.log('🎯 Parsing WinCombo:', winCombo);

  if (!winCombo || winCombo.trim() === '') {
    console.log('📝 No WinCombo provided, returning empty paylines');
    return [];
  }

  // Get existing payline matrices from GlobalState
  const existingPaylineMatrices = GlobalState.getPaylineMatrices();
  console.log('📊 Existing payline matrices:', existingPaylineMatrices);

  // Split by colon and filter out empty entries
  const paylineEntries = winCombo.split(':').filter(entry => entry.trim() !== '');

  if (paylineEntries.length === 0) {
    console.log('📝 No valid payline entries found');
    return [];
  }

  if (paylineEntries.length > existingPaylineMatrices.length) {
    console.warn(`⚠️ WinCombo has ${paylineEntries.length} entries but only ${existingPaylineMatrices.length} payline matrices available`);
  }

  const processedPaylineMatrices: number[][][] = [];

  paylineEntries.forEach((entry, index) => {
    console.log(`🔍 Processing payline entry ${index + 1}/${paylineEntries.length}: "${entry}"`);

    // Check if we have a corresponding payline matrix
    if (index >= existingPaylineMatrices.length) {
      console.warn(`⚠️ No payline matrix available for entry ${index + 1}: "${entry}"`);
      return;
    }

    // Parse the entry format: LINEX_ICON_COUNT
    const parts = entry.split('_');
    if (parts.length < 3) {
      console.warn(`⚠️ Invalid payline entry format: "${entry}". Expected format: LINEX_ICON_COUNT`);
      return;
    }

    const lineNumberStr = parts[0].replace('LINE', ''); // This doesn't matter, just for logging
    const iconType = parts[1];
    const countStr = parts[2];

    const count = parseInt(countStr, 10);

    if (isNaN(count)) {
      console.warn(`⚠️ Invalid count in payline entry: "${entry}". Count: ${countStr}`);
      return;
    }

    // Get the corresponding payline matrix (row-wise)
    const paylineMatrix = existingPaylineMatrices[index];
    console.log(`📍 Using payline matrix ${index} (LINE${lineNumberStr}):`, paylineMatrix);

    // Determine if this is the last payline entry
    const isLastPayline = index === paylineEntries.length - 1;

    let paylinePositions: number[][];

    if (isLastPayline) {
      // For the last payline (typically scatter), use all positions
      paylinePositions = [...paylineMatrix];
      console.log(`🎲 Last payline (${iconType}): Using all ${paylinePositions.length} positions`);
    } else {
      // For other paylines, use only the first "count" positions
      paylinePositions = paylineMatrix.slice(0, count);
      console.log(`🎯 Regular payline (${iconType}): Using first ${count} positions out of ${paylineMatrix.length}`);
    }

    if (paylinePositions.length > 0) {
      processedPaylineMatrices.push(paylinePositions);
      console.log(`✅ Added processed payline matrix:`, paylinePositions);
    } else {
      console.warn(`⚠️ No positions to add for payline entry: "${entry}"`);
    }
  });

  console.log(`🎰 Final processed payline matrices (${processedPaylineMatrices.length} paylines):`, processedPaylineMatrices);
  return processedPaylineMatrices;
};

/**
 * Test function to demonstrate WinCombo parsing with existing payline matrices
 * You can call this function to test different WinCombo formats
 */
export const testWinComboParsing = () => {
  console.log('🧪 Testing WinCombo parsing...');

  // First, set up some test payline matrices in GlobalState
  const testPaylineMatrices = [
    [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], // Top row
    [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]], // Middle row
    [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]], // Bottom row
    [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]], // V-shape
  ];

  console.log('📊 Setting up test payline matrices:', testPaylineMatrices);
  GlobalState.setPaylineMatrices(testPaylineMatrices);

  // Test case 1: Your example
  const testWinCombo1 = "LINE14_CHERRY_3:LINE88_CHERRY_3:LINE0_SCATTER_8:";
  console.log('\n📋 Test 1 - Your example:');
  console.log('Input WinCombo:', testWinCombo1);
  console.log('Expected behavior:');
  console.log('- Entry 1 (LINE14_CHERRY_3): Use first 3 positions from paylineMatrices[0]');
  console.log('- Entry 2 (LINE88_CHERRY_3): Use first 3 positions from paylineMatrices[1]');
  console.log('- Entry 3 (LINE0_SCATTER_8): Use ALL positions from paylineMatrices[2] (last entry)');
  const result1 = parseWinCombo(testWinCombo1);
  console.log('Final result:', result1);

  // Test case 2: Multiple regular paylines
  const testWinCombo2 = "LINE1_SEVEN_5:LINE3_WATERMELON_4:";
  console.log('\n📋 Test 2 - Multiple regular paylines:');
  console.log('Input WinCombo:', testWinCombo2);
  console.log('Expected behavior:');
  console.log('- Entry 1 (LINE1_SEVEN_5): Use first 5 positions from paylineMatrices[0]');
  console.log('- Entry 2 (LINE3_WATERMELON_4): Use ALL positions from paylineMatrices[1] (last entry)');
  const result2 = parseWinCombo(testWinCombo2);
  console.log('Final result:', result2);

  console.log('🧪 WinCombo parsing tests completed!');
};

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
    speed: 0.4 // 2.5x speed for faster spinning
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
        setTimeout(async () => {
          try {
            console.log('All reels stopped - checking for wins');

            // Get existing payline matrices and WinCombo
            const existingPaylineMatrices = GlobalState.getPaylineMatrices() || [];
            const winCombo = GlobalState.getWinCombo();

            console.log('📊 Existing payline matrices:', existingPaylineMatrices);
            console.log('🎯 WinCombo from server:', winCombo);

            let processedPaylineMatrices: number[][][] = []; // For sprite conversion (with count logic)
            let paylinesToShow: number[][][] = []; // For payline display (entire lines)

            if (winCombo && winCombo.trim() !== '') {
              // Parse WinCombo to get processed matrices (for sprite conversion with count logic)
              processedPaylineMatrices = parseWinCombo(winCombo) || [];
              console.log('✅ Processed payline matrices from WinCombo (for sprites):', processedPaylineMatrices);

              // For showing paylines, use the ENTIRE corresponding payline matrices
              const winComboEntries = winCombo.split(':').filter(entry => entry.trim() !== '');
              paylinesToShow = winComboEntries.map((_, index) => {
                if (index < existingPaylineMatrices.length) {
                  console.log(`🎨 Using entire payline matrix ${index} for display:`, existingPaylineMatrices[index]);
                  return existingPaylineMatrices[index]; // Use entire payline for display
                }
                return [];
              }).filter(payline => payline.length > 0);

              console.log('🎨 Paylines to show (entire lines):', paylinesToShow);
            } else if (existingPaylineMatrices.length > 0) {
              // Fallback to existing payline matrices if no WinCombo
              processedPaylineMatrices = existingPaylineMatrices;
              paylinesToShow = existingPaylineMatrices;
              console.log('📝 Using existing payline matrices (no WinCombo)');
            }

            // Create paylines for display using ENTIRE payline matrices
            for(let i = 0; i < paylinesToShow.length; i++) {
              console.log(paylinesToShow[i], 'entire payline matrix for display');
              multiplePaylinesParams.push({positions:paylinesToShow[i], options: {...paylineOptions, color: colors[i%colors.length]}});
            }
            console.log(winCombo, 'multiple winCombo')
            console.log(multiplePaylinesParams, 'multiple paylines params')

            if (multiplePaylinesParams.length > 0) {
              const payline = createMultiplePayline(multiplePaylinesParams);
              gameContainer.gameArea.addChild(payline);
              console.log(`🎨 Created ${multiplePaylinesParams.length} paylines for rendering`);
            } else {
              console.log('📝 No paylines to render');
            }

            // Convert winning positions to animated sprites using PROCESSED matrices (with count logic)
            if (processedPaylineMatrices.length > 0) {
              console.log('🎰 Converting winning positions from processed paylines (count logic applied)');
              convertWinningPositionsToSprites(reelContainer, processedPaylineMatrices);
            } else {
              console.log('📝 No winning paylines to convert to sprites');
            }

            // NOW trigger reward listeners after reels stopped and paylines are displayed
            console.log('🎉 All reels stopped and paylines displayed - triggering reward listeners');
            GlobalState.triggerRewardListeners();

            // SHow big win popup if reward greater than 5 times the bet amount
            const reward = GlobalState.getReward();
            const betAmount = GlobalState.getStakeAmount();
            if (reward > betAmount * 5) {
              console.log('🎉 Big win detected - showing popup');
              await ShowWinPopup(gameContainer.container.width, gameContainer.container.height, gameContainer.container, WIN_POPUP_TYPES.BIG_WIN, {
                winAmount: reward,
                isAutoSpin: isAutoSpin,
                textStyle: {
                  fontFamily: 'Arial Black',
                  fontSize: 36,
                  fill: 0xFFD700, // Yellow/Gold color
                  fontWeight: 'bold',
                  stroke: 0x000000, // Black outline for better visibility
                  strokeThickness: 2
                } as any,
                spriteOptions: {
                  animationSpeed: 0.6, // Slightly faster animation for excitement
                  loop: true,
                  autoplay: true
                }
              });
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