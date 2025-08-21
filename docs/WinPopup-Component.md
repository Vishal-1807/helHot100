# WinPopup Component

The WinPopup component is a specialized popup system for displaying win notifications in slot machine games. It creates animated popup overlays that automatically appear with a zoom-in effect, display win information, and disappear after a set duration. The component supports customizable textures, animated text counters, and flexible positioning for various win types like "Big Win" and "Total Win" displays.

## Features

- **Animated Entrance/Exit**: Smooth zoom-in and zoom-out animations using GSAP
- **Auto-Dismiss**: Automatically closes after 3 seconds with configurable timing
- **Texture Support**: Uses predefined textures or custom sprites for win popup backgrounds
- **Text Integration**: Displays win amounts with animated number counting effects
- **Overlay Background**: Semi-transparent dark overlay for focus and visual separation
- **Flexible Positioning**: Configurable text positioning relative to popup dimensions
- **Promise-Based**: Returns a Promise that resolves when the popup animation completes
- **Responsive Design**: Adapts to different screen sizes using relative positioning
- **Click Interaction**: Optional early dismissal through click events

## Installation

Ensure you have PixiJS, GSAP, and the required dependencies installed in your project.

## Usage

The ShowWinPopup function creates an animated popup overlay that displays win information and automatically dismisses after a set duration.

```typescript
import { ShowWinPopup } from './path/to/WinPopup';
```

### Basic Example

Create a simple win popup with default settings:

```typescript
import * as PIXI from 'pixi.js';
import { ShowWinPopup } from './WinPopup';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Show a basic win popup
ShowWinPopup(
  app.screen.width,
  app.screen.height,
  app.stage,
  'totalWin'
).then(() => {
  console.log('Win popup animation completed!');
});
```

### Win Amount with Animated Counter

Display a win amount with animated number counting:

```typescript
import * as PIXI from 'pixi.js';
import { ShowWinPopup } from './WinPopup';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Show win popup with animated counter
ShowWinPopup(
  app.screen.width,
  app.screen.height,
  app.stage,
  'bigWin',
  {
    winAmount: 1500,
    textStyle: {
      fontFamily: 'Arial Black',
      fontSize: 32,
      fill: 0xFFD700, // Gold color
      stroke: 0x000000,
      strokeThickness: 2
    }
  }
).then(() => {
  console.log('Big win popup completed!');
});
```

### Custom Text and Positioning

Create a popup with custom text content and positioning:

```typescript
import * as PIXI from 'pixi.js';
import { ShowWinPopup } from './WinPopup';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Show popup with custom text and positioning
ShowWinPopup(
  app.screen.width,
  app.screen.height,
  app.stage,
  'totalWin',
  {
    textContent: 'JACKPOT!',
    textRelativeX: 0.5, // Center horizontally
    textRelativeY: 0.3, // Position in upper third
    textStyle: {
      fontFamily: 'Impact',
      fontSize: 48,
      fill: 0xFF0000, // Red color
      align: 'center'
    }
  }
).then(() => {
  console.log('Jackpot popup completed!');
});
```

### Custom Texture Example

Use a custom sprite or texture for the popup background:

```typescript
import * as PIXI from 'pixi.js';
import { ShowWinPopup } from './WinPopup';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Load custom texture
const customTexture = Assets.get('customWinPopup');

// Show popup with custom texture
ShowWinPopup(
  app.screen.width,
  app.screen.height,
  app.stage,
  '', // Empty string since we're providing custom texture
  {
    texture: customTexture,
    winAmount: 2500,
    textRelativeX: 0.5,
    textRelativeY: 0.6, // Position text in lower area
    textStyle: {
      fontFamily: 'Verdana',
      fontSize: 28,
      fill: 0xFFFFFF,
      dropShadow: true,
      dropShadowDistance: 2
    }
  }
).then(() => {
  console.log('Custom texture popup completed!');
});
```

### Sequential Win Popups

Chain multiple win popups for bonus rounds:

```typescript
import * as PIXI from 'pixi.js';
import { ShowWinPopup } from './WinPopup';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Show sequential win popups
const showWinSequence = async () => {
  // First popup - Line win
  await ShowWinPopup(
    app.screen.width,
    app.screen.height,
    app.stage,
    'totalWin',
    {
      textContent: 'LINE WIN!',
      winAmount: 250,
      textStyle: { fontSize: 24, fill: 0x00FF00 }
    }
  );

  // Second popup - Bonus win
  await ShowWinPopup(
    app.screen.width,
    app.screen.height,
    app.stage,
    'bigWin',
    {
      textContent: 'BONUS WIN!',
      winAmount: 750,
      textStyle: { fontSize: 32, fill: 0xFFD700 }
    }
  );

  // Final popup - Total win
  await ShowWinPopup(
    app.screen.width,
    app.screen.height,
    app.stage,
    'totalWin',
    {
      textContent: 'TOTAL WIN!',
      winAmount: 1000,
      textStyle: { fontSize: 36, fill: 0xFF0000 }
    }
  );

  console.log('All win popups completed!');
};

// Start the sequence
showWinSequence();
```

### Game Integration Example

Integrate win popups into a slot machine game flow:

```typescript
import * as PIXI from 'pixi.js';
import { ShowWinPopup } from './WinPopup';

class SlotMachine {
  private app: PIXI.Application;
  private isShowingWin: boolean = false;

  constructor() {
    this.app = new PIXI.Application({ width: 800, height: 600 });
    document.body.appendChild(this.app.view.asCanvas);
  }

  async handleWin(winAmount: number, winType: 'small' | 'big' | 'mega') {
    if (this.isShowingWin) return; // Prevent overlapping popups
    
    this.isShowingWin = true;

    try {
      let popupType = 'totalWin';
      let textStyle = { fontSize: 24, fill: 0xFFFFFF };

      switch (winType) {
        case 'small':
          popupType = 'totalWin';
          textStyle = { fontSize: 24, fill: 0x00FF00 };
          break;
        case 'big':
          popupType = 'bigWin';
          textStyle = { fontSize: 32, fill: 0xFFD700 };
          break;
        case 'mega':
          popupType = 'bigWin';
          textStyle = { fontSize: 40, fill: 0xFF0000 };
          break;
      }

      await ShowWinPopup(
        this.app.screen.width,
        this.app.screen.height,
        this.app.stage,
        popupType,
        {
          winAmount: winAmount,
          textStyle: textStyle
        }
      );

      // Continue game flow after popup
      this.enableSpinButton();
      
    } finally {
      this.isShowingWin = false;
    }
  }

  private enableSpinButton() {
    // Re-enable spin button after win popup
    console.log('Spin button enabled');
  }
}

// Usage
const slotMachine = new SlotMachine();

// Simulate different win types
setTimeout(() => slotMachine.handleWin(150, 'small'), 1000);
setTimeout(() => slotMachine.handleWin(1500, 'big'), 6000);
setTimeout(() => slotMachine.handleWin(5000, 'mega'), 12000);
```

# API Reference

## ShowWinPopup(appWidth, appHeight, parentContainer, winType, options): Promise<void>

Creates and displays an animated win popup that automatically dismisses after 3 seconds.

### Parameters

- **appWidth** (Number): Application width in pixels for responsive positioning
- **appHeight** (Number): Application height in pixels for responsive positioning  
- **parentContainer** (PIXI.Container): Container to add the popup to (usually app.stage)
- **winType** (String, optional): Type of win popup texture ('totalWin' or 'bigWin'). Default: 'totalWin'
- **options** (WinPopupOptions, optional): Configuration options for the popup

### Returns

- **Promise<void>**: Promise that resolves when the popup animation completes and cleanup is finished

```typescript
const popup = ShowWinPopup(800, 600, app.stage, 'bigWin', {
  winAmount: 1000,
  textStyle: { fontSize: 32, fill: 0xFFD700 }
});

popup.then(() => {
  console.log('Popup animation completed');
});
```

## WinPopupOptions Interface

Configuration options for customizing the win popup appearance and behavior.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| winAmount | Number | undefined | Win amount to display with animated counter |
| textContent | String | undefined | Custom text content (overrides winAmount display) |
| textRelativeX | Number | 0.5 | Relative X position for text (0 to 1, where 0.5 is center) |
| textRelativeY | Number | 0.5 | Relative Y position for text (0 to 1, where 0.5 is center) |
| textStyle | Partial<TextStyle> | Default style | PixiJS TextStyle configuration for text appearance |
| texture | PIXI.Sprite \| PIXI.Texture | undefined | Custom sprite or texture for popup background |
| isAutoSpin | Boolean | false | Whether this popup is part of an auto spin sequence (affects duration) |

### TextStyle Properties

The textStyle option accepts any valid PixiJS TextStyle properties:

```typescript
{
  fontFamily: 'Arial',           // Font family name
  fontSize: 24,                  // Font size in pixels
  fill: 0xFFFFFF,               // Text color (hex number or string)
  stroke: 0x000000,             // Stroke color
  strokeThickness: 2,           // Stroke width
  align: 'center',              // Text alignment
  dropShadow: true,             // Enable drop shadow
  dropShadowDistance: 3,        // Shadow distance
  dropShadowColor: 0x000000,    // Shadow color
  dropShadowAlpha: 0.5          // Shadow opacity
}
```

## Animation Timeline

The win popup follows a specific animation sequence:

1. **Initialization** (0ms): Popup created with scale 0, added to parent container
2. **Zoom In** (0-500ms): GSAP animation scales popup from 0 to 1 with back.out easing
3. **Number Counting** (0-1000ms): If winAmount provided, animates from 0 to target value
4. **Display Duration** (500-3500ms): Popup remains visible for 3 seconds
5. **Zoom Out** (3500-3800ms): GSAP animation scales popup from 1 to 0 with back.in easing
6. **Cleanup** (3800ms): Popup removed from parent and destroyed, Promise resolves

```typescript
// Timeline visualization
// 0ms     500ms           3500ms  3800ms
// |-------|---------------|-------|
// Zoom In   Display Time   Zoom Out
//   ^                        ^
//   Scale 0→1               Scale 1→0
//   back.out               back.in
```

## Positioning System

The popup uses a relative positioning system based on UI_POS constants:

- **Popup Position**: Centered using `UI_POS.WIN_POPUP_X` and `UI_POS.WIN_POPUP_Y`
- **Popup Size**: Scaled using `UI_POS.WIN_POPUP_WIDTH` and `UI_POS.WIN_POPUP_HEIGHT`
- **Text Position**: Relative to popup bounds using `textRelativeX` and `textRelativeY`

```typescript
// Text positioning examples
{
  textRelativeX: 0.0, textRelativeY: 0.0  // Top-left corner
  textRelativeX: 0.5, textRelativeY: 0.0  // Top-center
  textRelativeX: 1.0, textRelativeY: 0.0  // Top-right corner
  textRelativeX: 0.5, textRelativeY: 0.5  // Center (default)
  textRelativeX: 0.5, textRelativeY: 1.0  // Bottom-center
}
```

## Events and Interactions

### Click Events

The popup button includes click event handling for potential early dismissal:

```typescript
// Click handler is automatically added but currently only logs
onClick: () => {
  console.log('Win popup clicked - could close early here');
}
```

### Background Overlay

The popup includes a semi-transparent background overlay:

- **Color**: Black (0x000000)
- **Alpha**: 0.6 (60% opacity)
- **Interaction**: Blocks interaction with elements behind popup
- **Coverage**: Full application dimensions

## Error Handling

The component includes comprehensive error handling:

### Missing Texture Handling

```typescript
// If specified texture doesn't exist in Assets
const fetchedTexture = Assets.get<Texture>(winType);
if (!fetchedTexture) {
  console.error(`❌ Texture '${winType}' not found in Assets.`);
  resolve(); // Promise resolves immediately
  return;
}
```

### Safe Cleanup

```typescript
// Ensures proper cleanup even if errors occur
onComplete: () => {
  parentContainer.removeChild(popupContainer);
  popupContainer.destroy();
  resolve();
}
```

## Usage Tips

### Performance Optimization

Avoid creating multiple simultaneous popups:

```typescript
class WinPopupManager {
  private isActive: boolean = false;
  private queue: Array<() => Promise<void>> = [];

  async showWin(appWidth: number, appHeight: number, container: PIXI.Container, 
                winType: string, options?: WinPopupOptions) {
    if (this.isActive) {
      // Queue the popup for later
      return new Promise<void>((resolve) => {
        this.queue.push(async () => {
          await ShowWinPopup(appWidth, appHeight, container, winType, options);
          resolve();
        });
      });
    }

    this.isActive = true;
    try {
      await ShowWinPopup(appWidth, appHeight, container, winType, options);
    } finally {
      this.isActive = false;
      this.processQueue();
    }
  }

  private async processQueue() {
    if (this.queue.length > 0) {
      const nextPopup = this.queue.shift()!;
      await nextPopup();
    }
  }
}
```

### Responsive Text Sizing

Adjust text size based on screen dimensions:

```typescript
const getResponsiveTextStyle = (appWidth: number, appHeight: number) => {
  const baseSize = Math.min(appWidth, appHeight) * 0.04; // 4% of smaller dimension
  
  return {
    fontSize: Math.max(16, Math.min(48, baseSize)), // Clamp between 16-48px
    fontFamily: 'Arial Black',
    fill: 0xFFD700
  };
};

// Usage
ShowWinPopup(appWidth, appHeight, container, 'bigWin', {
  winAmount: 1500,
  textStyle: getResponsiveTextStyle(appWidth, appHeight)
});
```

### Auto Spin vs Manual Spin Timing

The component automatically adjusts timing based on whether it's part of an auto spin sequence:

```typescript
// Manual spin - shows for 3 seconds
await ShowWinPopup(appWidth, appHeight, container, 'bigWin', {
  winAmount: 1500,
  isAutoSpin: false // Default value
});

// Auto spin - shows for 1.5 seconds (faster for better flow)
await ShowWinPopup(appWidth, appHeight, container, 'bigWin', {
  winAmount: 1500,
  isAutoSpin: true
});

// Example usage in game logic
const handleWin = async (winAmount: number, isAutoSpinActive: boolean) => {
  await ShowWinPopup(appWidth, appHeight, container, 'bigWin', {
    winAmount: winAmount,
    isAutoSpin: isAutoSpinActive,
    textStyle: { fontSize: 32, fill: 0xFFD700 }
  });

  // Continue game flow after popup completes
  enableGameControls();
};
```

### Asset Preloading

Ensure win popup textures are loaded before use:

```typescript
// In your asset loading phase
const winPopupAssets = [
  { alias: 'totalWin', src: 'assets/TotalWin.png' },
  { alias: 'bigWin', src: 'assets/BigWin.png' }
];

await Assets.load(winPopupAssets);

// Now safe to use win popups
ShowWinPopup(appWidth, appHeight, container, 'totalWin');
```

## Common Patterns

### Win Type Detection

```typescript
const determineWinType = (winAmount: number, betAmount: number): string => {
  const multiplier = winAmount / betAmount;
  
  if (multiplier >= 50) return 'bigWin';
  if (multiplier >= 10) return 'totalWin';
  return 'totalWin'; // Default for smaller wins
};

// Usage
const winType = determineWinType(1500, 25); // Returns 'bigWin' (60x multiplier)
ShowWinPopup(appWidth, appHeight, container, winType, { winAmount: 1500 });
```

### Celebration Sequence

```typescript
const celebrateWin = async (winAmount: number) => {
  // Play win sound
  playWinSound();
  
  // Show win popup
  await ShowWinPopup(appWidth, appHeight, container, 'bigWin', {
    winAmount: winAmount,
    textStyle: { fontSize: 36, fill: 0xFFD700 }
  });
  
  // Update balance display
  updateBalance(winAmount);
  
  // Re-enable game controls
  enableGameControls();
};
```

### Multi-Language Support

```typescript
const getWinText = (winAmount: number, language: string): string => {
  const texts = {
    'en': `YOU WIN $${winAmount}!`,
    'es': `¡GANASTE $${winAmount}!`,
    'fr': `VOUS GAGNEZ ${winAmount}€!`,
    'de': `SIE GEWINNEN ${winAmount}€!`
  };
  
  return texts[language] || texts['en'];
};

// Usage
ShowWinPopup(appWidth, appHeight, container, 'bigWin', {
  textContent: getWinText(1500, 'es'),
  textStyle: { fontSize: 28, fill: 0xFFD700 }
});
```