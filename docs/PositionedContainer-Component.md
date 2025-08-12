# PositionedContainer Component

The PositionedContainer component is a powerful, flexible container system for Pixi.js applications. It provides responsive positioning, comprehensive styling options, texture support, and optional scrolling capabilities, making it ideal for creating adaptive UI layouts, panels, backgrounds, and complex interface structures.

## Features

- Flexible positioning with pixels, percentages, and keywords ('center', 'left', 'right', 'top', 'bottom')
- Responsive design that adapts to parent container size changes
- Comprehensive styling: borders, rounded corners, opacity, margins
- Background texture support with multiple fit modes (stretch, cover, contain, tile, center)
- Optional vertical scrolling for content overflow
- Anchor system for precise positioning control
- Real-time dimension and position updates
- Transparent or colored backgrounds
- Margin support for spacing control

## Installation

Ensure you have Pixi.js installed in your project.

## Usage

The PositionedContainer system provides three main functions for different use cases: basic containers, simple containers, and styled containers.

```jsx
import { 
  createPositionedContainer,
  createSimplePositionedContainer,
  createStyledPositionedContainer 
} from './path/to/PositionedContainer.js';
```

### Basic Example with Simple Container

Create a simple container with minimal styling:

```jsx
import * as PIXI from 'pixi.js';
import { createSimplePositionedContainer } from './PositionedContainer.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Create a simple container
const simpleContainer = createSimplePositionedContainer({
  gameContainerWidth: 800,
  gameContainerHeight: 600,
  width: '50%',
  height: 200,
  x: '25%',
  y: 100,
  backgroundColor: 0x1A2C38
});

// Add container to stage
app.stage.addChild(simpleContainer.container);
```

### Advanced Example with Styled Container

Create a styled container with borders and rounded corners:

```jsx
import * as PIXI from 'pixi.js';
import { createStyledPositionedContainer } from './PositionedContainer.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Create a styled container
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

// Add some content
const contentArea = styledContainer.contentArea;
// Add your UI elements to contentArea

// Add container to stage
app.stage.addChild(styledContainer.container);
```

### Responsive Layout Example

Create containers that adapt to screen size changes:

```jsx
import * as PIXI from 'pixi.js';
import { createPositionedContainer } from './PositionedContainer.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Create responsive containers
const headerContainer = createPositionedContainer({
  gameContainerWidth: 800,
  gameContainerHeight: 600,
  width: '100%',
  height: 80,
  x: 0,
  y: 0,
  backgroundColor: 0x2c3e50,
  borderColor: 0x34495e,
  borderWidth: 2
});

const sidebarContainer = createPositionedContainer({
  gameContainerWidth: 800,
  gameContainerHeight: 600,
  width: '20%',
  height: '80%',
  x: 0,
  y: 80,
  backgroundColor: 0x34495e,
  marginRight: 10
});

const mainContainer = createPositionedContainer({
  gameContainerWidth: 800,
  gameContainerHeight: 600,
  width: '75%',
  height: '80%',
  x: '25%',
  y: 80,
  backgroundColor: 0x3498db,
  borderRadius: 5
});

// Add containers to stage
app.stage.addChild(headerContainer.container);
app.stage.addChild(sidebarContainer.container);
app.stage.addChild(mainContainer.container);

// Handle window resize
window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  
  app.renderer.resize(newWidth, newHeight);
  
  // Update all containers
  headerContainer.updatePosition(newWidth, newHeight);
  sidebarContainer.updatePosition(newWidth, newHeight);
  mainContainer.updatePosition(newWidth, newHeight);
});
```

### Texture Background Example

Create containers with textured backgrounds:

```jsx
import * as PIXI from 'pixi.js';
import { createPositionedContainer } from './PositionedContainer.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Load texture
const backgroundTexture = Assets.get('panelTexture');

// Create container with textured background
const texturedContainer = createPositionedContainer({
  gameContainerWidth: 800,
  gameContainerHeight: 600,
  width: 400,
  height: 300,
  x: 'center',
  y: 'center',
  backgroundTexture: backgroundTexture,
  textureFit: 'cover',
  textureScale: 1.2,
  borderRadius: 10,
  opacity: 0.9
});

// Add container to stage
app.stage.addChild(texturedContainer.container);

// Change texture at runtime
setTimeout(() => {
  const newTexture = Assets.get('alternativeTexture');
  texturedContainer.setBackgroundTexture(newTexture);
  texturedContainer.setTextureScale(1.5);
}, 3000);
```

### Scrollable Container Example

Create a container with vertical scrolling:

```jsx
import * as PIXI from 'pixi.js';
import { createPositionedContainer } from './PositionedContainer.js';
import { createText } from './createText.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Create scrollable container
const scrollableContainer = createPositionedContainer({
  gameContainerWidth: 800,
  gameContainerHeight: 600,
  width: 300,
  height: 200,
  x: 'center',
  y: 'center',
  backgroundColor: 0x2c3e50,
  borderColor: 0x34495e,
  borderWidth: 2,
  borderRadius: 5,
  scrollable: true,
  scrollHeight: 500 // Content height larger than container
});

// Add scrollable content
const contentArea = scrollableContainer.contentArea;
for (let i = 0; i < 20; i++) {
  const item = createText({
    x: 10,
    y: i * 25,
    text: `Item ${i + 1}`,
    fontSize: 16,
    color: 0xffffff,
    anchor: { x: 0, y: 0 }
  });
  contentArea.addChild(item);
}

// Add container to stage
app.stage.addChild(scrollableContainer.container);
```

# API Reference

## createPositionedContainer(config: PositionedContainerConfig): PositionedContainerResult

Creates a fully configurable positioned container with all styling and functionality options.

Parameters

- config (Object): Configuration options for the container. See Configuration Options for details.

Returns

- PositionedContainerResult: Object containing the container and utility methods.

```jsx
const result = createPositionedContainer({
  gameContainerWidth: 800,
  gameContainerHeight: 600,
  width: '50%',
  height: 300
});
app.stage.addChild(result.container);
```

## createSimplePositionedContainer(options): PositionedContainerResult

Creates a simple container with minimal styling options.

```jsx
const simple = createSimplePositionedContainer({
  gameContainerWidth: 800,
  gameContainerHeight: 600,
  width: 200,
  height: 150,
  x: 100,
  y: 100
});
```

## createStyledPositionedContainer(options): PositionedContainerResult

Creates a styled container with borders, rounded corners, and enhanced appearance.

```jsx
const styled = createStyledPositionedContainer({
  gameContainerWidth: 800,
  gameContainerHeight: 600,
  width: 300,
  height: 200,
  borderRadius: 10,
  borderWidth: 2
});
```

## Methods

The returned PositionedContainerResult object contains the following methods:

### updatePosition(width: number, height: number): void

Updates the container for new parent dimensions, recalculating all positions and sizes.

- **Parameters**:
    - width (Number): New parent container width.
    - height (Number): New parent container height.

```jsx
container.updatePosition(1024, 768); // Update for new screen size
```

---

### updateDimensions(width: string | number, height: string | number): void

Changes the container's dimensions and updates the layout.

- **Parameters**:
    - width (String | Number): New width (pixels or percentage).
    - height (String | Number): New height (pixels or percentage).

```jsx
container.updateDimensions('60%', 400); // Resize container
```

---

### setWidth(width: string | number): void

Sets the container width and updates the layout.

- **Parameters**:
    - width (String | Number): New width value.

```jsx
container.setWidth(300); // Set width to 300 pixels
container.setWidth('75%'); // Set width to 75% of parent
```

---

### setHeight(height: string | number): void

Sets the container height and updates the layout.

- **Parameters**:
    - height (String | Number): New height value.

```jsx
container.setHeight(200); // Set height to 200 pixels
container.setHeight('50%'); // Set height to 50% of parent
```

---

### setPosition(x: string | number, y: string | number): void

Updates the container's position.

- **Parameters**:
    - x (String | Number): New X position (pixels, percentage, or keyword).
    - y (String | Number): New Y position (pixels, percentage, or keyword).

```jsx
container.setPosition('center', 100); // Center horizontally, 100px from top
container.setPosition('25%', 'center'); // 25% from left, center vertically
```

---

### setAnchor(anchor: { x: number; y: number }): void

Changes the container's anchor point for positioning.

- **Parameters**:
    - anchor (Object): Anchor point with x and y values (0-1).

```jsx
container.setAnchor({ x: 0, y: 0 }); // Top-left anchor
container.setAnchor({ x: 0.5, y: 0.5 }); // Center anchor
```

---

### getActualBounds(): object

Returns the calculated bounds of the container.

- **Returns**: object - Object with x, y, width, height properties.

```jsx
const bounds = container.getActualBounds();
console.log(bounds.width, bounds.height); // Actual pixel dimensions
```

---

### setBackgroundTexture(texture: Texture): void

Changes the background texture of the container.

- **Parameters**:
    - texture (PIXI.Texture): New background texture.

```jsx
const newTexture = Assets.get('newBackground');
container.setBackgroundTexture(newTexture);
```

---

### setTextureScale(scale: number): void

Adjusts the scaling of the background texture.

- **Parameters**:
    - scale (Number): Scale factor for the texture.

```jsx
container.setTextureScale(1.5); // Scale texture to 150%
```

## Properties

The PositionedContainerResult object contains these properties:

### container: PIXI.Container

The main container to add to your stage.

```jsx
app.stage.addChild(result.container);
```

---

### contentArea: PIXI.Container

The area where you should add your content (accounts for borders and padding).

```jsx
result.contentArea.addChild(myUIElement);
```

---

### background: PIXI.Graphics

The background graphics object (for colored backgrounds).

```jsx
result.background.tint = 0xff0000; // Change background color
```

---

### backgroundSprite: PIXI.Sprite | null

The background sprite object (for textured backgrounds, null if not used).

```jsx
if (result.backgroundSprite) {
  result.backgroundSprite.alpha = 0.8; // Adjust texture opacity
}
```

## Configuration Options

The config object supports the following properties:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| gameContainerWidth | Number | Required | Parent container width for calculations. |
| gameContainerHeight | Number | Required | Parent container height for calculations. |
| width | Number \| String | '100%' | Container width (pixels or percentage). |
| height | Number \| String | '100%' | Container height (pixels or percentage). |
| x | Number \| String | 0 | X position (pixels, percentage, or 'left'/'center'/'right'). |
| y | Number \| String | 0 | Y position (pixels, percentage, or 'top'/'center'/'bottom'). |
| anchor | Object | {x: 0, y: 0} | Anchor point for positioning (0-1 range). |
| backgroundColor | Number \| String | 0x1A2C38 | Background color (hex number or string). |
| transparent | Boolean | false | If true, background is transparent. |
| borderColor | Number \| String | undefined | Border color (hex number or string). |
| borderWidth | Number | 0 | Border thickness in pixels. |
| borderRadius | Number | 0 | Corner radius for rounded rectangles. |
| opacity | Number | 1 | Container opacity (0-1). |
| marginLeft | Number | 0 | Left margin in pixels. |
| marginRight | Number | 0 | Right margin in pixels. |
| backgroundTexture | PIXI.Texture | undefined | Background texture to use instead of color. |
| textureScale | Number | 1 | Scale factor for background texture. |
| textureRepeat | Boolean | false | Whether to repeat the texture. |
| textureFit | String | 'stretch' | How texture fits: 'stretch', 'cover', 'contain', 'tile', 'center'. |
| scrollable | Boolean | false | Enable vertical scrolling. |
| scrollHeight | Number | undefined | Height of scrollable content area. |

## Position Keywords

The component supports keyword positioning for convenience:

### X Position Keywords
- `'left'`: Aligns to the left edge
- `'center'`: Centers horizontally
- `'right'`: Aligns to the right edge

### Y Position Keywords
- `'top'`: Aligns to the top edge
- `'center'`: Centers vertically
- `'bottom'`: Aligns to the bottom edge

```jsx
const container = createPositionedContainer({
  gameContainerWidth: 800,
  gameContainerHeight: 600,
  x: 'center', // Center horizontally
  y: 'bottom', // Align to bottom
  width: 200,
  height: 100
});
```

## Texture Fit Modes

When using background textures, you can control how they fit:

- **'stretch'**: Stretches texture to fill container (default)
- **'cover'**: Scales texture to cover container, may crop
- **'contain'**: Scales texture to fit inside container, may have empty space
- **'tile'**: Repeats texture to fill container
- **'center'**: Centers texture without scaling

```jsx
const texturedContainer = createPositionedContainer({
  gameContainerWidth: 800,
  gameContainerHeight: 600,
  backgroundTexture: myTexture,
  textureFit: 'cover', // Scale to cover entire container
  textureScale: 1.2
});
```

## Usage Tips

### Responsive Design

Use percentages and keywords for responsive layouts:

```jsx
const responsiveContainer = createPositionedContainer({
  gameContainerWidth: 800,
  gameContainerHeight: 600,
  width: '90%', // 90% of parent width
  height: '50%', // 50% of parent height
  x: 'center', // Center horizontally
  y: 'center' // Center vertically
});
```

### Nested Containers

Create complex layouts with nested containers:

```jsx
const parentContainer = createPositionedContainer({
  gameContainerWidth: 800,
  gameContainerHeight: 600,
  width: '80%',
  height: '70%',
  x: 'center',
  y: 'center'
});

const childContainer = createPositionedContainer({
  gameContainerWidth: parentContainer.getActualBounds().width,
  gameContainerHeight: parentContainer.getActualBounds().height,
  width: '50%',
  height: '30%',
  x: 'center',
  y: 'top'
});

parentContainer.contentArea.addChild(childContainer.container);
```
