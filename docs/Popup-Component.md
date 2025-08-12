# Popup Component

The Popup component is a versatile modal overlay system for Pixi.js applications. It creates responsive popup dialogs with customizable panels, close functionality, and content areas, making it perfect for game menus, settings screens, information dialogs, and any modal interface requirements.

## Features

- Modal overlay with semi-transparent background
- Responsive panel sizing with configurable scale ratios
- Automatic centering and positioning
- Built-in close button with custom texture support
- Dedicated content area for adding custom elements
- Click-outside-to-close functionality
- Resize support for responsive layouts
- Proper Z-index management for layering
- Event handling for close actions

## Installation

Ensure you have Pixi.js installed in your project and the required assets loaded.

## Usage

The createSimplePopup function creates a PIXI.Container with a modal overlay, centered panel, and close button. The popup provides a content area where you can add your custom UI elements.

```jsx
import createSimplePopup from './path/to/createSimplePopup.js';
```

### Basic Example

Create a simple popup with default settings:

```jsx
import * as PIXI from 'pixi.js';
import createSimplePopup from './createSimplePopup.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Create a basic popup
const popup = createSimplePopup({
  width: 800,
  height: 600,
  onClose: () => {
    console.log('Popup closed');
    app.stage.removeChild(popup);
  }
});

// Add popup to stage
app.stage.addChild(popup);
```

### Advanced Example with Custom Content

Create a popup with custom content and styling:

```jsx
import * as PIXI from 'pixi.js';
import createSimplePopup from './createSimplePopup.js';
import { createText } from './createText.js';
import { createButton } from './createButton.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Create popup with custom settings
const settingsPopup = createSimplePopup({
  width: 800,
  height: 600,
  panelWidthScale: 0.7,
  panelHeightScale: 0.8,
  closeButtonTexture: 'customCloseButton',
  onClose: () => {
    console.log('Settings popup closed');
    app.stage.removeChild(settingsPopup);
  }
});

// Get the content container
const contentContainer = settingsPopup.api.getContentContainer();

// Add title
const title = createText({
  x: 0,
  y: -150,
  text: 'Game Settings',
  fontSize: 36,
  color: 0xffffff,
  fontWeight: 'bold'
});

// Add volume slider label
const volumeLabel = createText({
  x: -100,
  y: -50,
  text: 'Volume:',
  fontSize: 24,
  color: 0xffffff,
  anchor: { x: 0, y: 0.5 }
});

// Add save button
const saveButton = createButton({
  x: 0,
  y: 100,
  width: 120,
  height: 40,
  label: 'Save',
  color: 0x4CAF50,
  onClick: () => {
    console.log('Settings saved');
    app.stage.removeChild(settingsPopup);
  }
});

// Add content to popup
contentContainer.addChild(title);
contentContainer.addChild(volumeLabel);
contentContainer.addChild(saveButton);

// Add popup to stage
app.stage.addChild(settingsPopup);
```

### Responsive Popup Example

Create a popup that adapts to window resize:

```jsx
import * as PIXI from 'pixi.js';
import createSimplePopup from './createSimplePopup.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

let currentPopup = null;

const createResponsivePopup = () => {
  const popup = createSimplePopup({
    width: app.screen.width,
    height: app.screen.height,
    panelWidthScale: 0.8,
    panelHeightScale: 0.7,
    onClose: () => {
      app.stage.removeChild(popup);
      currentPopup = null;
    }
  });

  // Add some content
  const contentContainer = popup.api.getContentContainer();
  const message = createText({
    text: 'This popup adapts to screen size!',
    fontSize: 24,
    color: 0xffffff
  });
  contentContainer.addChild(message);

  return popup;
};

// Handle window resize
window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  
  if (currentPopup) {
    currentPopup.resize(app.screen.width, app.screen.height);
  }
});

// Create and show popup
currentPopup = createResponsivePopup();
app.stage.addChild(currentPopup);
```

# API Reference

## createSimplePopup(options: SimplePopupOptions): PIXI.Container

Creates a popup component as a PIXI.Container with modal overlay and content area.

Parameters

- options (Object): Configuration options for the popup. See Configuration Options for details.

Returns

- PIXI.Container: The popup container with overlay, panel, close button, and API methods.

```jsx
const popup = createSimplePopup({
  width: 800,
  height: 600,
  onClose: () => console.log('Popup closed')
});
app.stage.addChild(popup);
```

## Methods

The returned PIXI.Container has the following custom methods accessible via the `api` property:

### resize(newWidth: number, newHeight: number): void

Resizes the popup to new dimensions, updating all internal elements proportionally.

- **Parameters**:
    - newWidth (Number): New container width in pixels.
    - newHeight (Number): New container height in pixels.

```jsx
popup.resize(1024, 768); // Resize popup to new dimensions
```

---

### getContentContainer(): PIXI.Container

Returns the content container where you can add your custom UI elements.

- **Returns**: PIXI.Container - The content area container positioned at the center of the popup panel.

```jsx
const contentArea = popup.api.getContentContainer();
contentArea.addChild(myCustomElement);
```

## Direct Container Methods

The popup container also has a direct resize method:

### resize(newWidth: number, newHeight: number): void

Alternative way to resize the popup directly on the container.

```jsx
popup.resize(1024, 768); // Direct resize method
```

## Events

The popup handles several interaction events automatically:

### Background Click

Clicking on the semi-transparent background automatically triggers the `onClose` callback.

```jsx
const popup = createSimplePopup({
  width: 800,
  height: 600,
  onClose: () => {
    console.log('Popup closed by background click');
    // Handle popup closure
  }
});
```

---

### Close Button Click

The close button automatically triggers the `onClose` callback when clicked.

```jsx
const popup = createSimplePopup({
  width: 800,
  height: 600,
  closeButtonTexture: 'myCloseButton',
  onClose: () => {
    console.log('Popup closed by close button');
    // Handle popup closure
  }
});
```

---

### Panel Click Prevention

Clicking on the popup panel itself does not close the popup (event propagation is stopped).

## Configuration Options

The options object passed to createSimplePopup supports the following properties:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| width | Number | Required | Container width in pixels. Usually matches your app width. |
| height | Number | Required | Container height in pixels. Usually matches your app height. |
| onClose | Function | Required | Callback function triggered when popup should close. |
| panelWidthScale | Number | 0.9 | Panel width as a ratio of container width (0.1 to 1.0). |
| panelHeightScale | Number | 0.9 | Panel height as a ratio of container height (0.1 to 1.0). |
| closeButtonTexture | String | 'backButton' | Asset name for the close button texture. |

## Usage Tips

### Managing Popup Lifecycle

Always remove popups from the stage when closed to prevent memory leaks:

```jsx
const popup = createSimplePopup({
  width: 800,
  height: 600,
  onClose: () => {
    // Proper cleanup
    app.stage.removeChild(popup);
    popup.destroy({ children: true }); // Optional: destroy for memory cleanup
  }
});
```

### Centering Content

Content added to the content container is positioned relative to the panel center:

```jsx
const contentContainer = popup.api.getContentContainer();

// This text will be centered in the popup
const centeredText = createText({
  x: 0, // 0 is the center of the panel
  y: 0, // 0 is the center of the panel
  text: 'Centered Text',
  fontSize: 24
});

contentContainer.addChild(centeredText);
```

### Multiple Popups

Handle multiple popups with proper Z-index management:

```jsx
let popupCount = 0;

const createLayeredPopup = (content) => {
  const popup = createSimplePopup({
    width: 800,
    height: 600,
    onClose: () => {
      app.stage.removeChild(popup);
      popupCount--;
    }
  });

  // Ensure proper layering
  popup.zIndex = 1000 + popupCount;
  popupCount++;

  return popup;
};
```

### Responsive Design

Make popups adapt to different screen sizes:

```jsx
const createAdaptivePopup = () => {
  const isSmallScreen = app.screen.width < 600;

  return createSimplePopup({
    width: app.screen.width,
    height: app.screen.height,
    panelWidthScale: isSmallScreen ? 0.95 : 0.7,
    panelHeightScale: isSmallScreen ? 0.9 : 0.8,
    onClose: handleClose
  });
};
```

## Common Patterns

### Confirmation Dialog

```jsx
const createConfirmDialog = (message, onConfirm, onCancel) => {
  const popup = createSimplePopup({
    width: 800,
    height: 600,
    panelWidthScale: 0.5,
    panelHeightScale: 0.4,
    onClose: onCancel
  });

  const content = popup.api.getContentContainer();

  // Add message
  const messageText = createText({
    y: -30,
    text: message,
    fontSize: 20,
    color: 0xffffff
  });

  // Add buttons
  const confirmBtn = createButton({
    x: -60, y: 30, width: 80, height: 35,
    label: 'Yes', color: 0x4CAF50,
    onClick: () => { onConfirm(); app.stage.removeChild(popup); }
  });

  const cancelBtn = createButton({
    x: 60, y: 30, width: 80, height: 35,
    label: 'No', color: 0xf44336,
    onClick: () => { onCancel(); app.stage.removeChild(popup); }
  });

  content.addChild(messageText, confirmBtn, cancelBtn);
  return popup;
};
```
