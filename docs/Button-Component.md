# Button Component

The Button component is a powerful, reusable UI element for Pixi.js applications. It is a versatile component that can be used to build interactive buttons, value bars, toggles, and various UI controls. It supports textured or colored backgrounds, text labels, hover effects, selection states, and comprehensive interactivity, making it ideal for menus, in-game interfaces, settings panels, and any interactive application elements.

## Features

- **Flexible Styling**: Configurable size, position, colors, borders, and rounded corners
- **Texture Support**: Optional sprite/texture backgrounds with dynamic texture switching
- **Typography Control**: Customizable text labels with font family, size, weight, and style
- **Interactive States**: Hover, disabled, selected, and pointer tracking with visual feedback
- **Shadow Effects**: Optional drop shadow for raised button appearance
- **Smart Click Detection**: Movement threshold to distinguish clicks from scrolling
- **Dynamic Updates**: Runtime changes to size, position, texture, text, and styling
- **Anchor System**: Flexible anchor positioning for precise alignment
- **Event Handling**: Comprehensive pointer event management
- **State Management**: Getter/setter methods for all properties

## Installation

Ensure you have Pixi.js installed in your project.

## Usage

The createButton function creates a PIXI.Container with a button composed of a background (sprite or graphics), an optional text label, and a shadow for a raised effect. Add the button to a Pixi.js stage to render it.

```jsx
import { createButton } from './path/to/createButton.js';
```

### Basic Example

Create a simple button with a colored background and text label:

```jsx
import * as PIXI from 'pixi.js';
import { createButton } from './createButton.js';
// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);
// Create a button
const button = createButton({
  x: 400, // Center of the button  
  y: 300,
  width: 200,
  height: 80,
  color: 0x00ff00, // Green background  
  label: 'Click Me',
  textColor: 0xffffff, // White text  
  onClick: () => console.log('Button clicked!')
});
// Add button to stage
app.stage.addChild(button);
```

### Advanced Example with Texture and States

Create a textured button with hover, disabled, and selected states:

```jsx
import * as PIXI from 'pixi.js';
import { createButton } from './createButton.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Load a texture
const texture = Assets.get('asset_name'); // Check out Assets loading to see how we load assets

// Create a button with advanced features
const button = createButton({
  x: 400,
  y: 300,
  width: 200,
  height: 80,
  texture: texture,
  label: 'Start Game',
  textColor: 0xffffff,
  hoverTint: 0xcccccc,
  selectedTint: 0xffff00, // Yellow tint when selected
  onClick: () => console.log('Game started!'),
  fontFamily: 'Arial Black',
  bold: true,
  shadow: true
});

// Add button to stage
app.stage.addChild(button);

// Demonstrate state changes
setTimeout(() => {
  button.setSelected(true); // Apply selected state
  console.log('Button selected');
}, 2000);

setTimeout(() => {
  button.setLabel('Loading...');
  button.setDisabled(true); // Disable button
}, 4000);

setTimeout(() => {
  button.setLabel('Complete!');
  button.setDisabled(false);
  button.setSelected(false);
  button.setTextColor('#00ff00'); // Green text
}, 6000);
```

### Dynamic Button Example

Demonstrate runtime updates and texture switching:

```jsx
import * as PIXI from 'pixi.js';
import { createButton } from './createButton.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Load multiple textures
const playTexture = Assets.get('playButton');
const pauseTexture = Assets.get('pauseButton');

// Create dynamic button
let isPlaying = false;
const playPauseButton = createButton({
  x: 400,
  y: 300,
  width: 120,
  height: 120,
  texture: playTexture,
  onClick: () => {
    isPlaying = !isPlaying;

    if (isPlaying) {
      playPauseButton.setTexture(pauseTexture);
      playPauseButton.setLabel('');
      console.log('Playing...');
    } else {
      playPauseButton.setTexture(playTexture);
      playPauseButton.setLabel('');
      console.log('Paused');
    }
  }
});

// Add button to stage
app.stage.addChild(playPauseButton);

// Demonstrate size animation
let growing = true;
app.ticker.add(() => {
  const currentSize = playPauseButton.getSize();
  const newSize = growing ? currentSize.width + 0.5 : currentSize.width - 0.5;

  if (newSize >= 140) growing = false;
  if (newSize <= 100) growing = true;

  playPauseButton.setSize(newSize, newSize);
});
```

### Settings Panel Example

Create a settings panel with multiple interactive buttons:

```jsx
import * as PIXI from 'pixi.js';
import { createButton } from './createButton.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Settings state
const settings = {
  sound: true,
  music: true,
  difficulty: 'Medium'
};

// Create settings buttons
const soundButton = createButton({
  x: 200,
  y: 200,
  width: 150,
  height: 40,
  label: 'Sound: ON',
  color: 0x4CAF50,
  selectedTint: 0x45a049,
  onClick: () => {
    settings.sound = !settings.sound;
    soundButton.setLabel(`Sound: ${settings.sound ? 'ON' : 'OFF'}`);
    soundButton.setTextColor(settings.sound ? '#ffffff' : '#cccccc');
  }
});

const musicButton = createButton({
  x: 200,
  y: 260,
  width: 150,
  height: 40,
  label: 'Music: ON',
  color: 0x2196F3,
  selectedTint: 0x1976D2,
  onClick: () => {
    settings.music = !settings.music;
    musicButton.setLabel(`Music: ${settings.music ? 'ON' : 'OFF'}`);
    musicButton.setTextColor(settings.music ? '#ffffff' : '#cccccc');
  }
});

const difficulties = ['Easy', 'Medium', 'Hard'];
let difficultyIndex = 1;

const difficultyButton = createButton({
  x: 200,
  y: 320,
  width: 150,
  height: 40,
  label: 'Difficulty: Medium',
  color: 0xFF9800,
  selectedTint: 0xF57C00,
  onClick: () => {
    difficultyIndex = (difficultyIndex + 1) % difficulties.length;
    settings.difficulty = difficulties[difficultyIndex];
    difficultyButton.setLabel(`Difficulty: ${settings.difficulty}`);

    // Change color based on difficulty
    const colors = [0x4CAF50, 0xFF9800, 0xF44336]; // Green, Orange, Red
    difficultyButton.setTexture(null); // Reset to graphics to change color
  }
});

// Add buttons to stage
app.stage.addChild(soundButton);
app.stage.addChild(musicButton);
app.stage.addChild(difficultyButton);
```

# API Reference

## createButton(options: ButtonOptions): PIXI.Container

Creates a button component as a PIXI.Container.

Parameters

- options (Object, optional): Configuration options for the button. See Configuration Options for details.

Returns

- PIXI.Container: The button container with background, shadow, and optional text.

```jsx
const button = createButton({ label: 'Play', x: 100, y: 100 });
app.stage.addChild(button);
```

## Methods

The returned PIXI.Container has the following custom methods:

### setDisabled(disable: boolean): void

Enables or disables the button, affecting interactivity and appearance.

- **Parameters**:
    - disable (Boolean): true to disable the button, false to enable.

```jsx
button.setDisabled(true); // Disable button
```

---

### getDisabled(): boolean

Returns the button's disabled state.

- **Returns**: boolean - true if disabled, false otherwise.

```jsx
console.log(button.getDisabled()); // false
```

---

### setVisibility(visible: boolean): void

Sets the button's visibility, affecting all child elements.

- **Parameters**:
    - visible (Boolean): true to show the button, false to hide.

```jsx
button.setVisibility(false); // Hide button
```

---

### getVisibility(): boolean

Returns the button's visibility state.

- **Returns**: boolean - true if visible, false otherwise.

```jsx
console.log(button.getVisibility()); // true
```

---

### setSelected(select: boolean): void

Sets the button's selected state, applying a tint if specified.

- **Parameters**:
    - select (Boolean): true to select the button, false to deselect.

```jsx
button.setSelected(true); // Apply selected state
```

---

### getSelected(): boolean

Returns the button's selected state.

- **Returns**: boolean - true if selected, false otherwise.

```jsx
console.log(button.getSelected()); // false
```

---

### setLabel(newLabel: string | number): void

Updates the button's text label.

- **Parameters**:
    - newLabel (String | Number): The new label text.

```jsx
button.setLabel('New Text'); // Update label
```

---

### setPosition(newX: number, newY: number): void

Updates the button's position.

- **Parameters**:
    - newX (Number): New X position to update
    - newY (Number): New Y position to update

```jsx
button.setPosition(100, 200); // Move button to new position
```

---

### getPosition(): object

Returns the current position of the button.

- **Returns**: object - Object with x and y properties `{x: Number, y: Number}`

```jsx
const position = button.getPosition();
console.log(position.x, position.y); // 100 200
```

---

### setTexture(newTexture: Sprite | Texture | null): void

Changes the button's background texture dynamically.

- **Parameters**:
    - newTexture (PIXI.Sprite | PIXI.Texture | null): New texture to apply, or null for graphics background

```jsx
const newTexture = Assets.get('newButtonTexture');
button.setTexture(newTexture); // Switch to textured background
button.setTexture(null); // Switch back to graphics background
```

---

### getTexture(): Texture | null

Returns the current background texture if using a sprite background.

- **Returns**: PIXI.Texture | null - Current texture or null if using graphics

```jsx
const currentTexture = button.getTexture();
if (currentTexture) {
  console.log('Button is using texture:', currentTexture);
}
```

---

### setSize(newWidth: number, newHeight: number): void

Updates the button's dimensions and redraws all elements.

- **Parameters**:
    - newWidth (Number): New width in pixels
    - newHeight (Number): New height in pixels

```jsx
button.setSize(200, 60); // Resize button
```

---

### getSize(): object

Returns the current button dimensions.

- **Returns**: object - Object with width and height properties `{width: Number, height: Number}`

```jsx
const size = button.getSize();
console.log(size.width, size.height); // 200 60
```

---

### setBold(isBold: boolean): void

Sets the text label to bold or normal weight.

- **Parameters**:
    - isBold (Boolean): true for bold text, false for normal

```jsx
button.setBold(true); // Make text bold
button.setBold(false); // Make text normal weight
```

---

### getBold(): boolean

Returns the current bold state of the text.

- **Returns**: boolean - true if text is bold, false otherwise

```jsx
console.log(button.getBold()); // true
```

---

### setItalic(isItalic: boolean): void

Sets the text label to italic or normal style.

- **Parameters**:
    - isItalic (Boolean): true for italic text, false for normal

```jsx
button.setItalic(true); // Make text italic
button.setItalic(false); // Make text normal style
```

---

### getItalic(): boolean

Returns the current italic state of the text.

- **Returns**: boolean - true if text is italic, false otherwise

```jsx
console.log(button.getItalic()); // false
```

---

### setTextColor(newColor: string): void

Changes the text color dynamically.

- **Parameters**:
    - newColor (String): New color as hex string (e.g., '#ff0000' or 'red')

```jsx
button.setTextColor('#ff0000'); // Change text to red
button.setTextColor('#00ff00'); // Change text to green
```

## Events

The button supports comprehensive Pixi.js interaction events with smart click detection:

### pointerover

Fired when the mouse hovers over the button (if not disabled and visible).

```jsx
button.on('pointerover', () => {
  console.log('Hovering over button!');
  // Button automatically applies hover tint
});
```

---

### pointerout

Fired when the mouse leaves the button area.

```jsx
button.on('pointerout', () => {
  console.log('Mouse left button!');
  // Button automatically removes hover tint
});
```

---

### pointerdown

Fired when the button is pressed down. Tracks pointer position for click detection.

```jsx
button.on('pointerdown', (event) => {
  console.log('Button pressed down at:', event.global.x, event.global.y);
});
```

---

### pointerup

Fired when the button is released. Only triggers onClick if pointer hasn't moved significantly.

```jsx
button.on('pointerup', (event) => {
  console.log('Button released');
  // onClick callback is triggered automatically if movement is within threshold
});
```

---

### pointerupoutside

Fired when the pointer is released outside the button area.

```jsx
button.on('pointerupoutside', () => {
  console.log('Pointer released outside button');
  // Automatically resets pointer down state
});
```

## Smart Click Detection

The button includes intelligent click detection that distinguishes between clicks and scrolling:

- **Movement Threshold**: 10 pixels (configurable in source)
- **Click Detection**: Only triggers onClick if pointer movement is below threshold
- **Scroll Prevention**: Prevents accidental clicks during scrolling gestures

```jsx
// This will trigger onClick
// 1. Press down on button
// 2. Move less than 10 pixels
// 3. Release

// This will NOT trigger onClick
// 1. Press down on button
// 2. Move more than 10 pixels (scrolling)
// 3. Release
```

## Configuration Options

The options object passed to createButton supports the following properties:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| x | Number | 0 | X-coordinate of the button's center. |
| y | Number | 0 | Y-coordinate of the button's center. |
| width | Number | 100 | Width of the button in pixels. |
| height | Number | 50 | Height of the button in pixels. |
| color | Number \| String | 0xcccccc | Background color (hex string or number) for non-textured buttons. |
| borderColor | Number \| String | 0x000000 | Border color (hex string or number). |
| borderWidth | Number | 2 | Border thickness in pixels. |
| borderRadius | Number | 0 | Corner radius for rounded rectangles. |
| texture | PIXI.Sprite \| PIXI.Texture | undefined | Sprite texture for the button background. Overrides color. |
| hoverTint | Number \| String | 0xaaaaaa | Tint applied on hover (hex string or number). |
| disabled | Boolean | false | If true, disables interactivity and applies a faded appearance. |
| onClick | Function | undefined | Callback function triggered on button click. |
| label | String \| Number | '' | Text label for the button. |
| textColor | Number \| String | 0x000000 | Text color (hex string or number). |
| visibility | Boolean | true | If false, hides the button and its children. |
| textSize | Number | Calculated | Custom font size for the label. Defaults to 40% of min(width, height). |
| selected | Boolean | false | If true, applies the selected tint. |
| selectedTint | Number \| String | 0x66cc66 | Tint applied when selected (hex string or number). |
| fontFamily | String | 'Arial' | Font family for the text label. |
| anchor | Object | {x:0.5, y:0.5} | Set anchor for button for precise positioning |
| bold | Boolean | false | If true, applies bold font weight to the text label. |
| italic | Boolean | false | If true, applies italic font style to the text label. |
| shadow | Boolean | true | If true, adds a drop shadow effect to the button for a raised appearance. |

## Usage Tips

### State Management

Manage button states effectively for better user experience:

```jsx
const button = createButton({
  label: 'Submit',
  onClick: async () => {
    // Disable during processing
    button.setDisabled(true);
    button.setLabel('Processing...');

    try {
      await submitData();
      button.setLabel('Success!');
      button.setTextColor('#00ff00');
    } catch (error) {
      button.setLabel('Error - Retry');
      button.setTextColor('#ff0000');
    } finally {
      setTimeout(() => {
        button.setDisabled(false);
        button.setLabel('Submit');
        button.setTextColor('#000000');
      }, 2000);
    }
  }
});
```

### Responsive Design

Create buttons that adapt to different screen sizes:

```jsx
const createResponsiveButton = (screenWidth, label, onClick) => {
  const isSmallScreen = screenWidth < 600;

  return createButton({
    width: isSmallScreen ? 120 : 160,
    height: isSmallScreen ? 35 : 45,
    label: label,
    fontSize: isSmallScreen ? 14 : 18,
    onClick: onClick
  });
};

// Handle window resize
window.addEventListener('resize', () => {
  const newButton = createResponsiveButton(window.innerWidth, 'Play', startGame);
  // Replace old button with new responsive one
});
```

### Button Groups

Create consistent button groups:

```jsx
const createButtonGroup = (buttons, spacing = 10) => {
  const container = new PIXI.Container();
  let currentX = 0;

  buttons.forEach(config => {
    const button = createButton({
      x: currentX,
      y: 0,
      width: 100,
      height: 40,
      ...config
    });

    container.addChild(button);
    currentX += 100 + spacing;
  });

  return container;
};

// Usage
const menuButtons = createButtonGroup([
  { label: 'Play', onClick: startGame, color: 0x4CAF50 },
  { label: 'Settings', onClick: openSettings, color: 0x2196F3 },
  { label: 'Quit', onClick: quitGame, color: 0xF44336 }
]);
```

### Animation Integration

Integrate buttons with animation systems:

```jsx
const animatedButton = createButton({
  label: 'Animated',
  onClick: () => console.log('Clicked!')
});

// Pulse animation
let scale = 1;
let growing = true;

app.ticker.add(() => {
  scale += growing ? 0.01 : -0.01;
  if (scale >= 1.1) growing = false;
  if (scale <= 0.9) growing = true;

  animatedButton.scale.set(scale);
});

// Hover animation
animatedButton.on('pointerover', () => {
  // Smooth scale up
  const scaleUp = () => {
    animatedButton.scale.x += 0.02;
    animatedButton.scale.y += 0.02;
    if (animatedButton.scale.x < 1.1) {
      requestAnimationFrame(scaleUp);
    }
  };
  scaleUp();
});

animatedButton.on('pointerout', () => {
  // Smooth scale down
  const scaleDown = () => {
    animatedButton.scale.x -= 0.02;
    animatedButton.scale.y -= 0.02;
    if (animatedButton.scale.x > 1) {
      requestAnimationFrame(scaleDown);
    }
  };
  scaleDown();
});
```

## Common Patterns

### Toggle Button

```jsx
const createToggleButton = (label, initialState = false, onToggle) => {
  let isToggled = initialState;

  const button = createButton({
    label: `${label}: ${isToggled ? 'ON' : 'OFF'}`,
    color: isToggled ? 0x4CAF50 : 0x757575,
    selected: isToggled,
    onClick: () => {
      isToggled = !isToggled;
      button.setLabel(`${label}: ${isToggled ? 'ON' : 'OFF'}`);
      button.setSelected(isToggled);
      if (onToggle) onToggle(isToggled);
    }
  });

  return button;
};

// Usage
const soundToggle = createToggleButton('Sound', true, (enabled) => {
  audioManager.setEnabled(enabled);
});
```

### Loading Button

```jsx
const createLoadingButton = (label, asyncAction) => {
  const button = createButton({
    label: label,
    onClick: async () => {
      const originalLabel = button.getLabel();
      button.setDisabled(true);
      button.setLabel('Loading...');

      try {
        await asyncAction();
        button.setLabel('Success!');
        setTimeout(() => button.setLabel(originalLabel), 1500);
      } catch (error) {
        button.setLabel('Failed!');
        setTimeout(() => button.setLabel(originalLabel), 1500);
      } finally {
        setTimeout(() => button.setDisabled(false), 1500);
      }
    }
  });

  return button;
};
```
