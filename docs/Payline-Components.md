# Payline Components

The Payline Components are specialized visual connection systems for Pixi.js slot game applications. They create dynamic lines connecting matrix positions with advanced styling options, animations, and multi-payline support, making them perfect for slot games, grid-based games, and any application requiring visual connections between grid positions.

## Features

- Visual connections between matrix positions (grid coordinates)
- Advanced styling with colors, thickness, opacity, and glow effects
- Pulse animations with customizable timing and intensity
- Multi-payline support with automatic Y-offset distribution
- Proper Z-index management for layering with game elements
- Fallback coordinate system for testing without icon positions
- Flexible positioning system that adapts to icon layouts
- Performance-optimized rendering with PIXI Graphics
- Comprehensive logging for debugging and development

## Installation

Ensure you have Pixi.js installed in your project and proper Z-index constants defined.

## Usage

The Payline system provides multiple functions for different use cases: single paylines, multiple paylines, distributed paylines, and test paylines.

```jsx
import { 
  createPayline, 
  createMultiplePayline, 
  createDistributedPaylines,
  createTestPayline 
} from './path/to/createPayline.js';
```

### Basic Example - Single Payline

Create a simple payline connecting three positions:

```jsx
import * as PIXI from 'pixi.js';
import { createPayline } from './createPayline.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Define matrix positions to connect (row, column)
const positions = [
  [0, 0], // Top-left
  [1, 1], // Middle-center
  [2, 2]  // Bottom-right
];

// Create a basic payline
const payline = createPayline(positions, {
  color: 0xFFD700, // Gold color
  width: 4,
  alpha: 0.8
});

// Add payline to stage
app.stage.addChild(payline);
```

### Advanced Example with Glow and Pulse Effects

Create a payline with visual effects:

```jsx
import * as PIXI from 'pixi.js';
import { createPayline } from './createPayline.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Define winning line positions
const winningLine = [
  [0, 0], [0, 1], [0, 2], [0, 3], [0, 4] // Top row
];

// Create animated payline with effects
const animatedPayline = createPayline(winningLine, {
  color: 0xFF0000,        // Red color
  width: 6,               // Thicker line
  alpha: 1.0,             // Full opacity
  glow: true,             // Enable glow effect
  glowBlur: 12,           // Glow intensity
  glowColor: 0xFF4444,    // Lighter red glow
  pulse: true,            // Enable pulse animation
  pulseDuration: 1.5,     // 1.5 second pulse cycle
  pulseMinAlpha: 0.4,     // Minimum opacity during pulse
  pulseMaxAlpha: 1.0      // Maximum opacity during pulse
});

// Add to stage
app.stage.addChild(animatedPayline);

// Remove payline after 5 seconds
setTimeout(() => {
  app.stage.removeChild(animatedPayline);
  animatedPayline.destroy({ children: true });
}, 5000);
```

### Multiple Paylines Example

Create multiple paylines with automatic distribution:

```jsx
import * as PIXI from 'pixi.js';
import { createMultiplePayline } from './createPayline.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Define multiple payline configurations
const paylineConfigs = [
  {
    positions: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], // Top row
    options: { color: 0xFF0000, width: 4 }
  },
  {
    positions: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]], // Middle row
    options: { color: 0x00FF00, width: 4 }
  },
  {
    positions: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]], // Bottom row
    options: { color: 0x0000FF, width: 4 }
  },
  {
    positions: [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]], // Zigzag pattern
    options: { color: 0xFFD700, width: 5, glow: true }
  }
];

// Create multiple paylines with distribution
const multiPaylines = createMultiplePayline(paylineConfigs, 40); // 40px icon height

// Add to stage
app.stage.addChild(multiPaylines);
```

### Simplified Multiple Paylines

Use the simplified API for quick multiple payline creation:

```jsx
import * as PIXI from 'pixi.js';
import { createDistributedPaylines } from './createPayline.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Simplified payline configurations
const paylineConfigs = [
  { 
    positions: [[0, 0], [0, 1], [0, 2]], 
    color: 0xFF0000, 
    width: 4, 
    alpha: 0.9 
  },
  { 
    positions: [[1, 0], [1, 1], [1, 2]], 
    color: 0x00FF00, 
    width: 4, 
    alpha: 0.9 
  },
  { 
    positions: [[2, 0], [2, 1], [2, 2]], 
    color: 0x0000FF, 
    width: 4, 
    alpha: 0.9 
  }
];

// Create distributed paylines
const distributedPaylines = createDistributedPaylines(paylineConfigs, 50);

// Add to stage
app.stage.addChild(distributedPaylines);
```

### Test Payline for Development

Create test paylines for development and debugging:

```jsx
import * as PIXI from 'pixi.js';
import { createTestPayline } from './createPayline.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Create test payline with fallback coordinates
const testPayline = createTestPayline({
  color: 0xFF00FF,        // Magenta for visibility
  width: 8,               // Thick line for testing
  alpha: 1.0,             // Full opacity
  glow: true,             // Enable glow
  glowBlur: 15,           // Strong glow
  pulse: true,            // Enable pulse
  pulseDuration: 1.0      // Fast pulse for testing
});

// Add to stage
app.stage.addChild(testPayline);

console.log('Test payline created for development');
```

### Dynamic Payline System

Create a system for showing paylines based on game state:

```jsx
import * as PIXI from 'pixi.js';
import { createPayline } from './createPayline.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

class PaylineManager {
  constructor(stage) {
    this.stage = stage;
    this.activePaylines = [];
    this.paylineDefinitions = [
      { id: 1, positions: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], color: 0xFF0000 },
      { id: 2, positions: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]], color: 0x00FF00 },
      { id: 3, positions: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]], color: 0x0000FF },
      { id: 4, positions: [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]], color: 0xFFD700 }
    ];
  }
  
  showPayline(paylineId, animated = true) {
    const definition = this.paylineDefinitions.find(p => p.id === paylineId);
    if (!definition) return;
    
    const options = {
      color: definition.color,
      width: 5,
      alpha: animated ? 0 : 0.8,
      glow: true,
      pulse: animated
    };
    
    const payline = createPayline(definition.positions, options);
    
    // Fade in animation if requested
    if (animated) {
      let alpha = 0;
      const fadeIn = () => {
        alpha += 0.05;
        payline.alpha = Math.min(alpha, 0.8);
        if (alpha < 0.8) {
          requestAnimationFrame(fadeIn);
        }
      };
      fadeIn();
    }
    
    this.activePaylines.push({ id: paylineId, container: payline });
    this.stage.addChild(payline);
    
    return payline;
  }
  
  hidePayline(paylineId) {
    const index = this.activePaylines.findIndex(p => p.id === paylineId);
    if (index > -1) {
      const payline = this.activePaylines[index];
      this.stage.removeChild(payline.container);
      payline.container.destroy({ children: true });
      this.activePaylines.splice(index, 1);
    }
  }
  
  hideAllPaylines() {
    this.activePaylines.forEach(payline => {
      this.stage.removeChild(payline.container);
      payline.container.destroy({ children: true });
    });
    this.activePaylines = [];
  }
  
  showWinningPaylines(paylineIds) {
    this.hideAllPaylines();
    paylineIds.forEach((id, index) => {
      setTimeout(() => {
        this.showPayline(id, true);
      }, index * 200); // Stagger the animations
    });
  }
}

// Usage
const paylineManager = new PaylineManager(app.stage);

// Show winning paylines
setTimeout(() => {
  paylineManager.showWinningPaylines([1, 3, 4]);
}, 1000);

// Hide all after 5 seconds
setTimeout(() => {
  paylineManager.hideAllPaylines();
}, 6000);
```

# API Reference

## createPayline(matrixPositions: number[][], options?: PaylineOptions): PIXI.Container

Creates a single payline connecting the specified matrix positions.

Parameters

- matrixPositions (Array): Array of [row, col] position arrays to connect.
- options (Object, optional): Styling and animation options. See Configuration Options for details.

Returns

- PIXI.Container: Container with the payline graphics and animations.

```jsx
const payline = createPayline([[0, 0], [1, 1], [2, 2]], {
  color: 0xFF0000,
  width: 5,
  glow: true
});
app.stage.addChild(payline);
```

## createMultiplePayline(paylines: PaylineConfig[], iconHeight?: number): PIXI.Container

Creates multiple paylines with automatic Y-offset distribution to prevent overlap.

Parameters

- paylines (Array): Array of payline configuration objects with positions and options.
- iconHeight (Number, optional): Height of icons for offset distribution. Default: 40.

Returns

- PIXI.Container: Container with all paylines properly distributed.

```jsx
const multiPaylines = createMultiplePayline([
  { positions: [[0, 0], [0, 1]], options: { color: 0xFF0000 } },
  { positions: [[1, 0], [1, 1]], options: { color: 0x00FF00 } }
], 50);
```

## createDistributedPaylines(paylineConfigs: PaylineConfig[], iconHeight?: number): PIXI.Container

Simplified API for creating multiple paylines with distribution.

Parameters

- paylineConfigs (Array): Array of simplified payline configurations.
- iconHeight (Number, optional): Height of icons for distribution. Default: 40.

Returns

- PIXI.Container: Container with distributed paylines.

```jsx
const paylines = createDistributedPaylines([
  { positions: [[0, 0], [0, 1]], color: 0xFF0000, width: 4 }
], 45);
```

## createTestPayline(options?: PaylineOptions): PIXI.Container

Creates a test payline with fallback coordinates for development and debugging.

Parameters

- options (Object, optional): Styling options with test-friendly defaults.

Returns

- PIXI.Container: Test payline container.

```jsx
const testPayline = createTestPayline({
  color: 0xFF00FF,
  glow: true,
  pulse: true
});
```

## Configuration Options

The options object supports the following properties:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| color | Number | 0xFFD700 | Line color (hex number). Default is gold. |
| width | Number | 4 | Line thickness in pixels. |
| alpha | Number | 0.8 | Line opacity (0-1). |
| zIndex | Number | Z_INDEX.PAYLINES | Layer order for proper rendering above icons. |
| yOffset | Number | 0 | Vertical offset for line positioning. |
| glow | Boolean | false | Enable glow effect around the line. |
| glowBlur | Number | 8 | Glow blur intensity when glow is enabled. |
| glowColor | Number | color | Glow color (defaults to line color). |
| pulse | Boolean | false | Enable pulse animation effect. |
| pulseDuration | Number | 2 | Pulse animation duration in seconds. |
| pulseMinAlpha | Number | 0.3 | Minimum opacity during pulse animation. |
| pulseMaxAlpha | Number | 1 | Maximum opacity during pulse animation. |

## Z-Index Hierarchy

The payline system follows this Z-index hierarchy:

- **Icons**: 200 (below paylines)
- **Paylines**: 250 (this system)
- **UI Buttons**: 400 (above paylines)
- **Popups**: 1000+ (always on top)

```jsx
// Paylines automatically use proper Z-index
const payline = createPayline(positions, {
  zIndex: 250 // Default payline layer
});
```

## Matrix Position System

Paylines use a matrix coordinate system where positions are defined as [row, column]:

```jsx
// 3x5 slot machine grid
// [0,0] [0,1] [0,2] [0,3] [0,4]
// [1,0] [1,1] [1,2] [1,3] [1,4]
// [2,0] [2,1] [2,2] [2,3] [2,4]

// Top row payline
const topRow = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];

// Diagonal payline
const diagonal = [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]];

// V-shape payline
const vShape = [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]];
```

## Icon Position Management

**IMPORTANT**: For paylines to work correctly, you must save and manage the actual pixel positions of your slot machine icons. The payline system uses these saved positions to draw lines between the correct screen coordinates.

### Setting Up Icon Position Storage with GlobalState

**Recommended Approach**: Use GlobalState to store icon positions for better organization and easier access throughout your application:

```jsx
// Add to your GlobalState class/object
GlobalState.iconPositions = {};

// Function to save icon position in GlobalState
const saveIconPosition = (row, col, x, y) => {
  if (!GlobalState.iconPositions[row]) {
    GlobalState.iconPositions[row] = {};
  }
  GlobalState.iconPositions[row][col] = { x, y };
  console.log(`💾 Saved icon position [${row},${col}] at (${x}, ${y}) in GlobalState`);
};

// Function to get icon position from GlobalState
const getIconPosition = (row, col) => {
  if (GlobalState.iconPositions[row] && GlobalState.iconPositions[row][col]) {
    return GlobalState.iconPositions[row][col];
  }
  console.warn(`⚠️ No position saved for icon [${row},${col}] in GlobalState`);
  return null;
};

// Alternative: Add methods directly to GlobalState
GlobalState.setIconPosition = (row, col, x, y) => {
  if (!GlobalState.iconPositions[row]) {
    GlobalState.iconPositions[row] = {};
  }
  GlobalState.iconPositions[row][col] = { x, y };
};

GlobalState.getIconPosition = (row, col) => {
  if (GlobalState.iconPositions[row] && GlobalState.iconPositions[row][col]) {
    return GlobalState.iconPositions[row][col];
  }
  return null;
};
```

### Saving Icon Positions During Slot Creation

When creating your slot machine icons, save their positions in GlobalState:

```jsx
// Example slot machine creation using GlobalState
const createSlotMachine = (appWidth, appHeight) => {
  const slotContainer = new Container();

  // Initialize icon positions in GlobalState if not already done
  if (!GlobalState.iconPositions) {
    GlobalState.iconPositions = {};
  }

  // Slot configuration
  const rows = 3;
  const cols = 5;
  const iconWidth = 80;
  const iconHeight = 80;
  const spacing = 10;

  // Calculate starting position to center the grid
  const totalWidth = (cols * iconWidth) + ((cols - 1) * spacing);
  const totalHeight = (rows * iconHeight) + ((rows - 1) * spacing);
  const startX = (appWidth - totalWidth) / 2;
  const startY = (appHeight - totalHeight) / 2;

  // Create icons and save positions in GlobalState
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Calculate icon position
      const iconX = startX + (col * (iconWidth + spacing)) + (iconWidth / 2);
      const iconY = startY + (row * (iconHeight + spacing)) + (iconHeight / 2);

      // Create icon sprite
      const icon = new Sprite(Assets.get('slotIcon'));
      icon.width = iconWidth;
      icon.height = iconHeight;
      icon.anchor.set(0.5, 0.5);
      icon.x = iconX;
      icon.y = iconY;

      // IMPORTANT: Save the icon position in GlobalState for paylines
      GlobalState.setIconPosition(row, col, iconX, iconY);
      // Or using the helper function:
      // saveIconPosition(row, col, iconX, iconY);

      slotContainer.addChild(icon);
    }
  }

  console.log('🎰 Slot machine created with positions saved in GlobalState');
  return slotContainer;
};
```

### Alternative: Using Icon References in GlobalState

You can also store direct references to icon sprites in GlobalState:

```jsx
// Initialize icon sprites storage in GlobalState
GlobalState.iconSprites = {};

const saveIconSprite = (row, col, sprite) => {
  if (!GlobalState.iconSprites[row]) {
    GlobalState.iconSprites[row] = {};
  }
  GlobalState.iconSprites[row][col] = sprite;
};

const getIconSprite = (row, col) => {
  if (GlobalState.iconSprites[row] && GlobalState.iconSprites[row][col]) {
    return GlobalState.iconSprites[row][col];
  }
  return null;
};

// Add methods directly to GlobalState
GlobalState.setIconSprite = (row, col, sprite) => {
  if (!GlobalState.iconSprites[row]) {
    GlobalState.iconSprites[row] = {};
  }
  GlobalState.iconSprites[row][col] = sprite;
};

GlobalState.getIconSprite = (row, col) => {
  if (GlobalState.iconSprites[row] && GlobalState.iconSprites[row][col]) {
    return GlobalState.iconSprites[row][col];
  }
  return null;
};

// During slot creation
const icon = new Sprite(Assets.get('slotIcon'));
icon.x = iconX;
icon.y = iconY;
GlobalState.setIconSprite(row, col, icon); // Save sprite reference in GlobalState

// Later, get position from sprite stored in GlobalState
const getIconPositionFromSprite = (row, col) => {
  const sprite = GlobalState.getIconSprite(row, col);
  return sprite ? { x: sprite.x, y: sprite.y } : null;
};
```

### Responsive Position Updates

Update icon positions in GlobalState when screen size changes:

```jsx
const updateIconPositions = (newAppWidth, newAppHeight) => {
  const rows = 3;
  const cols = 5;
  const iconWidth = 80;
  const iconHeight = 80;
  const spacing = 10;

  // Recalculate positions for new screen size
  const totalWidth = (cols * iconWidth) + ((cols - 1) * spacing);
  const totalHeight = (rows * iconHeight) + ((rows - 1) * spacing);
  const startX = (newAppWidth - totalWidth) / 2;
  const startY = (newAppHeight - totalHeight) / 2;

  // Update all icon positions in GlobalState
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const iconX = startX + (col * (iconWidth + spacing)) + (iconWidth / 2);
      const iconY = startY + (row * (iconHeight + spacing)) + (iconHeight / 2);

      // Update saved position in GlobalState
      GlobalState.setIconPosition(row, col, iconX, iconY);

      // Update sprite position if using sprite references in GlobalState
      const sprite = GlobalState.getIconSprite(row, col);
      if (sprite) {
        sprite.x = iconX;
        sprite.y = iconY;
      }
    }
  }

  console.log('📱 Icon positions updated in GlobalState for new screen size');
};

// Handle window resize
window.addEventListener('resize', () => {
  updateIconPositions(app.screen.width, app.screen.height);
  // Recreate any active paylines with new positions from GlobalState
});
```

### Payline Integration with GlobalState Positions

The payline system automatically uses positions saved in GlobalState:

```jsx
// The payline system looks for positions in this order:
// 1. GlobalState.iconPositions[row][col] - saved pixel positions
// 2. GlobalState.iconSprites[row][col] - sprite references
// 3. window.iconPositions[row][col] - fallback to window storage
// 4. window.iconSprites[row][col] - fallback sprite references
// 5. Fallback coordinates - for testing/debugging

// Example: Create payline using positions saved in GlobalState
const winningPositions = [[0, 0], [1, 1], [2, 2]];
const payline = createPayline(winningPositions, {
  color: 0xFF0000,
  width: 5,
  glow: true
});

// The payline will automatically connect the icon positions from GlobalState
console.log('✨ Payline created using GlobalState positions');
```

### Debugging Icon Positions

Add debugging tools to verify positions are saved correctly in GlobalState:

```jsx
// Debug function to visualize positions saved in GlobalState
const debugIconPositions = (app) => {
  const debugContainer = new Container();

  if (!GlobalState.iconPositions) {
    console.warn('⚠️ No icon positions found in GlobalState');
    return;
  }

  Object.keys(GlobalState.iconPositions).forEach(row => {
    Object.keys(GlobalState.iconPositions[row]).forEach(col => {
      const pos = GlobalState.iconPositions[row][col];

      // Create debug marker
      const marker = new Graphics();
      marker.beginFill(0xFF0000, 0.8);
      marker.drawCircle(0, 0, 5);
      marker.endFill();
      marker.x = pos.x;
      marker.y = pos.y;

      debugContainer.addChild(marker);

      // Add position label
      const label = new Text(`[${row},${col}]`, {
        fontSize: 12,
        fill: 0xFFFFFF
      });
      label.x = pos.x + 10;
      label.y = pos.y - 10;
      debugContainer.addChild(label);
    });
  });

  app.stage.addChild(debugContainer);

  console.log('🔍 Debug markers showing GlobalState icon positions');

  // Remove debug markers after 3 seconds
  setTimeout(() => {
    app.stage.removeChild(debugContainer);
    debugContainer.destroy({ children: true });
  }, 3000);
};

// Alternative: Log all positions to console
const logIconPositions = () => {
  console.log('📍 Icon positions in GlobalState:', GlobalState.iconPositions);

  if (GlobalState.iconSprites) {
    console.log('🎭 Icon sprites in GlobalState:', GlobalState.iconSprites);
  }
};

// Usage: Call these to verify positions are saved in GlobalState
debugIconPositions(app);
logIconPositions();
```

## Animation System

### Pulse Animation

Pulse animations create a breathing effect:

```jsx
const pulsingPayline = createPayline(positions, {
  pulse: true,
  pulseDuration: 1.5,     // 1.5 second cycle
  pulseMinAlpha: 0.4,     // Fade to 40% opacity
  pulseMaxAlpha: 1.0      // Fade to 100% opacity
});
```

### Glow Effects

Glow effects add visual impact:

```jsx
const glowingPayline = createPayline(positions, {
  glow: true,
  glowBlur: 10,           // Blur intensity
  glowColor: 0xFF4444,    // Custom glow color
  color: 0xFF0000         // Line color
});
```

## Usage Tips

### Icon Position Requirements

**Before using paylines, ensure icon positions are saved in GlobalState:**

```jsx
// ✅ CORRECT: Save positions in GlobalState during slot creation
const createSlot = () => {
  // ... create icons ...
  GlobalState.setIconPosition(row, col, iconX, iconY);
  // ... then paylines will work
};

// ❌ INCORRECT: Using paylines without saved positions in GlobalState
const payline = createPayline([[0,0], [1,1]]); // Will use fallback coordinates

// ✅ CORRECT: Verify positions in GlobalState before creating paylines
const createWinPayline = (positions) => {
  const allPositionsSaved = positions.every(([row, col]) => {
    return GlobalState.getIconPosition(row, col) !== null;
  });

  if (!allPositionsSaved) {
    console.error('❌ Cannot create payline: Icon positions not saved in GlobalState');
    return null;
  }

  return createPayline(positions, { color: 0xFF0000, glow: true });
};

// ✅ BEST PRACTICE: Initialize GlobalState icon positions early
const initializeGame = () => {
  // Initialize icon positions storage in GlobalState
  GlobalState.iconPositions = {};
  GlobalState.iconSprites = {};

  console.log('🎮 GlobalState initialized for icon position management');
};
```

### Performance Optimization

Manage payline lifecycle properly:

```jsx
// Create paylines
const paylines = createMultiplePayline(configs);
app.stage.addChild(paylines);

// Clean up when done
const cleanupPaylines = () => {
  app.stage.removeChild(paylines);
  paylines.destroy({ children: true }); // Destroy all children
};

// Call cleanup when changing scenes or ending game
cleanupPaylines();
```

### Responsive Design

Adapt paylines to different screen sizes:

```jsx
const createResponsivePaylines = (screenWidth) => {
  const iconHeight = screenWidth < 600 ? 30 : 40;
  const lineWidth = screenWidth < 600 ? 3 : 4;

  return createDistributedPaylines(configs.map(config => ({
    ...config,
    width: lineWidth
  })), iconHeight);
};
```

### Debugging Paylines

Use test paylines for development:

```jsx
// Enable debug mode
const DEBUG_PAYLINES = true;

if (DEBUG_PAYLINES) {
  const debugPayline = createTestPayline({
    color: 0xFF00FF,
    width: 6,
    pulse: true
  });
  app.stage.addChild(debugPayline);

  console.log('Debug payline active');
}
```

## Common Patterns

### Complete Slot Machine with GlobalState Paylines

```jsx
class SlotMachine {
  constructor(appWidth, appHeight) {
    this.appWidth = appWidth;
    this.appHeight = appHeight;
    this.container = new Container();
    this.activePaylines = [];

    // Initialize GlobalState for icon positions
    this.initializeGlobalState();
    this.createSlotGrid();
  }

  initializeGlobalState() {
    if (!GlobalState.iconPositions) {
      GlobalState.iconPositions = {};
    }
    if (!GlobalState.iconSprites) {
      GlobalState.iconSprites = {};
    }
    console.log('🎮 SlotMachine: GlobalState initialized for paylines');
  }

  createSlotGrid() {
    const rows = 3;
    const cols = 5;
    const iconSize = 80;
    const spacing = 10;

    // Calculate grid positioning
    const totalWidth = (cols * iconSize) + ((cols - 1) * spacing);
    const totalHeight = (rows * iconSize) + ((rows - 1) * spacing);
    const startX = (this.appWidth - totalWidth) / 2;
    const startY = (this.appHeight - totalHeight) / 2;

    // Create and position icons
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const iconX = startX + (col * (iconSize + spacing)) + (iconSize / 2);
        const iconY = startY + (row * (iconSize + spacing)) + (iconSize / 2);

        const icon = new Sprite(Assets.get('slotIcon'));
        icon.width = iconSize;
        icon.height = iconSize;
        icon.anchor.set(0.5, 0.5);
        icon.x = iconX;
        icon.y = iconY;

        // CRITICAL: Save position in GlobalState for paylines
        GlobalState.setIconPosition(row, col, iconX, iconY);
        GlobalState.setIconSprite(row, col, icon);

        this.container.addChild(icon);
      }
    }

    console.log('🎰 Slot grid created with positions saved in GlobalState');
  }

  showWinningPaylines(winningLines) {
    // Verify all positions are available in GlobalState
    const allPositionsValid = winningLines.every(line =>
      line.positions.every(([row, col]) =>
        GlobalState.getIconPosition(row, col) !== null
      )
    );

    if (!allPositionsValid) {
      console.error('❌ Cannot show paylines: Missing positions in GlobalState');
      return;
    }

    // Clear existing paylines
    this.clearPaylines();

    // Create new paylines using GlobalState positions
    winningLines.forEach((lineConfig, index) => {
      setTimeout(() => {
        const payline = createPayline(lineConfig.positions, {
          color: lineConfig.color || 0xFFD700,
          width: 6,
          glow: true,
          pulse: true
        });

        this.activePaylines.push(payline);
        this.container.addChild(payline);
      }, index * 200); // Stagger animations
    });

    console.log('✨ Paylines created using GlobalState positions');
  }

  clearPaylines() {
    this.activePaylines.forEach(payline => {
      this.container.removeChild(payline);
      payline.destroy({ children: true });
    });
    this.activePaylines = [];
  }

  // Method to update positions on resize
  resize(newWidth, newHeight) {
    this.appWidth = newWidth;
    this.appHeight = newHeight;

    // Update icon positions in GlobalState
    this.updateIconPositions();

    // Recreate active paylines with new positions
    if (this.activePaylines.length > 0) {
      const currentLines = this.activePaylines.map(payline => ({
        positions: payline.positions, // Assuming positions are stored
        color: payline.color
      }));
      this.showWinningPaylines(currentLines);
    }
  }

  updateIconPositions() {
    const rows = 3;
    const cols = 5;
    const iconSize = 80;
    const spacing = 10;

    const totalWidth = (cols * iconSize) + ((cols - 1) * spacing);
    const totalHeight = (rows * iconSize) + ((rows - 1) * spacing);
    const startX = (this.appWidth - totalWidth) / 2;
    const startY = (this.appHeight - totalHeight) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const iconX = startX + (col * (iconSize + spacing)) + (iconSize / 2);
        const iconY = startY + (row * (iconSize + spacing)) + (iconSize / 2);

        // Update position in GlobalState
        GlobalState.setIconPosition(row, col, iconX, iconY);

        // Update sprite position
        const sprite = GlobalState.getIconSprite(row, col);
        if (sprite) {
          sprite.x = iconX;
          sprite.y = iconY;
        }
      }
    }
  }
}

// Usage
const slotMachine = new SlotMachine(800, 600);
app.stage.addChild(slotMachine.container);

// Show winning paylines
const winningLines = [
  { positions: [[0, 0], [0, 1], [0, 2]], color: 0xFF0000 },
  { positions: [[1, 0], [1, 1], [1, 2]], color: 0x00FF00 }
];
slotMachine.showWinningPaylines(winningLines);
```

### Win Animation Sequence

```jsx
const showWinSequence = async (winningPaylines) => {
  // Verify all positions are saved before creating paylines
  const allPositionsValid = winningPaylines.every(line =>
    line.positions.every(([row, col]) => getIconPosition(row, col) !== null)
  );

  if (!allPositionsValid) {
    console.error('❌ Cannot show win sequence: Missing icon positions');
    return;
  }

  const paylines = [];

  // Show paylines one by one
  for (let i = 0; i < winningPaylines.length; i++) {
    const payline = createPayline(winningPaylines[i].positions, {
      color: winningPaylines[i].color,
      width: 6,
      glow: true,
      pulse: true,
      alpha: 0
    });

    app.stage.addChild(payline);
    paylines.push(payline);

    // Fade in animation
    let alpha = 0;
    const fadeIn = () => {
      alpha += 0.1;
      payline.alpha = Math.min(alpha, 1);
      if (alpha < 1) requestAnimationFrame(fadeIn);
    };
    fadeIn();

    // Wait before showing next payline
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Keep visible for 3 seconds
  setTimeout(() => {
    paylines.forEach(payline => {
      app.stage.removeChild(payline);
      payline.destroy({ children: true });
    });
  }, 3000);
};
```

### Interactive Payline Preview

```jsx
const createPaylinePreview = (paylineDefinitions) => {
  const previewContainer = new PIXI.Container();

  paylineDefinitions.forEach((definition, index) => {
    const button = createButton({
      x: index * 60,
      y: 0,
      width: 50,
      height: 30,
      label: `${index + 1}`,
      onClick: () => {
        // Clear previous preview
        previewContainer.removeChildren();

        // Show selected payline
        const preview = createPayline(definition.positions, {
          color: definition.color,
          width: 4,
          alpha: 0.6
        });
        previewContainer.addChild(preview);
      }
    });

    app.stage.addChild(button);
  });

  return previewContainer;
};
```
