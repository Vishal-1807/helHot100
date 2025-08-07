import { Container, Graphics, BlurFilter } from 'pixi.js';
import { gsap } from 'gsap';
import { GlobalState } from '../../globals/gameState';
import { Z_INDEX } from '../constants/ZIndex';

interface PaylineOptions {
  color?: number;
  width?: number;
  alpha?: number;
  zIndex?: number;
  yOffset?: number; // Y offset for multiple paylines
  glow?: boolean; // Enable glow effect
  glowBlur?: number; // Glow blur intensity (default: 8)
  glowColor?: number; // Glow color (defaults to line color)
  pulse?: boolean; // Enable pulsing animation
  pulseDuration?: number; // Pulse animation duration in seconds (default: 1)
  pulseMinAlpha?: number; // Minimum alpha during pulse (default: 0.3)
  pulseMaxAlpha?: number; // Maximum alpha during pulse (default: 1)
  extensionLength?: number; // Extension length for the line (default: 30)
}

/**
 * Creates a payline connecting the specified matrix positions
 * @param matrixPositions Array of [row, col] positions to connect
 * @param options Optional styling options for the line
 * @returns Container with the payline graphics
 *
 * Z-Index Hierarchy:
 * - Icons: 200
 * - Paylines: 250 (this function)
 * - UI Buttons: 400
 * - Popups: 1000+ (always appear above paylines)
 */
export const createPayline = (
  matrixPositions: number[][],
  options: PaylineOptions = {}
): Container => {
  const {
    color = 0xFFD700, // Gold color by default
    width = 4,
    alpha = 0.8,
    zIndex = Z_INDEX.PAYLINES, // Higher than icons but lower than popups
    yOffset = 0, // Default no offset
    glow = false, // Enable glow effect
    glowBlur = 8, // Glow blur intensity
    glowColor = color, // Glow color defaults to line color
    pulse = false, // Enable pulsing animation
    pulseDuration = 1, // Pulse duration in seconds
    pulseMinAlpha = 0.3, // Minimum alpha during pulse
    pulseMaxAlpha = 1, // Maximum alpha during pulse
    extensionLength = 50, // Extension length for the line (default: 30)
  } = options;

  // Create container for the payline
  const paylineContainer = new Container();
  paylineContainer.zIndex = zIndex;
  paylineContainer.alpha = alpha;

  // Get icon positions from GlobalState
  const iconPositions = GlobalState.getIconPosition();

  // Debug logging
  console.log('🔍 Payline Debug Info:');
  console.log('  - Matrix positions:', matrixPositions);
  console.log('  - Icon positions array:', iconPositions);
  console.log('  - Icon positions length:', iconPositions.length);

  // Validate that we have positions and they exist in the iconPositions array
  if (!iconPositions || iconPositions.length === 0) {
    console.warn('⚠️ No icon positions available yet. Make sure icons are created before adding paylines.');
    return paylineContainer;
  }

  if (matrixPositions.length < 2) {
    console.warn('⚠️ Need at least 2 positions to create a payline');
    return paylineContainer;
  }

  // Convert matrix positions to actual x,y coordinates
  const coordinates: { x: number; y: number }[] = [];

  for (const [row, col] of matrixPositions) {
    if (iconPositions[row] && iconPositions[row][col]) {
      // Apply Y offset to create multiple distinct paylines
      const adjustedPosition = {
        x: iconPositions[row][col].x,
        y: iconPositions[row][col].y + yOffset
      };
      coordinates.push(adjustedPosition);
      console.log(`  - Found position [${row}, ${col}] at (${adjustedPosition.x}, ${adjustedPosition.y}) with offset ${yOffset}`);
    } else {
      console.warn(`⚠️ Icon position not found for [${row}, ${col}]. Available rows: ${iconPositions.length}`);
      if (iconPositions[row]) {
        console.warn(`    Row ${row} has ${iconPositions[row].length} columns`);
      }
      return paylineContainer; // Return empty container if any position is invalid
    }
  }

  // Create the line graphics
  const lineGraphics = new Graphics();

  // Draw the line connecting all points
  if (coordinates.length > 0) {
    console.log(`  - Drawing line with ${coordinates.length} points:`);

    // Calculate extension length (you can adjust this value as needed)
    const extendLength = extensionLength; // pixels to extend the line

    // Start with extension to the left of the first point
    const firstPoint = coordinates[0];
    const extendedStartX = firstPoint.x - extendLength;
    lineGraphics.moveTo(extendedStartX, firstPoint.y);
    console.log(`    - Start with left extension at (${extendedStartX}, ${firstPoint.y})`);

    // Draw line to the actual first point
    lineGraphics.lineTo(firstPoint.x, firstPoint.y);
    console.log(`    - Line to first point (${firstPoint.x}, ${firstPoint.y})`);

    // Draw lines to subsequent points
    for (let i = 1; i < coordinates.length; i++) {
      lineGraphics.lineTo(coordinates[i].x, coordinates[i].y);
      console.log(`    - Line to (${coordinates[i].x}, ${coordinates[i].y})`);
    }

    // Extend to the right of the last point
    const lastPoint = coordinates[coordinates.length - 1];
    const extendedEndX = lastPoint.x + extendLength;
    lineGraphics.lineTo(extendedEndX, lastPoint.y);
    console.log(`    - End with right extension at (${extendedEndX}, ${lastPoint.y})`);

    // Apply the stroke style after drawing the path
    lineGraphics.stroke({ color, width });
  }

  // Add the line graphics to the container
  paylineContainer.addChild(lineGraphics);

  // Apply glow effect if enabled
  if (glow) {
    const glowFilter = new BlurFilter();
    glowFilter.blur = glowBlur;

    // Create a duplicate line for the glow effect
    const glowGraphics = new Graphics();

    if (coordinates.length > 0) {
      // Calculate extension length (same as main line)
      const extensionLength = 30; // pixels to extend the line

      // Start with extension to the left of the first point
      const firstPoint = coordinates[0];
      const extendedStartX = firstPoint.x - extensionLength;
      glowGraphics.moveTo(extendedStartX, firstPoint.y);

      // Draw line to the actual first point
      glowGraphics.lineTo(firstPoint.x, firstPoint.y);

      // Draw lines to subsequent points
      for (let i = 1; i < coordinates.length; i++) {
        glowGraphics.lineTo(coordinates[i].x, coordinates[i].y);
      }

      // Extend to the right of the last point
      const lastPoint = coordinates[coordinates.length - 1];
      const extendedEndX = lastPoint.x + extensionLength;
      glowGraphics.lineTo(extendedEndX, lastPoint.y);

      glowGraphics.stroke({ color: glowColor, width: width * 2 }); // Wider for glow
    }

    glowGraphics.filters = [glowFilter];
    glowGraphics.alpha = 0.6; // Semi-transparent glow

    // Add glow behind the main line
    paylineContainer.addChildAt(glowGraphics, 0);

    console.log(`✨ Added glow effect with blur: ${glowBlur}, color: ${glowColor.toString(16)}`);
  }

  // Apply pulsing animation if enabled
  if (pulse) {
    // Create pulsing animation using GSAP
    gsap.to(paylineContainer, {
      alpha: pulseMinAlpha,
      duration: pulseDuration / 2,
      yoyo: true,
      repeat: -1,
      ease: "power2.inOut"
    });

    console.log(`✨ Added pulse animation: duration ${pulseDuration}s, alpha ${pulseMinAlpha}-${pulseMaxAlpha}`);
  }

  // Debug the final container
  console.log(`✨ Created payline:`, {
    positions: matrixPositions.length,
    zIndex: zIndex,
    color: color.toString(16),
    width: width,
    alpha: alpha,
    glow: glow,
    pulse: pulse,
    containerBounds: paylineContainer.getBounds(),
    lineGraphicsBounds: lineGraphics.getBounds()
  });

  return paylineContainer;
};

/**
 * Creates multiple paylines with sequential Y offset
 * Each subsequent payline gets a small incremental offset unless manually specified
 * @param paylines Array of payline configurations
 * @param offsetStep Small offset increment for each payline (default: 3px)
 * @returns Container with all paylines
 */
export const createMultiplePayline = (
  paylines: { positions: number[][], options?: PaylineOptions & { offset?: number } }[],
  offsetStep: number = 3
): Container => {
  const multiPaylineContainer = new Container();
  multiPaylineContainer.sortableChildren = true;

  paylines.forEach((payline, index) => {
    // Use manual offset if provided, otherwise calculate sequential offset
    const manualOffset = payline.options?.offset;
    const sequentialOffset = index * offsetStep;
    const yOffset = manualOffset !== undefined ? manualOffset : sequentialOffset;

    // Merge the calculated offset with existing options (excluding the offset property)
    const { offset, ...otherOptions } = payline.options || {};
    const paylineOptions = {
      ...otherOptions,
      yOffset: payline.options?.yOffset ?? yOffset
    };

    const paylineContainer = createPayline(payline.positions, paylineOptions);
    multiPaylineContainer.addChild(paylineContainer);
  });

  console.log(`✨ Created ${paylines.length} paylines with Y offsets (step: ${offsetStep}px)`);

  return multiPaylineContainer;
};

/**
 * Creates multiple paylines with evenly distributed Y offsets
 * @param paylineConfigs Array of payline configurations
 * @param iconHeight Height of icons to distribute within
 * @returns Container with all paylines
 */
export const createDistributedPaylines = (
  paylineConfigs: { positions: number[][], color?: number, width?: number, alpha?: number }[],
  iconHeight: number = 40
): Container => {
  const paylines = paylineConfigs.map((config) => ({
    positions: config.positions,
    options: {
      color: config.color,
      width: config.width,
      alpha: config.alpha
    }
  }));

  return createMultiplePayline(paylines, iconHeight);
};

/**
 * Utility function to remove all paylines from a container
 * @param container The container to remove paylines from
 */
export const clearPaylines = (container: Container): void => {
  // Remove all children that have zIndex >= PAYLINES (paylines)
  const childrenToRemove = container.children.filter(child => child.zIndex >= Z_INDEX.PAYLINES);
  childrenToRemove.forEach(child => {
    container.removeChild(child);
    child.destroy();
  });

  console.log(`🧹 Cleared ${childrenToRemove.length} paylines`);
};

/**
 * Debug function to check if icon positions are available
 * Call this before trying to create paylines
 */
export const debugIconPositions = (): void => {
  const iconPositions = GlobalState.getIconPosition();
  console.log('🔍 Icon Positions Debug:');
  console.log('  - Icon positions array:', iconPositions);
  console.log('  - Array length:', iconPositions.length);

  if (iconPositions.length > 0) {
    for (let row = 0; row < iconPositions.length; row++) {
      if (iconPositions[row]) {
        console.log(`  - Row ${row}: ${iconPositions[row].length} columns`);
        for (let col = 0; col < iconPositions[row].length; col++) {
          if (iconPositions[row][col]) {
            console.log(`    - [${row}, ${col}]: (${iconPositions[row][col].x}, ${iconPositions[row][col].y})`);
          }
        }
      }
    }
  } else {
    console.warn('  - No icon positions found! Icons may not be created yet.');
  }
};

/**
 * Creates a simple test payline with fallback coordinates if icon positions aren't available
 * Useful for testing the payline rendering without depending on icon positions
 */
export const createTestPayline = (options: PaylineOptions = {}): Container => {
  const {
    color = 0xFF0000, // Red for visibility
    width = 8,
    alpha = 1.0,
    zIndex = Z_INDEX.PAYLINES,
    glow = true, // Enable glow by default for test
    glowBlur = 10,
    glowColor = color,
    pulse = true, // Enable pulse by default for test
    pulseDuration = 1.5,
    pulseMinAlpha = 0.4,
    pulseMaxAlpha = 1
  } = options;

  const paylineContainer = new Container();
  paylineContainer.zIndex = zIndex;
  paylineContainer.alpha = alpha;

  const lineGraphics = new Graphics();

  // Use hardcoded test coordinates
  const testCoordinates = [
    { x: 100, y: 100 },
    { x: 200, y: 150 },
    { x: 300, y: 200 }
  ];

  console.log('🧪 Creating test payline with hardcoded coordinates:', testCoordinates);

  // Calculate extension length (same as main function)
  const extensionLength = 30; // pixels to extend the line

  // Draw the test line with extensions
  const firstPoint = testCoordinates[0];
  const extendedStartX = firstPoint.x - extensionLength;
  lineGraphics.moveTo(extendedStartX, firstPoint.y);

  // Draw line to the actual first point
  lineGraphics.lineTo(firstPoint.x, firstPoint.y);

  // Draw lines to subsequent points
  for (let i = 1; i < testCoordinates.length; i++) {
    lineGraphics.lineTo(testCoordinates[i].x, testCoordinates[i].y);
  }

  // Extend to the right of the last point
  const lastPoint = testCoordinates[testCoordinates.length - 1];
  const extendedEndX = lastPoint.x + extensionLength;
  lineGraphics.lineTo(extendedEndX, lastPoint.y);

  // Apply the stroke style after drawing the path
  lineGraphics.stroke({ color, width });

  paylineContainer.addChild(lineGraphics);

  // Apply glow effect if enabled
  if (glow) {
    const glowFilter = new BlurFilter();
    glowFilter.blur = glowBlur;

    // Create a duplicate line for the glow effect with extensions
    const glowGraphics = new Graphics();

    // Calculate extension length (same as main line)
    const extensionLength = 30; // pixels to extend the line

    const firstPoint = testCoordinates[0];
    const extendedStartX = firstPoint.x - extensionLength;
    glowGraphics.moveTo(extendedStartX, firstPoint.y);

    // Draw line to the actual first point
    glowGraphics.lineTo(firstPoint.x, firstPoint.y);

    // Draw lines to subsequent points
    for (let i = 1; i < testCoordinates.length; i++) {
      glowGraphics.lineTo(testCoordinates[i].x, testCoordinates[i].y);
    }

    // Extend to the right of the last point
    const lastPoint = testCoordinates[testCoordinates.length - 1];
    const extendedEndX = lastPoint.x + extensionLength;
    glowGraphics.lineTo(extendedEndX, lastPoint.y);

    glowGraphics.stroke({ color: glowColor, width: width * 2 }); // Wider for glow

    glowGraphics.filters = [glowFilter];
    glowGraphics.alpha = 0.6; // Semi-transparent glow

    // Add glow behind the main line
    paylineContainer.addChildAt(glowGraphics, 0);

    console.log(`🧪 Added glow effect to test payline: blur ${glowBlur}, color ${glowColor.toString(16)}`);
  }

  // Apply pulsing animation if enabled
  if (pulse) {
    // Create pulsing animation using GSAP
    gsap.to(paylineContainer, {
      alpha: pulseMinAlpha,
      duration: pulseDuration / 2,
      yoyo: true,
      repeat: -1,
      ease: "power2.inOut"
    });

    console.log(`🧪 Added pulse animation to test payline: duration ${pulseDuration}s, alpha ${pulseMinAlpha}-${pulseMaxAlpha}`);
  }

  console.log('✅ Test payline created:', {
    zIndex: zIndex,
    glow: glow,
    pulse: pulse,
    bounds: paylineContainer.getBounds()
  });

  return paylineContainer;
};

export default createPayline;