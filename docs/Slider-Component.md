# Slider Component

The Slider component is an interactive, customizable slider control for Pixi.js applications. It provides smooth dragging functionality, custom texture support, and responsive design capabilities, making it perfect for volume controls, settings adjustments, progress indicators, and any value selection interfaces in games and applications.

## Features

- Smooth drag interaction with precise value calculation
- Custom texture support for both knob and track elements
- Configurable dimensions (width, height, knob radius)
- Normalized value range (0 to 1) for easy integration
- Visual feedback for hover and drag states
- Resize support for responsive layouts
- Event-driven architecture with onChange callbacks
- Fallback to graphics rendering when textures aren't provided
- Proper event handling with global mouse tracking

## Installation

Ensure you have Pixi.js installed in your project.

## Usage

The createSlider function creates a PIXI.Container with an interactive slider composed of a track, knob, and drag functionality.

```jsx
import { createSlider } from './path/to/createSlider.js';
```

### Basic Example

Create a simple slider with default styling:

```jsx
import * as PIXI from 'pixi.js';
import { createSlider } from './createSlider.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Create a basic slider
const volumeSlider = createSlider(
  200,                          // width
  0.5,                         // initial value (0-1)
  (value) => {                 // onChange callback
    console.log('Volume:', Math.round(value * 100) + '%');
  }
);

// Position the slider
volumeSlider.x = 300;
volumeSlider.y = 200;

// Add slider to stage
app.stage.addChild(volumeSlider);
```

### Advanced Example with Custom Textures

Create a slider with custom textures and styling:

```jsx
import * as PIXI from 'pixi.js';
import { createSlider } from './createSlider.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Load textures
const knobTexture = Assets.get('sliderKnob');
const trackTexture = Assets.get('sliderTrack');

// Create a styled slider
const settingsSlider = createSlider(
  250,                          // width
  0.75,                        // initial value
  (value) => {                 // onChange callback
    // Update game setting
    gameSettings.musicVolume = value;
    audioManager.setMusicVolume(value);
    
    // Update display
    volumeLabel.setText(`Music: ${Math.round(value * 100)}%`);
  },
  {
    knobTexture: knobTexture,
    trackTexture: trackTexture,
    height: 12,
    radius: 18
  }
);

// Position the slider
settingsSlider.x = 275;
settingsSlider.y = 300;

// Add slider to stage
app.stage.addChild(settingsSlider);
```

### Multiple Sliders Example

Create multiple sliders for different settings:

```jsx
import * as PIXI from 'pixi.js';
import { createSlider } from './createSlider.js';
import { createText } from './createText.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Settings data
const settings = {
  masterVolume: 0.8,
  musicVolume: 0.6,
  sfxVolume: 0.9,
  difficulty: 0.5
};

// Create sliders for each setting
const sliderConfigs = [
  { key: 'masterVolume', label: 'Master Volume', y: 150 },
  { key: 'musicVolume', label: 'Music Volume', y: 200 },
  { key: 'sfxVolume', label: 'SFX Volume', y: 250 },
  { key: 'difficulty', label: 'Difficulty', y: 300 }
];

sliderConfigs.forEach(config => {
  // Create label
  const label = createText({
    x: 200,
    y: config.y,
    text: config.label,
    fontSize: 18,
    color: 0xffffff,
    anchor: { x: 0, y: 0.5 }
  });

  // Create value display
  const valueDisplay = createText({
    x: 550,
    y: config.y,
    text: Math.round(settings[config.key] * 100) + '%',
    fontSize: 16,
    color: 0x00ff00,
    anchor: { x: 0, y: 0.5 }
  });

  // Create slider
  const slider = createSlider(
    200,                        // width
    settings[config.key],       // initial value
    (value) => {               // onChange callback
      settings[config.key] = value;
      valueDisplay.setText(Math.round(value * 100) + '%');
      
      // Apply setting
      switch(config.key) {
        case 'masterVolume':
          audioManager.setMasterVolume(value);
          break;
        case 'musicVolume':
          audioManager.setMusicVolume(value);
          break;
        case 'sfxVolume':
          audioManager.setSFXVolume(value);
          break;
        case 'difficulty':
          gameManager.setDifficulty(value);
          break;
      }
    },
    {
      height: 8,
      radius: 12
    }
  );

  // Position slider
  slider.x = 320;
  slider.y = config.y;

  // Add elements to stage
  app.stage.addChild(label);
  app.stage.addChild(valueDisplay);
  app.stage.addChild(slider);
});
```

### Responsive Slider Example

Create a slider that adapts to screen size changes:

```jsx
import * as PIXI from 'pixi.js';
import { createSlider } from './createSlider.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

let progressSlider;

const createResponsiveSlider = () => {
  const sliderWidth = Math.min(app.screen.width * 0.6, 400);
  
  progressSlider = createSlider(
    sliderWidth,
    0,                          // Start at 0
    (value) => {
      console.log('Progress:', Math.round(value * 100) + '%');
    },
    {
      height: app.screen.width < 600 ? 6 : 10,
      radius: app.screen.width < 600 ? 10 : 14
    }
  );

  // Center the slider
  progressSlider.x = app.screen.width / 2 - sliderWidth / 2;
  progressSlider.y = app.screen.height / 2;

  return progressSlider;
};

// Create initial slider
progressSlider = createResponsiveSlider();
app.stage.addChild(progressSlider);

// Handle window resize
window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  
  // Remove old slider
  app.stage.removeChild(progressSlider);
  
  // Create new responsive slider
  progressSlider = createResponsiveSlider();
  app.stage.addChild(progressSlider);
});

// Simulate progress
let progress = 0;
setInterval(() => {
  progress += 0.01;
  if (progress > 1) progress = 0;
  progressSlider.setValue(progress);
}, 100);
```

# API Reference

## createSlider(width: number, initialValue: number, onChange: function, options?: SliderOptions): PIXI.Container

Creates a slider component as a PIXI.Container with interactive functionality.

Parameters

- width (Number): Width of the slider track in pixels.
- initialValue (Number): Initial value between 0 and 1.
- onChange (Function): Callback function called when value changes. Receives the new value (0-1) as parameter.
- options (Object, optional): Configuration options for styling. See Configuration Options for details.

Returns

- PIXI.Container: The slider container with track, knob, and custom methods.

```jsx
const slider = createSlider(200, 0.5, (value) => console.log(value));
app.stage.addChild(slider);
```

## Methods

The returned PIXI.Container has the following custom methods:

### resize(newWidth: number, newOptions?: Partial<SliderOptions>): void

Resizes the slider and optionally updates styling options.

- **Parameters**:
    - newWidth (Number): New width for the slider track.
    - newOptions (Object, optional): Updated styling options.

```jsx
slider.resize(300, { height: 12, radius: 16 }); // Resize with new dimensions
```

---

### setValue(value: number): void

Programmatically sets the slider value without triggering the onChange callback.

- **Parameters**:
    - value (Number): New value between 0 and 1.

```jsx
slider.setValue(0.75); // Set slider to 75%
```

---

### getValue(): number

Returns the current slider value.

- **Returns**: number - Current value between 0 and 1.

```jsx
const currentValue = slider.getValue();
console.log('Current value:', currentValue); // 0.75
```

## Events

The slider handles interaction events automatically:

### Drag Events

The slider responds to pointer events for dragging:

```jsx
// The slider automatically handles these events:
// - pointerdown: Start dragging
// - pointermove: Update value while dragging (global)
// - pointerup: Stop dragging (global)
```

### Value Change Events

Value changes trigger the onChange callback:

```jsx
const slider = createSlider(200, 0.5, (newValue) => {
  console.log('Value changed to:', newValue);
  // Handle value change
});
```

## Configuration Options

The options object passed to createSlider supports the following properties:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| knobTexture | PIXI.Texture | undefined | Custom texture for the slider knob. If not provided, uses graphics. |
| trackTexture | PIXI.Texture | undefined | Custom texture for the slider track. If not provided, uses graphics. |
| height | Number | 10 | Height of the slider track in pixels. |
| radius | Number | 14 | Radius of the slider knob in pixels. |

## Default Colors

When textures are not provided, the slider uses these default colors:

- **Track Color**: `0x8B6311` (Reddish-orange)
- **Knob Color**: `0x8B6311` (Gold)

```jsx
// Slider with default graphics styling
const defaultSlider = createSlider(200, 0.5, handleChange, {
  height: 8,    // Thinner track
  radius: 12    // Smaller knob
});
```

## Usage Tips

### Audio Volume Control

Perfect for audio volume controls:

```jsx
const volumeSlider = createSlider(150, 0.8, (value) => {
  // Convert 0-1 to 0-100 for display
  const percentage = Math.round(value * 100);
  volumeDisplay.setText(`${percentage}%`);

  // Set actual audio volume
  audioContext.gain.value = value;
});
```

### Game Settings

Use for adjustable game settings:

```jsx
const difficultySlider = createSlider(200, 0.5, (value) => {
  // Map 0-1 to difficulty levels
  let difficulty;
  if (value < 0.33) difficulty = 'Easy';
  else if (value < 0.66) difficulty = 'Medium';
  else difficulty = 'Hard';

  difficultyLabel.setText(difficulty);
  gameSettings.difficulty = value;
});
```

### Progress Indicators

Use as progress bars (with setValue method):

```jsx
const progressSlider = createSlider(300, 0, () => {}, {
  height: 6,
  radius: 0 // No visible knob for progress bar
});

// Update progress
let progress = 0;
const updateProgress = () => {
  progress += 0.01;
  if (progress <= 1) {
    progressSlider.setValue(progress);
    requestAnimationFrame(updateProgress);
  }
};
updateProgress();
```

### Responsive Design

Adapt slider size to screen dimensions:

```jsx
const createResponsiveSlider = (screenWidth) => {
  const width = Math.min(screenWidth * 0.7, 400);
  const height = screenWidth < 600 ? 6 : 10;
  const radius = screenWidth < 600 ? 10 : 14;

  return createSlider(width, 0.5, handleChange, {
    height: height,
    radius: radius
  });
};
```

### Custom Styling with Textures

Use custom textures for branded appearance:

```jsx
// Load custom textures
const customKnob = Assets.get('gameKnobTexture');
const customTrack = Assets.get('gameTrackTexture');

const styledSlider = createSlider(250, 0.6, handleChange, {
  knobTexture: customKnob,
  trackTexture: customTrack,
  height: 16,  // Height affects track texture scaling
  radius: 20   // Radius affects knob texture scaling
});
```

## Common Patterns

### Settings Panel

```jsx
const createSettingsPanel = () => {
  const panel = new PIXI.Container();

  const settings = [
    { name: 'Master Volume', key: 'master', value: 0.8 },
    { name: 'Music Volume', key: 'music', value: 0.6 },
    { name: 'SFX Volume', key: 'sfx', value: 0.9 }
  ];

  settings.forEach((setting, index) => {
    const y = index * 50;

    // Label
    const label = createText({
      x: 0, y: y,
      text: setting.name,
      fontSize: 16,
      anchor: { x: 0, y: 0.5 }
    });

    // Slider
    const slider = createSlider(150, setting.value, (value) => {
      gameSettings[setting.key] = value;
      valueText.setText(Math.round(value * 100) + '%');
    });
    slider.x = 200;
    slider.y = y;

    // Value display
    const valueText = createText({
      x: 370, y: y,
      text: Math.round(setting.value * 100) + '%',
      fontSize: 14,
      anchor: { x: 0, y: 0.5 }
    });

    panel.addChild(label, slider, valueText);
  });

  return panel;
};
```
