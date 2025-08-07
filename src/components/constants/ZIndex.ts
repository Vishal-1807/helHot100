/**
 * Z-Index constants for proper layering of game elements
 * Higher values appear on top of lower values
 */

export const Z_INDEX = {
  // Background elements (lowest layer)
  BACKGROUND: 0,
  GAME_BOARD: 10,
  
  // Game elements
  ICONS: 200,
  PAYLINES: 250,
  PARTICLES: 300,
  
  // UI elements
  BUTTONS: 400,
  TABS: 450,
  
  // Overlays and popups (highest layer)
  POPUP_OVERLAY: 1000,
  POPUP_CONTENT: 1100,
  MODAL_OVERLAY: 1200,
  MODAL_CONTENT: 1300,
  
  // System notifications (top layer)
  NOTIFICATIONS: 2000,
  DEBUG_OVERLAY: 9999
} as const;

/**
 * Helper function to get z-index for specific element types
 */
export const getZIndex = (elementType: keyof typeof Z_INDEX): number => {
  return Z_INDEX[elementType];
};

/**
 * Helper function to ensure an element appears above another
 */
export const getZIndexAbove = (baseZIndex: number, offset: number = 1): number => {
  return baseZIndex + offset;
};

/**
 * Helper function to ensure an element appears below another
 */
export const getZIndexBelow = (baseZIndex: number, offset: number = 1): number => {
  return Math.max(0, baseZIndex - offset);
};
