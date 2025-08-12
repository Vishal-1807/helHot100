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

### Win Animation Sequence

```jsx
const showWinSequence = async (winningPaylines) => {
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
