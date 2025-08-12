# Commons Components Documentation

This documentation provides a comprehensive guide to all reusable UI components in the `src/components/commons` folder. These components are built using PixiJS and provide essential building blocks for creating interactive game interfaces.

## Table of Contents

1. [Button Component](#button-component)
2. [Text Component](#text-component)
3. [Popup Component](#popup-component)
4. [PositionedContainer Component](#positionedcontainer-component)
5. [Slider Component](#slider-component)
6. [Sprites Component](#sprites-component)
7. [Payline Components](#payline-components)
8. [Utility Functions](#utility-functions)

---

## Button Component

**File:** `Button.ts`

The Button component creates interactive, customizable buttons with support for textures, hover effects, and various styling options.

### Interface: `ButtonOptions`

```typescript
interface ButtonOptions {
  x?: number;                    // X position (default: 0)
  y?: number;                    // Y position (default: 0)
  width?: number;                // Button width (default: 100)
  height?: number;               // Button height (default: 50)
  color?: number | string;       // Background color (default: 0xcccccc)
  borderColor?: number | string; // Border color (default: 0x000000)
  borderWidth?: number;          // Border thickness (default: 2)
  borderRadius?: number;         // Corner radius (default: 0)
  texture?: Sprite | Texture;    // Background texture
  hoverTint?: number | string;   // Hover color (default: 0xaaaaaa)
  disabled?: boolean;            // Disabled state (default: false)
  onClick?: () => void;          // Click handler
  label?: string | number;       // Button text
  textColor?: number | string;   // Text color (default: 0x000000)
  visibility?: boolean;          // Visibility (default: true)
  textSize?: number;             // Font size (auto-calculated if not provided)
  selected?: boolean;            // Selected state (default: false)
  selectedTint?: number | string;// Selected color
  fontFamily?: string;           // Font family (default: 'Arial')
  anchor?: { x: number; y: number }; // Text anchor (default: {x: 0.5, y: 0.5})
  bold?: boolean;                // Bold text (default: false)
  italic?: boolean;              // Italic text (default: false)
  shadow?: boolean;              // Drop shadow (default: true)
}
```

### Usage Example

```typescript
import { createButton } from './commons/Button';

// Basic button
const basicButton = createButton({
  x: 100,
  y: 50,
  width: 150,
  height: 40,
  label: 'Click Me',
  onClick: () => console.log('Button clicked!')
});

// Styled button with texture
const styledButton = createButton({
  x: 300,
  y: 50,
  width: 200,
  height: 60,
  texture: Assets.get('buttonTexture'),
  label: 'Styled Button',
  textColor: 0xffffff,
  bold: true,
  hoverTint: 0x66cc66,
  onClick: handleButtonClick
});
```

### Key Features

- **Interactive States**: Normal, hover, selected, and disabled states
- **Texture Support**: Use custom textures or solid colors
- **Text Styling**: Full typography control with bold, italic, and shadow options
- **Responsive**: Auto-calculates text size based on button dimensions
- **Event Handling**: Built-in click, hover, and pointer events
- **Accessibility**: Proper cursor and interaction states

---

## Text Component

**File:** `Text.ts`

The Text component creates styled text objects with positioning, formatting, and visibility controls.

### Interface: `TextOptions`

```typescript
interface TextOptions {
  x?: number;                    // X position (centers if appWidth provided)
  y?: number;                    // Y position (centers if appHeight provided)
  appWidth?: number;             // App width for auto-centering
  appHeight?: number;            // App height for auto-centering
  text?: string | number;        // Text content (default: '')
  fontSize?: number;             // Font size (default: 20)
  color?: number | string;       // Text color (default: 0xffffff)
  anchor?: { x: number; y: number }; // Anchor point (default: {x: 0.5, y: 0.5})
  fontFamily?: string;           // Font family (default: 'Arial')
  fontWeight?: string;           // Font weight (default: 'normal')
  fontStyle?: string;            // Font style (default: 'normal')
  visibility?: boolean;          // Visibility (default: true)
  zIndex?: number;               // Layer order (default: 0)
}
```

### Usage Example

```typescript
import { createText } from './commons/Text';

// Centered title text
const titleText = createText({
  appWidth: 800,
  appHeight: 600,
  text: 'Game Title',
  fontSize: 48,
  color: 0xffd700,
  fontWeight: 'bold'
});

// Positioned score text
const scoreText = createText({
  x: 50,
  y: 30,
  text: 'Score: 1000',
  fontSize: 24,
  color: 0xffffff,
  anchor: { x: 0, y: 0 }
});
```

### Public Methods

- `setText(newText: string | number)`: Update text content
- `getText()`: Get current text content
- `setVisible(isVisible: boolean)`: Control visibility
- `getVisible()`: Get visibility state
- `setPosition(x: number, y: number)`: Update position
- `getPosition()`: Get current position

---

## Popup Component

**File:** `Popup.ts`

The Popup component creates modal overlays with customizable panels, close buttons, and responsive sizing.

### Interface: `SimplePopupOptions`

```typescript
interface SimplePopupOptions {
  width: number;                 // Container width
  height: number;                // Container height
  onClose: () => void;           // Close callback
  panelWidthScale?: number;      // Panel width ratio (default: 0.9)
  panelHeightScale?: number;     // Panel height ratio (default: 0.9)
  closeButtonTexture?: string;   // Close button texture (default: 'backButton')
}
```

### Usage Example

```typescript
import createSimplePopup from './commons/Popup';

const popup = createSimplePopup({
  width: 800,
  height: 600,
  onClose: () => {
    // Handle popup close
    container.removeChild(popup);
  },
  panelWidthScale: 0.8,
  panelHeightScale: 0.7
});

// Add content to popup
const contentContainer = popup.api.getContentContainer();
contentContainer.addChild(myContent);

// Add to stage
app.stage.addChild(popup);
```

### Key Features

- **Modal Overlay**: Semi-transparent background that closes popup when clicked
- **Responsive Sizing**: Automatically scales panel based on container size
- **Content Area**: Dedicated container for popup content
- **Close Button**: Positioned close button with custom texture support
- **Resize Support**: Built-in resize method for responsive layouts
- **Z-Index Management**: Proper layering above other UI elements

### Public API

- `resize(newWidth: number, newHeight: number)`: Resize popup
- `getContentContainer()`: Get container for adding content

---

## PositionedContainer Component

**File:** `PositionedContainer.ts`

The PositionedContainer component creates responsive containers with flexible positioning, styling, and optional scrolling capabilities.

### Interface: `PositionedContainerConfig`

```typescript
interface PositionedContainerConfig {
  gameContainerWidth: number;    // Parent container width
  gameContainerHeight: number;   // Parent container height
  width?: number | string;       // Container width (default: '100%')
  height?: number | string;      // Container height (default: '100%')
  x?: number | string;           // X position (default: 0)
  y?: number | string;           // Y position (default: 0)
  anchor?: { x: number; y: number }; // Anchor point
  backgroundColor?: number | string; // Background color
  transparent?: boolean;         // Transparent background
  borderColor?: number | string; // Border color
  borderWidth?: number;          // Border thickness
  borderRadius?: number;         // Corner radius
  opacity?: number;              // Container opacity
  marginLeft?: number;           // Left margin
  marginRight?: number;          // Right margin
  backgroundTexture?: Texture;   // Background texture
  textureScale?: number;         // Texture scaling
  textureRepeat?: boolean;       // Texture repeat
  textureFit?: string;           // Texture fit mode
  scrollable?: boolean;          // Enable scrolling
  scrollHeight?: number;         // Scroll area height
}
```

### Usage Examples

```typescript
import { 
  createPositionedContainer, 
  createSimplePositionedContainer,
  createStyledPositionedContainer 
} from './commons/PositionedContainer';

// Simple container
const simpleContainer = createSimplePositionedContainer({
  gameContainerWidth: 800,
  gameContainerHeight: 600,
  width: '50%',
  height: 200,
  x: '25%',
  y: 100
});

// Styled container with border
const styledContainer = createStyledPositionedContainer({
  gameContainerWidth: 800,
  gameContainerHeight: 600,
  width: 300,
  height: 400,
  x: 'center',
  y: 'center',
  backgroundColor: 0x1a2c38,
  borderColor: 0x304553,
  borderWidth: 2,
  borderRadius: 8
});
```

### Key Features

- **Flexible Positioning**: Supports pixels, percentages, and keywords ('center', 'left', 'right', 'top', 'bottom')
- **Responsive Design**: Automatically adjusts to parent container size changes
- **Texture Support**: Background textures with various fit modes (stretch, cover, contain, tile, center)
- **Scrolling**: Optional vertical scrolling for content overflow
- **Styling Options**: Borders, rounded corners, opacity, and margins
- **Anchor System**: Flexible anchor points for positioning

### Public Methods

- `updatePosition(width: number, height: number)`: Update for new parent size
- `updateDimensions(width: string | number, height: string | number)`: Change dimensions
- `setWidth(width: string | number)`: Set container width
- `setHeight(height: string | number)`: Set container height
- `setPosition(x: string | number, y: string | number)`: Update position
- `setAnchor(anchor: { x: number; y: number })`: Change anchor point
- `getActualBounds()`: Get calculated bounds
- `setBackgroundTexture(texture: Texture)`: Change background texture
- `setTextureScale(scale: number)`: Adjust texture scaling

---

## Slider Component

**File:** `Slider.ts`

The Slider component creates interactive sliders with customizable appearance and smooth dragging functionality.

### Interface: `SliderOptions`

```typescript
interface SliderOptions {
  knobTexture?: Texture;         // Custom knob texture
  trackTexture?: Texture;        // Custom track texture
  height?: number;               // Track height (default: 10)
  radius?: number;               // Knob radius (default: 14)
}
```

### Usage Example

```typescript
import { createSlider } from './commons/Slider';

const volumeSlider = createSlider(
  200,                           // width
  0.5,                          // initial value (0-1)
  (value) => {                  // onChange callback
    console.log('Volume:', value);
    audioManager.setVolume(value);
  },
  {
    height: 12,
    radius: 16,
    knobTexture: Assets.get('sliderKnob'),
    trackTexture: Assets.get('sliderTrack')
  }
);
```

### Key Features

- **Smooth Dragging**: Responsive drag interaction with proper event handling
- **Value Range**: Normalized values between 0 and 1
- **Custom Textures**: Support for custom knob and track textures
- **Visual Feedback**: Hover and drag state visual changes
- **Resize Support**: Built-in resize method for responsive layouts
- **Precise Control**: Accurate value calculation and positioning

### Public Methods

- `resize(newWidth: number, newOptions?: Partial<SliderOptions>)`: Resize slider
- `setValue(value: number)`: Programmatically set value
- `getValue()`: Get current value

---

## Sprites Component

**File:** `Sprites.ts`

The Sprites component creates animated sprites from loaded spritesheets with extensive customization options.

### Interface: `SpriteOptions`

```typescript
interface SpriteOptions {
  x?: number;                    // X position
  y?: number;                    // Y position
  width?: number;                // Sprite width
  height?: number;               // Sprite height
  scale?: number;                // Uniform scale (default: 1)
  animationSpeed?: number;       // Animation speed (default: 0.5)
  loop?: boolean;                // Loop animation (default: true)
  autoplay?: boolean;            // Auto-start animation (default: true)
  anchor?: number;               // Anchor point (default: 0.5)
  animationName?: string;        // Specific animation name
  center?: boolean;              // Center on screen (default: false)
}
```

### Usage Example

```typescript
import { createSpriteFromLoadedAssets } from './commons/Sprites';

// Load spritesheet first
await PIXI.Assets.load('coinAnimation.json');

// Create animated sprite (synchronous)
const coinSprite = createSpriteFromLoadedAssets(
  'coinAnimation',               // spritesheet name
  {
    x: 100,
    y: 100,
    scale: 1.5,
    animationSpeed: 0.3,
    loop: true,
    autoplay: true
  },
  app                           // PIXI Application for centering
);

// Add to stage
app.stage.addChild(coinSprite);
```

### Key Features

- **Spritesheet Support**: Works with loaded PIXI spritesheets
- **Animation Control**: Speed, looping, and autoplay options
- **Flexible Sizing**: Width, height, or uniform scaling
- **Positioning**: Absolute positioning or screen centering
- **Animation Selection**: Play specific animations from spritesheets
- **Anchor Control**: Customizable anchor points

---

## Payline Components

**File:** `createPayline.ts`

The Payline components create visual connections between matrix positions for slot games, with support for multiple paylines, animations, and styling.

### Interface: `PaylineOptions`

```typescript
interface PaylineOptions {
  color?: number;                // Line color (default: 0xFFD700)
  width?: number;                // Line thickness (default: 4)
  alpha?: number;                // Line opacity (default: 0.8)
  zIndex?: number;               // Layer order (default: Z_INDEX.PAYLINES)
  yOffset?: number;              // Vertical offset (default: 0)
  glow?: boolean;                // Enable glow effect (default: false)
  glowBlur?: number;             // Glow blur intensity (default: 8)
  glowColor?: number;            // Glow color (defaults to line color)
  pulse?: boolean;               // Enable pulse animation (default: false)
  pulseDuration?: number;        // Pulse duration in seconds (default: 2)
  pulseMinAlpha?: number;        // Minimum pulse opacity (default: 0.3)
  pulseMaxAlpha?: number;        // Maximum pulse opacity (default: 1)
}
```

### Usage Examples

```typescript
import { 
  createPayline, 
  createMultiplePayline, 
  createDistributedPaylines,
  createTestPayline 
} from './commons/createPayline';

// Single payline
const payline = createPayline(
  [[0, 0], [1, 1], [2, 2]],     // matrix positions
  {
    color: 0xff0000,
    width: 6,
    glow: true,
    pulse: true
  }
);

// Multiple paylines with distribution
const multiplePaylines = createDistributedPaylines([
  { positions: [[0, 0], [0, 1], [0, 2]], color: 0xff0000 },
  { positions: [[1, 0], [1, 1], [1, 2]], color: 0x00ff00 },
  { positions: [[2, 0], [2, 1], [2, 2]], color: 0x0000ff }
], 40); // icon height for distribution

// Test payline for debugging
const testPayline = createTestPayline({
  color: 0xff00ff,
  glow: true,
  pulse: true
});
```

### Key Functions

1. **`createPayline(positions, options)`**: Creates a single payline
2. **`createMultiplePayline(paylines, iconHeight)`**: Creates multiple paylines with Y-offset distribution
3. **`createDistributedPaylines(configs, iconHeight)`**: Simplified multiple payline creation
4. **`createTestPayline(options)`**: Creates test payline with fallback coordinates

### Key Features

- **Matrix Positioning**: Connects specific grid positions
- **Visual Effects**: Glow and pulse animations
- **Multiple Paylines**: Automatic distribution to prevent overlap
- **Z-Index Management**: Proper layering with other game elements
- **Flexible Styling**: Colors, thickness, opacity, and effects
- **Animation Support**: Built-in pulse animations with customizable timing

---

## Utility Functions

### getRandom Function

**File:** `getRandom.ts`

Provides cryptographically secure random number generation.

```typescript
export const getSecureRandomNumber = (min: number, max: number): number
```

**Usage:**
```typescript
import { getSecureRandomNumber } from './commons/getRandom';

const randomValue = getSecureRandomNumber(1, 100); // Random number between 1-100
```

**Features:**
- Uses `window.crypto.getRandomValues()` for secure randomness
- Uniform distribution across the specified range
- Suitable for gaming applications requiring fair randomness

---

## Component Exports

**File:** `index.ts`

All components are exported from the main index file:

```typescript
export { default as createButton } from './Button';
export { default as createPopup } from './Popup';
export { default as createSpriteFromLoadedAssets } from './Sprites';
export { default as createText } from './Text';
export { createPayline, createMultiplePayline } from './createPayline';
```

### Import Examples

```typescript
// Individual imports
import { createButton } from './commons/Button';
import { createText } from './commons/Text';

// Bulk imports
import { 
  createButton, 
  createPopup, 
  createText,
  createPayline 
} from './commons';
```

---

## Best Practices

### 1. **Responsive Design**
- Use percentage-based sizing where appropriate
- Implement resize methods for dynamic layouts
- Test components at different screen sizes

### 2. **Performance**
- Reuse textures across multiple components
- Use object pooling for frequently created/destroyed components
- Minimize the number of graphics redraws

### 3. **Accessibility**
- Provide proper hover states for interactive elements
- Use appropriate cursor styles
- Ensure sufficient color contrast

### 4. **Memory Management**
- Properly dispose of event listeners
- Remove components from containers when no longer needed
- Cache frequently used assets

### 5. **Styling Consistency**
- Use consistent color schemes across components
- Maintain uniform spacing and sizing patterns
- Follow established design system guidelines

---

## Common Patterns

### Creating Responsive UI Panels

```typescript
const createGamePanel = (appWidth: number, appHeight: number) => {
  const panel = createStyledPositionedContainer({
    gameContainerWidth: appWidth,
    gameContainerHeight: appHeight,
    width: '90%',
    height: '80%',
    x: 'center',
    y: 'center',
    backgroundColor: 0x1a2c38,
    borderRadius: 12
  });

  const title = createText({
    appWidth: panel.getActualBounds().width,
    y: 50,
    text: 'Game Panel',
    fontSize: 32,
    color: 0xffffff,
    fontWeight: 'bold'
  });

  panel.contentArea.addChild(title);
  return panel;
};
```

### Interactive Button Groups

```typescript
const createButtonGroup = (buttons: Array<{label: string, onClick: () => void}>) => {
  const container = new Container();
  
  buttons.forEach((buttonConfig, index) => {
    const button = createButton({
      x: index * 120,
      y: 0,
      width: 100,
      height: 40,
      label: buttonConfig.label,
      onClick: buttonConfig.onClick
    });
    
    container.addChild(button);
  });
  
  return container;
};
```

This documentation provides a comprehensive guide to using all commons components effectively. Each component is designed to be flexible, reusable, and easy to integrate into your game projects.
