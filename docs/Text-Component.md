# Text Component

The Text component is a flexible, customizable text rendering element for Pixi.js applications. It provides comprehensive text styling options, positioning controls, and visibility management, making it ideal for UI labels, game text, titles, and any text-based content in your applications.

## Features

- Configurable position with automatic centering options
- Comprehensive typography controls (font family, size, weight, style)
- Color customization with hex string or number support
- Flexible anchor positioning for precise text alignment
- Visibility controls with getter/setter methods
- Z-index support for proper layering
- Dynamic text content updates
- Position management with getter/setter methods

## Installation

Ensure you have Pixi.js installed in your project.

## Usage

The createText function creates a PIXI.Container with a styled text object. The container provides methods for dynamic text manipulation and positioning.

```jsx
import { createText } from './path/to/createText.js';
```

### Basic Example

Create simple text with default styling:

```jsx
import * as PIXI from 'pixi.js';
import { createText } from './createText.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Create basic text
const titleText = createText({
  x: 400,
  y: 100,
  text: 'Welcome to the Game',
  fontSize: 32,
  color: 0xffffff
});

// Add text to stage
app.stage.addChild(titleText);
```

### Advanced Example with Auto-Centering

Create styled text with automatic centering and custom typography:

```jsx
import * as PIXI from 'pixi.js';
import { createText } from './createText.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Create centered title text
const centeredTitle = createText({
  appWidth: 800,
  appHeight: 600,
  text: 'GAME TITLE',
  fontSize: 48,
  color: 0xffd700, // Gold color
  fontFamily: 'Arial Black',
  fontWeight: 'bold',
  fontStyle: 'normal',
  zIndex: 10
});

// Create score text with custom positioning
const scoreText = createText({
  x: 50,
  y: 30,
  text: 'Score: 0',
  fontSize: 24,
  color: 0x00ff00, // Green color
  anchor: { x: 0, y: 0 }, // Top-left alignment
  fontFamily: 'Courier New'
});

// Add texts to stage
app.stage.addChild(centeredTitle);
app.stage.addChild(scoreText);

// Update score dynamically
let score = 0;
setInterval(() => {
  score += 10;
  scoreText.setText(`Score: ${score}`);
}, 1000);
```

### Dynamic Text Updates Example

Demonstrate text content and position updates:

```jsx
import * as PIXI from 'pixi.js';
import { createText } from './createText.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Create dynamic text
const dynamicText = createText({
  x: 400,
  y: 300,
  text: 'Click to update!',
  fontSize: 28,
  color: 0xff6600,
  fontWeight: 'bold'
});

app.stage.addChild(dynamicText);

// Make text interactive
dynamicText.interactive = true;
dynamicText.cursor = 'pointer';

let clickCount = 0;
dynamicText.on('pointerdown', () => {
  clickCount++;
  dynamicText.setText(`Clicked ${clickCount} times!`);
  
  // Change position randomly
  const newX = Math.random() * 600 + 100;
  const newY = Math.random() * 400 + 100;
  dynamicText.setPosition(newX, newY);
  
  // Toggle visibility briefly
  dynamicText.setVisible(false);
  setTimeout(() => dynamicText.setVisible(true), 200);
});
```

# API Reference

## createText(options: TextOptions): PIXI.Container

Creates a text component as a PIXI.Container with a styled text object.

Parameters

- options (Object, optional): Configuration options for the text. See Configuration Options for details.

Returns

- PIXI.Container: The text container with the styled text object and custom methods.

```jsx
const text = createText({ text: 'Hello World', fontSize: 24, color: 0xffffff });
app.stage.addChild(text);
```

## Methods

The returned PIXI.Container has the following custom methods:

### setText(newText: string | number): void

Updates the text content dynamically.

- **Parameters**:
    - newText (String | Number): The new text content to display.

```jsx
text.setText('Updated Text');
text.setText(12345); // Numbers are automatically converted to strings
```

---

### getText(): string

Returns the current text content.

- **Returns**: string - The current text content.

```jsx
console.log(text.getText()); // "Updated Text"
```

---

### setVisible(isVisible: boolean): void

Sets the text's visibility, affecting both the container and text object.

- **Parameters**:
    - isVisible (Boolean): true to show the text, false to hide.

```jsx
text.setVisible(false); // Hide text
text.setVisible(true);  // Show text
```

---

### getVisible(): boolean

Returns the text's visibility state.

- **Returns**: boolean - true if visible, false otherwise.

```jsx
console.log(text.getVisible()); // true
```

---

### setPosition(newX: number, newY: number): void

Updates the text's position.

- **Parameters**:
    - newX (Number): New X coordinate.
    - newY (Number): New Y coordinate.

```jsx
text.setPosition(100, 200); // Move text to new position
```

---

### getPosition(): object

Returns the current text position.

- **Returns**: object - Object with x and y properties `{x: Number, y: Number}`.

```jsx
const position = text.getPosition();
console.log(position.x, position.y); // 100 200
```

## Events

The text container supports standard Pixi.js interaction events when interactivity is enabled:

### pointerdown

Fired when the text is clicked (requires `interactive = true`).

```jsx
text.interactive = true;
text.on('pointerdown', () => console.log('Text clicked!'));
```

---

### pointerover

Fired when the mouse hovers over the text.

```jsx
text.interactive = true;
text.on('pointerover', () => console.log('Hovering over text!'));
```

---

### pointerout

Fired when the mouse leaves the text area.

```jsx
text.interactive = true;
text.on('pointerout', () => console.log('Mouse left text!'));
```

## Configuration Options

The options object passed to createText supports the following properties:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| x | Number | Calculated | X-coordinate of the text. Auto-centers if appWidth is provided. |
| y | Number | Calculated | Y-coordinate of the text. Auto-centers if appHeight is provided. |
| appWidth | Number | 0 | Application width for automatic horizontal centering. |
| appHeight | Number | 0 | Application height for automatic vertical centering. |
| text | String \| Number | '' | Text content to display. Numbers are converted to strings. |
| fontSize | Number | 20 | Font size in pixels. |
| color | Number \| String | 0xffffff | Text color (hex string or number). Default is white. |
| anchor | Object | {x: 0.5, y: 0.5} | Anchor point for text alignment. {x: 0, y: 0} is top-left, {x: 1, y: 1} is bottom-right. |
| fontFamily | String | 'Arial' | Font family name (e.g., 'Arial', 'Helvetica', 'Times New Roman'). |
| fontWeight | String | 'normal' | Font weight ('normal', 'bold', 'bolder', 'lighter', '100'-'900'). |
| fontStyle | String | 'normal' | Font style ('normal', 'italic', 'oblique'). |
| visibility | Boolean | true | Initial visibility state. If false, text is hidden on creation. |
| zIndex | Number | 0 | Layer order for sorting. Higher values appear above lower values. |

## Usage Tips

### Centering Text

Use `appWidth` and `appHeight` for automatic centering:

```jsx
const centeredText = createText({
  appWidth: 800,
  appHeight: 600,
  text: 'Centered Text',
  fontSize: 32
});
```

### Precise Positioning

Use specific x, y coordinates with anchor for precise control:

```jsx
const topLeftText = createText({
  x: 10,
  y: 10,
  text: 'Top Left',
  anchor: { x: 0, y: 0 } // Top-left anchor
});

const bottomRightText = createText({
  x: 790,
  y: 590,
  text: 'Bottom Right',
  anchor: { x: 1, y: 1 } // Bottom-right anchor
});
```

### Dynamic Content

Update text content and properties at runtime:

```jsx
const gameTimer = createText({
  x: 400,
  y: 50,
  text: '00:00',
  fontSize: 24,
  color: 0xffffff
});

// Update timer every second
let seconds = 0;
setInterval(() => {
  seconds++;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  gameTimer.setText(`${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
}, 1000);
```
