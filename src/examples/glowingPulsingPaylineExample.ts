import { Container } from 'pixi.js';
import { createPayline, createTestPayline } from '../components/commons/createPayline';

/**
 * Examples demonstrating the new glowing and pulsing payline effects
 */

// Example 1: Basic glowing payline
export const createGlowingPayline = (): Container => {
  const matrixPositions = [[0, 0], [1, 1], [2, 2]]; // Diagonal line
  
  return createPayline(matrixPositions, {
    color: 0xFFD700, // Gold
    width: 4,
    alpha: 0.9,
    glow: true,
    glowBlur: 8,
    glowColor: 0xFFD700 // Same as line color for consistent glow
  });
};

// Example 2: Pulsing payline without glow
export const createPulsingPayline = (): Container => {
  const matrixPositions = [[1, 0], [1, 1], [1, 2]]; // Horizontal line
  
  return createPayline(matrixPositions, {
    color: 0x00FF00, // Green
    width: 5,
    alpha: 1.0,
    pulse: true,
    pulseDuration: 1.2, // Slightly slower pulse
    pulseMinAlpha: 0.2,
    pulseMaxAlpha: 1.0
  });
};

// Example 3: Both glowing AND pulsing payline
export const createGlowingPulsingPayline = (): Container => {
  const matrixPositions = [[0, 0], [1, 1], [0, 2], [1, 3]]; // Zigzag pattern
  
  return createPayline(matrixPositions, {
    color: 0xFF6B35, // Orange-red
    width: 6,
    alpha: 0.8,
    glow: true,
    glowBlur: 12, // Stronger glow
    glowColor: 0xFF6B35,
    pulse: true,
    pulseDuration: 0.8, // Faster pulse
    pulseMinAlpha: 0.3,
    pulseMaxAlpha: 1.0
  });
};

// Example 4: Subtle glowing effect
export const createSubtleGlowPayline = (): Container => {
  const matrixPositions = [[2, 0], [2, 1], [2, 2]]; // Bottom row
  
  return createPayline(matrixPositions, {
    color: 0x9400D3, // Purple
    width: 3,
    alpha: 0.9,
    glow: true,
    glowBlur: 4, // Subtle glow
    glowColor: 0xDDA0DD // Light purple glow
  });
};

// Example 5: Dramatic pulsing effect
export const createDramaticPulsingPayline = (): Container => {
  const matrixPositions = [[0, 2], [1, 1], [2, 0]]; // Reverse diagonal
  
  return createPayline(matrixPositions, {
    color: 0xFF0000, // Red
    width: 8,
    alpha: 1.0,
    pulse: true,
    pulseDuration: 2.0, // Slow, dramatic pulse
    pulseMinAlpha: 0.1, // Almost invisible at minimum
    pulseMaxAlpha: 1.0
  });
};

// Example 6: Multi-colored glowing paylines
export const createMultiColorGlowingPaylines = (): Container => {
  const container = new Container();
  
  // Create multiple paylines with different colors and glow effects
  const paylineConfigs = [
    {
      positions: [[0, 0], [0, 1], [0, 2]], // Top row
      options: {
        color: 0xFF0000, // Red
        width: 4,
        glow: true,
        glowBlur: 6,
        glowColor: 0xFF4444, // Lighter red glow
        yOffset: -5
      }
    },
    {
      positions: [[1, 0], [1, 1], [1, 2]], // Middle row
      options: {
        color: 0x00FF00, // Green
        width: 4,
        glow: true,
        glowBlur: 6,
        glowColor: 0x44FF44, // Lighter green glow
        yOffset: 0
      }
    },
    {
      positions: [[2, 0], [2, 1], [2, 2]], // Bottom row
      options: {
        color: 0x0000FF, // Blue
        width: 4,
        glow: true,
        glowBlur: 6,
        glowColor: 0x4444FF, // Lighter blue glow
        yOffset: 5
      }
    }
  ];
  
  paylineConfigs.forEach(config => {
    const payline = createPayline(config.positions, config.options);
    container.addChild(payline);
  });
  
  return container;
};

// Example 7: Test payline with enhanced effects (uses hardcoded coordinates)
export const createEnhancedTestPayline = (): Container => {
  return createTestPayline({
    color: 0xFFD700, // Gold
    width: 6,
    alpha: 1.0,
    glow: true,
    glowBlur: 15, // Strong glow
    glowColor: 0xFFA500, // Orange glow
    pulse: true,
    pulseDuration: 1.0,
    pulseMinAlpha: 0.4,
    pulseMaxAlpha: 1.0
  });
};

// Example 8: How to add enhanced paylines to a game container
export const addEnhancedPaylinesToGame = (gameContainer: Container): void => {
  // Add a glowing pulsing payline
  const enhancedPayline = createGlowingPulsingPayline();
  gameContainer.addChild(enhancedPayline);
  
  console.log('✨ Added enhanced payline with glow and pulse effects');
  
  // You can still clear paylines the same way as before
  // clearPaylines(gameContainer); // This would remove all paylines
};

/**
 * Usage Tips:
 * 
 * 1. Glow Effects:
 *    - Use `glow: true` to enable glowing
 *    - Adjust `glowBlur` (4-15) for intensity
 *    - Set `glowColor` to complement your line color
 * 
 * 2. Pulse Effects:
 *    - Use `pulse: true` to enable pulsing
 *    - Adjust `pulseDuration` for speed (0.5-3.0 seconds)
 *    - Set `pulseMinAlpha` and `pulseMaxAlpha` for intensity range
 * 
 * 3. Performance:
 *    - Glow effects use additional graphics objects and filters
 *    - Pulse effects use GSAP animations
 *    - Use sparingly for best performance
 * 
 * 4. Combining Effects:
 *    - You can use both glow and pulse together
 *    - The pulse animation affects the entire payline container
 *    - Glow is rendered behind the main line
 */
