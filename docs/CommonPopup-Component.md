# CommonPopup Component

The CommonPopup component is an advanced, feature-rich popup system for Pixi.js game applications. It extends beyond basic popup functionality to provide game-specific features like page navigation, sound integration, activity tracking, and global state management, making it ideal for game rules, settings panels, help screens, and multi-page content displays.

## Features

- **Advanced Modal System**: Semi-transparent overlay with click-outside-to-close functionality
- **Page Navigation**: Built-in previous/next buttons for multi-page content with cyclic navigation
- **Sound Integration**: Automatic UI sound effects using SoundManager
- **Activity Tracking**: Built-in user activity recording for analytics
- **Global State Management**: Integration with game state for page tracking
- **Responsive Design**: Automatic resizing and repositioning for different screen sizes
- **Texture-Based UI**: Uses game assets for consistent visual styling
- **Event Prevention**: Smart event handling to prevent accidental closes
- **Configurable Navigation**: Show/hide navigation buttons based on content type
- **Proper Z-Index Management**: Ensures popup appears above all game elements

## Installation

Ensure you have Pixi.js installed along with the required game utilities:
- SoundManager for audio feedback
- ActivityManager for user tracking
- GlobalState for state management
- Game constants and UI positioning

## Usage

The createCommonPopup function creates a comprehensive popup system with navigation, sound, and state management built-in.

```jsx
import { createCommonPopup } from './path/to/createCommonPopup.js';
```

### Basic Example - Single Page Popup

Create a simple popup without navigation:

```jsx
import * as PIXI from 'pixi.js';
import { createCommonPopup } from './createCommonPopup.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Create a single-page popup (no navigation)
const helpPopup = createCommonPopup(
  800,                    // appWidth
  600,                    // appHeight
  false,                  // multiplePages - no navigation buttons
  () => {                 // onClose callback
    console.log('Help popup closed');
    app.stage.removeChild(helpPopup);
  }
);

// Add popup to stage
app.stage.addChild(helpPopup);
```

### Advanced Example - Multi-Page Rules Popup

Create a popup with page navigation for game rules:

```jsx
import * as PIXI from 'pixi.js';
import { createCommonPopup } from './createCommonPopup.js';
import { createText } from '../commons/Text.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Rules content for different pages
const rulesContent = [
  "Welcome to the Game!\n\nThis is page 1 of the rules.",
  "Game Mechanics:\n\n- Click to spin\n- Match symbols to win\n- Higher bets = bigger wins",
  "Special Features:\n\n- Wild symbols substitute\n- Scatter symbols trigger bonus\n- Free spins available",
  "Paytable:\n\n🍒🍒🍒 = 10x\n🍋🍋🍋 = 20x\n⭐⭐⭐ = 50x"
];

let currentRulesText = null;

// Create multi-page rules popup
const rulesPopup = createCommonPopup(
  800,                    // appWidth
  600,                    // appHeight
  true,                   // multiplePages - show navigation buttons
  () => {                 // onClose callback
    console.log('Rules popup closed');
    app.stage.removeChild(rulesPopup);
  },
  () => {                 // onPageChange callback
    updateRulesContent();
    console.log('Rules page changed');
  }
);

// Function to update content based on current page
const updateRulesContent = () => {
  // Remove existing content
  if (currentRulesText) {
    rulesPopup.removeChild(currentRulesText);
  }
  
  // Get current page from GlobalState (managed by CommonPopup)
  const currentPage = GlobalState.rulesPage;
  const content = rulesContent[currentPage - 1] || rulesContent[0];
  
  // Create new content
  currentRulesText = createText({
    x: 400,
    y: 300,
    text: content,
    fontSize: 18,
    color: 0x000000,
    fontFamily: 'Arial'
  });
  
  rulesPopup.addChild(currentRulesText);
};

// Initialize with first page content
updateRulesContent();

// Add popup to stage
app.stage.addChild(rulesPopup);
```

### Settings Popup Example

Create a settings popup with custom content:

```jsx
import * as PIXI from 'pixi.js';
import { createCommonPopup } from './createCommonPopup.js';
import { createButton } from '../commons/Button.js';
import { createSlider } from '../commons/Slider.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Create settings popup
const settingsPopup = createCommonPopup(
  800,                    // appWidth
  600,                    // appHeight
  false,                  // multiplePages - single page settings
  () => {                 // onClose callback
    console.log('Settings saved and closed');
    saveSettings();
    app.stage.removeChild(settingsPopup);
  }
);

// Add settings controls to the popup
const volumeSlider = createSlider(
  200,                    // width
  0.8,                    // initial value
  (value) => {            // onChange
    gameSettings.volume = value;
    console.log('Volume:', Math.round(value * 100) + '%');
  }
);
volumeSlider.x = 400;
volumeSlider.y = 250;

const soundToggle = createButton({
  x: 400,
  y: 320,
  width: 150,
  height: 40,
  label: 'Sound: ON',
  color: 0x4CAF50,
  onClick: () => {
    gameSettings.soundEnabled = !gameSettings.soundEnabled;
    soundToggle.setLabel(`Sound: ${gameSettings.soundEnabled ? 'ON' : 'OFF'}`);
  }
});

// Add controls to popup
settingsPopup.addChild(volumeSlider);
settingsPopup.addChild(soundToggle);

// Add popup to stage
app.stage.addChild(settingsPopup);

const saveSettings = () => {
  localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
  console.log('Settings saved to localStorage');
};
```

### Responsive Popup Example

Create a popup that adapts to screen size changes:

```jsx
import * as PIXI from 'pixi.js';
import { createCommonPopup } from './createCommonPopup.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

let currentPopup = null;

const createResponsivePopup = () => {
  const popup = createCommonPopup(
    app.screen.width,
    app.screen.height,
    true,                 // Enable navigation for demo
    () => {
      app.stage.removeChild(popup);
      currentPopup = null;
    },
    () => {
      console.log('Page changed in responsive popup');
    }
  );
  
  return popup;
};

// Handle window resize
window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  
  app.renderer.resize(newWidth, newHeight);
  
  if (currentPopup) {
    // CommonPopup has built-in resize functionality
    currentPopup.resize(newWidth, newHeight);
  }
});

// Create and show popup
currentPopup = createResponsivePopup();
app.stage.addChild(currentPopup);
```

### Game Tutorial System

Create a tutorial system using CommonPopup:

```jsx
import * as PIXI from 'pixi.js';
import { createCommonPopup } from './createCommonPopup.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Tutorial steps
const tutorialSteps = [
  { title: "Welcome!", content: "Let's learn how to play!" },
  { title: "Step 1", content: "Click the spin button to start" },
  { title: "Step 2", content: "Watch the reels spin and stop" },
  { title: "Step 3", content: "Check for winning combinations" },
  { title: "Complete!", content: "You're ready to play!" }
];

class TutorialManager {
  constructor() {
    this.currentStep = 0;
    this.tutorialPopup = null;
  }
  
  startTutorial() {
    this.currentStep = 0;
    this.showTutorialPopup();
  }
  
  showTutorialPopup() {
    this.tutorialPopup = createCommonPopup(
      800, 600, true,       // Enable navigation
      () => this.closeTutorial(),
      () => this.updateTutorialContent()
    );
    
    this.updateTutorialContent();
    app.stage.addChild(this.tutorialPopup);
  }
  
  updateTutorialContent() {
    // Clear existing content
    this.tutorialPopup.children.forEach(child => {
      if (child.isTutorialContent) {
        this.tutorialPopup.removeChild(child);
      }
    });
    
    // Add current step content
    const step = tutorialSteps[GlobalState.rulesPage - 1];
    if (step) {
      const content = createText({
        x: 400, y: 300,
        text: `${step.title}\n\n${step.content}`,
        fontSize: 20,
        color: 0x000000
      });
      content.isTutorialContent = true;
      this.tutorialPopup.addChild(content);
    }
  }
  
  closeTutorial() {
    if (this.tutorialPopup) {
      app.stage.removeChild(this.tutorialPopup);
      this.tutorialPopup = null;
    }
    console.log('Tutorial completed');
  }
}

// Usage
const tutorial = new TutorialManager();
tutorial.startTutorial();
```

# API Reference

## createCommonPopup(appWidth: number, appHeight: number, multiplePages: boolean, onClose?: function, onPageChange?: function): PIXI.Container

Creates an advanced popup with navigation, sound, and state management.

Parameters

- appWidth (Number): Application width in pixels for overlay sizing
- appHeight (Number): Application height in pixels for overlay sizing  
- multiplePages (Boolean): Whether to show navigation buttons for page switching
- onClose (Function, optional): Callback triggered when popup should close
- onPageChange (Function, optional): Callback triggered when page navigation occurs

Returns

- PIXI.Container: Complete popup system with all features integrated

```jsx
const popup = createCommonPopup(800, 600, true,
  () => console.log('Closed'),
  () => console.log('Page changed')
);
app.stage.addChild(popup);
```

## Built-in Methods

The returned PIXI.Container includes these built-in methods:

### resize(newWidth: number, newHeight: number): void

Resizes the popup and all its components to new dimensions.

- **Parameters**:
    - newWidth (Number): New application width
    - newHeight (Number): New application height

```jsx
popup.resize(1024, 768); // Resize for new screen dimensions
```

## Built-in Components

The CommonPopup automatically includes these components:

### Background Overlay

- **Color**: Semi-transparent black (0x000000, alpha: 0.6)
- **Functionality**: Click-to-close behavior
- **Coverage**: Full screen overlay

### Main Panel

- **Texture**: Uses 'commonPopup' asset
- **Size**: 80% of screen dimensions
- **Position**: Centered on screen
- **Background**: Textured using game assets

### Close Button

- **Texture**: Uses 'closeButton' asset
- **Position**: Top-right of popup panel
- **Sound**: Plays UI click sound on interaction
- **Tracking**: Records user activity for analytics

### Navigation Buttons (when multiplePages = true)

#### Previous Button
- **Texture**: Uses 'previousButton' asset
- **Position**: Left side of popup
- **Functionality**: Cycles to previous page (wraps to last page from first)

#### Next Button
- **Texture**: Uses 'nextButton' asset
- **Position**: Right side of popup
- **Functionality**: Cycles to next page (wraps to first page from last)

## Global State Integration

The CommonPopup integrates with GlobalState for page management:

### Page Tracking

```jsx
// Current page is automatically managed
console.log('Current page:', GlobalState.rulesPage);

// Page changes are handled automatically
// Pages cycle from 1 to TOTAL_RULE_PAGES
```

### State Persistence

```jsx
// Page state persists across popup sessions
const popup1 = createCommonPopup(800, 600, true, onClose);
// User navigates to page 3
popup1.close();

const popup2 = createCommonPopup(800, 600, true, onClose);
// Opens on page 3 (state preserved)
```

## Sound Integration

Automatic sound effects are played for user interactions:

```jsx
// These sounds are played automatically:
// - Close button click: SoundManager.playUIClick()
// - Previous button click: SoundManager.playUIClick()
// - Next button click: SoundManager.playUIClick()
```

## Activity Tracking

User interactions are automatically recorded:

```jsx
// These activities are tracked automatically:
// - Close button: { buttonName: 'closeButton' }
// - Previous button: { buttonName: 'previousButton' }
// - Next button: { buttonName: 'nextButton' }
```

## Configuration Constants

The popup uses these configuration constants:

| Constant | Purpose | Default Location |
| --- | --- | --- |
| UI_POS.SETTINGS_POPUP_WIDTH | Popup width ratio | UI positioning constants |
| UI_POS.SETTINGS_POPUP_HEIGHT | Popup height ratio | UI positioning constants |
| UI_POS.CLOSE_BUTTON_X | Close button X position | UI positioning constants |
| UI_POS.CLOSE_BUTTON_Y | Close button Y position | UI positioning constants |
| UI_POS.NAVIGATION_BUTTON_X | Nav button X offset | UI positioning constants |
| UI_POS.NAVIGATION_BUTTON_WIDTH | Nav button width ratio | UI positioning constants |
| UI_POS.NAVIGATION_BUTTON_HEIGHT | Nav button height ratio | UI positioning constants |
| Z_INDEX.POPUP_OVERLAY | Popup layer order | Z-index constants |
| TOTAL_RULE_PAGES | Maximum page count | Game constants |

## Required Assets

The CommonPopup requires these assets to be loaded:

```jsx
// Required textures
await Assets.load([
  'commonPopup',      // Main popup background
  'closeButton',      // Close button texture
  'previousButton',   // Previous page button
  'nextButton'        // Next page button
]);
```

## Event Handling

### Click Prevention

The popup prevents accidental closes:

```jsx
// Clicking on popup content does NOT close popup
settingsPopup.container.on('pointerdown', (e) => {
  e.stopPropagation(); // Prevents bubbling to background
});

// Only clicking on background overlay closes popup
backgroundOverlay.on('pointerdown', onClose);
```

### Page Navigation Logic

```jsx
// Navigation handles edge cases automatically:
// - Page < 1: Wraps to last page (TOTAL_RULE_PAGES)
// - Page > TOTAL_RULE_PAGES: Wraps to first page (1)
// - Updates GlobalState.rulesPage
// - Triggers onPageChange callback
```

## Usage Tips

### Content Management

Add content to the popup container directly:

```jsx
const popup = createCommonPopup(800, 600, false, onClose);

// Add your content
const title = createText({
  x: 400, y: 200,
  text: 'Settings',
  fontSize: 32,
  color: 0x000000
});

popup.addChild(title);
```

### Multi-Page Content

Manage different content for each page:

```jsx
const pageContent = {
  1: () => createRulesPage1(),
  2: () => createRulesPage2(),
  3: () => createRulesPage3()
};

const popup = createCommonPopup(800, 600, true, onClose, () => {
  // Clear existing content
  popup.removeChildren(/* content children only */);

  // Add new page content
  const currentPage = GlobalState.rulesPage;
  const content = pageContent[currentPage]();
  popup.addChild(content);
});
```

### Responsive Integration

Handle screen size changes:

```jsx
let gamePopup = null;

const showGamePopup = () => {
  gamePopup = createCommonPopup(
    app.screen.width,
    app.screen.height,
    true,
    () => { gamePopup = null; }
  );
  app.stage.addChild(gamePopup);
};

window.addEventListener('resize', () => {
  if (gamePopup) {
    gamePopup.resize(app.screen.width, app.screen.height);
  }
});
```

## Common Patterns

### Settings Panel

```jsx
const createSettingsPanel = () => {
  const popup = createCommonPopup(800, 600, false, saveAndClose);

  // Add settings controls
  const controls = createSettingsControls();
  popup.addChild(controls);

  return popup;
};
```

### Help System

```jsx
const createHelpSystem = (helpPages) => {
  const popup = createCommonPopup(800, 600, true, onClose, updateHelp);

  const updateHelp = () => {
    const page = GlobalState.rulesPage;
    const content = helpPages[page - 1];
    // Update content based on current page
  };

  return popup;
};
```

### Tutorial Flow

```jsx
const createTutorial = () => {
  return createCommonPopup(800, 600, true,
    () => completeTutorial(),
    () => updateTutorialStep()
  );
};
```
