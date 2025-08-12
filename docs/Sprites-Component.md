# Sprites Component

The Sprites component is a powerful animated sprite creation system for Pixi.js applications. It creates animated sprites from loaded spritesheets with comprehensive customization options, making it perfect for character animations, UI effects, game objects, and any animated visual elements in your applications.

## Features

- Animated sprite creation from loaded PIXI spritesheets
- Comprehensive positioning and sizing options
- Animation control (speed, looping, autoplay)
- Flexible scaling with uniform or dimension-specific sizing
- Automatic centering capabilities with PIXI Application integration
- Custom anchor point positioning
- Specific animation selection from multi-animation spritesheets
- Synchronous creation from pre-loaded assets
- Fallback texture handling for missing animations

## Installation

Ensure you have Pixi.js installed in your project and spritesheets properly loaded using PIXI's Assets system.

## Usage

The createSpriteFromLoadedAssets function creates animated sprites from pre-loaded spritesheets. It returns a PIXI.AnimatedSprite synchronously.

```typescript
import { createSpriteFromLoadedAssets } from './path/to/Sprites.js';
```

### Basic Example

Create a simple animated sprite with default settings:

```typescript
import * as PIXI from 'pixi.js';
import { createSpriteFromLoadedAssets } from './Sprites.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Load spritesheet first
await PIXI.Assets.load('coinAnimation.json');

// Create animated sprite (synchronous)
const coinSprite = createSpriteFromLoadedAssets('coinAnimation');

// Position and add to stage
coinSprite.x = 400;
coinSprite.y = 300;
app.stage.addChild(coinSprite);
```

### Advanced Example with Custom Options

Create a sprite with specific positioning, sizing, and animation settings:

```typescript
import * as PIXI from 'pixi.js';
import { createSpriteFromLoadedAssets } from './Sprites.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Load spritesheets
await PIXI.Assets.load([
  'characterWalk.json',
  'explosionEffect.json'
]);

// Create character sprite (synchronous)
const characterSprite = createSpriteFromLoadedAssets(
  'characterWalk',
  {
    x: 100,
    y: 400,
    scale: 1.5,
    animationSpeed: 0.3,
    loop: true,
    autoplay: true,
    anchor: 0.5
  }
);

// Create explosion effect (synchronous)
const explosionSprite = createSpriteFromLoadedAssets(
  'explosionEffect',
  {
    x: 500,
    y: 200,
    width: 120,
    height: 120,
    animationSpeed: 0.8,
    loop: false,
    autoplay: false,
    anchor: 0.5
  }
);

// Add sprites to stage
app.stage.addChild(characterSprite);
app.stage.addChild(explosionSprite);

// Trigger explosion on click
explosionSprite.interactive = true;
explosionSprite.cursor = 'pointer';
explosionSprite.on('pointerdown', () => {
  explosionSprite.gotoAndPlay(0);
});
```

### Multi-Animation Spritesheet Example

Work with spritesheets containing multiple animations:

```typescript
import * as PIXI from 'pixi.js';
import { createSpriteFromLoadedAssets } from './Sprites.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Load character spritesheet with multiple animations
await PIXI.Assets.load('characterAnimations.json');

// Create character with idle animation (synchronous)
const character = createSpriteFromLoadedAssets(
  'characterAnimations',
  {
    x: 400,
    y: 300,
    scale: 2,
    animationSpeed: 0.2,
    animationName: 'idle', // Specific animation
    loop: true,
    autoplay: true
  }
);

app.stage.addChild(character);

// Animation state management
let currentState = 'idle';
const animations = ['idle', 'walk', 'run', 'jump'];

// Switch animations with keyboard
window.addEventListener('keydown', (event) => {
  let newState = currentState;

  switch(event.key) {
    case 'ArrowLeft':
    case 'ArrowRight':
      newState = 'walk';
      character.scale.x = event.key === 'ArrowLeft' ? -2 : 2; // Flip sprite
      break;
    case 'Shift':
      newState = 'run';
      break;
    case ' ':
      newState = 'jump';
      break;
    default:
      newState = 'idle';
  }

  if (newState !== currentState) {
    currentState = newState;

    // Get animation textures
    const sheet = PIXI.Assets.get('characterAnimations');
    const animationTextures = sheet.animations[newState];

    if (animationTextures) {
      character.textures = animationTextures;
      character.gotoAndPlay(0);
    }
  }
});
```

### Centered Sprite with Application Integration

Create sprites that automatically center on screen:

```typescript
import * as PIXI from 'pixi.js';
import { createSpriteFromLoadedAssets } from './Sprites.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Load logo animation
await PIXI.Assets.load('logoAnimation.json');

// Create centered logo sprite (synchronous)
const logoSprite = createSpriteFromLoadedAssets(
  'logoAnimation',
  {
    scale: 3,
    animationSpeed: 0.1,
    loop: true,
    autoplay: true,
    center: true // Automatically center on screen
  },
  app // Pass app for centering calculations
);

app.stage.addChild(logoSprite);

// Handle window resize to maintain centering
window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  logoSprite.x = app.screen.width / 2;
  logoSprite.y = app.screen.height / 2;
});
```

### Dynamic Sprite Loading and Management

Create a system for loading and managing multiple sprites:

```typescript
import * as PIXI from 'pixi.js';
import { createSpriteFromLoadedAssets } from './Sprites.js';

// Create a Pixi.js application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view.asCanvas);

// Sprite configurations
const spriteConfigs = [
  {
    name: 'coin',
    asset: 'coinSpin.json',
    options: { scale: 0.8, animationSpeed: 0.4 }
  },
  {
    name: 'gem',
    asset: 'gemGlow.json',
    options: { scale: 1.2, animationSpeed: 0.2 }
  },
  {
    name: 'powerup',
    asset: 'powerupPulse.json',
    options: { scale: 1.5, animationSpeed: 0.6, loop: false }
  }
];

// Load all assets
const assetPaths = spriteConfigs.map(config => config.asset);
await PIXI.Assets.load(assetPaths);

// Create sprite factory
const createGameSprite = (configName: string, x: number, y: number) => {
  const config = spriteConfigs.find(c => c.name === configName);
  if (!config) throw new Error(`Sprite config '${configName}' not found`);

  const sprite = createSpriteFromLoadedAssets(
    config.asset.replace('.json', ''), // Remove extension for asset name
    {
      x: x,
      y: y,
      ...config.options
    }
  );

  return sprite;
};

// Create sprites at random positions
const sprites = [];
for (let i = 0; i < 10; i++) {
  const configName = spriteConfigs[Math.floor(Math.random() * spriteConfigs.length)].name;
  const x = Math.random() * app.screen.width;
  const y = Math.random() * app.screen.height;

  const sprite = createGameSprite(configName, x, y);
  sprites.push(sprite);
  app.stage.addChild(sprite);
}

// Animate sprites
app.ticker.add(() => {
  sprites.forEach(sprite => {
    sprite.rotation += 0.01;
    sprite.y += Math.sin(Date.now() * 0.001 + sprite.x * 0.01) * 0.5;
  });
});
```

# API Reference

## createSpriteFromLoadedAssets(jsonName: string, options?: SpriteOptions, app?: PIXI.Application): PIXI.AnimatedSprite

Creates an animated sprite from a loaded spritesheet.

Parameters

- jsonName (String): Name of the loaded spritesheet asset (without .json extension).
- options (Object, optional): Configuration options for the sprite. See Configuration Options for details.
- app (PIXI.Application, optional): PIXI Application instance for automatic centering when center option is true.

Returns

- PIXI.AnimatedSprite: The created animated sprite.

```typescript
const sprite = createSpriteFromLoadedAssets('myAnimation', {
  x: 100,
  y: 100,
  scale: 1.5
});
app.stage.addChild(sprite);
```

## Standard PIXI.AnimatedSprite Methods

The returned AnimatedSprite has all standard PIXI.AnimatedSprite methods:

### play(): void

Starts the animation.

```typescript
sprite.play();
```

---

### stop(): void

Stops the animation.

```typescript
sprite.stop();
```

---

### gotoAndPlay(frameNumber: number): void

Goes to a specific frame and starts playing.

- **Parameters**:
    - frameNumber (Number): Frame index to start from.

```typescript
sprite.gotoAndPlay(0); // Start from beginning
```

---

### gotoAndStop(frameNumber: number): void

Goes to a specific frame and stops.

- **Parameters**:
    - frameNumber (Number): Frame index to go to.

```typescript
sprite.gotoAndStop(5); // Go to frame 5 and stop
```

## Properties

### animationSpeed: number

Controls the speed of the animation.

```typescript
sprite.animationSpeed = 0.5; // Slower animation
sprite.animationSpeed = 2.0; // Faster animation
```

---

### loop: boolean

Controls whether the animation loops.

```typescript
sprite.loop = false; // Play once
sprite.loop = true;  // Loop continuously
```

---

### textures: PIXI.Texture[]

Array of textures for the animation.

```typescript
// Change animation by changing textures
const sheet = PIXI.Assets.get('characterAnimations');
sprite.textures = sheet.animations['walk'];
```

## Configuration Options

The options object passed to createSpriteFromLoadedAssets supports the following properties:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| x | Number | undefined | X position of the sprite. If not provided, sprite position is not set. |
| y | Number | undefined | Y position of the sprite. If not provided, sprite position is not set. |
| width | Number | undefined | Specific width for the sprite. Overrides scale if provided. |
| height | Number | undefined | Specific height for the sprite. Overrides scale if provided. |
| scale | Number | 1 | Uniform scale factor for the sprite. Ignored if width/height are provided. |
| animationSpeed | Number | 0.5 | Speed of the animation. Higher values = faster animation. |
| loop | Boolean | true | Whether the animation should loop continuously. |
| autoplay | Boolean | true | Whether to start playing the animation immediately. |
| anchor | Number | 0.5 | Anchor point for the sprite (0-1). 0.5 centers the sprite on its position. |
| animationName | String | undefined | Specific animation name from multi-animation spritesheets. |
| center | Boolean | false | If true and app is provided, centers sprite on screen. |

## Events

PIXI.AnimatedSprite supports standard PIXI events:

### complete

Fired when a non-looping animation completes.

```typescript
sprite.onComplete = () => {
  console.log('Animation finished!');
  // Handle animation completion
};

// Or using event listeners
sprite.on('complete', () => {
  console.log('Animation complete!');
});
```

---

### framechange

Fired when the animation frame changes.

```typescript
sprite.on('framechange', (currentFrame) => {
  console.log('Current frame:', currentFrame);
});
```

---

### loop

Fired each time a looping animation completes a cycle.

```typescript
sprite.on('loop', () => {
  console.log('Animation loop completed');
});
```

## Usage Tips

### Asset Loading

Always load spritesheets before creating sprites:

```typescript
// Load single asset
await PIXI.Assets.load('myAnimation.json');

// Load multiple assets
await PIXI.Assets.load([
  'character.json',
  'effects.json',
  'ui.json'
]);

// Then create sprites (synchronous)
const sprite = createSpriteFromLoadedAssets('myAnimation');
```

### Animation State Management

Manage different animation states effectively:

```typescript
class AnimatedCharacter {
  private spritesheetName: string;
  private currentState: string;
  public sprite: PIXI.AnimatedSprite | null;

  constructor(spritesheetName: string) {
    this.spritesheetName = spritesheetName;
    this.currentState = 'idle';
    this.sprite = null;
  }

  init() {
    this.sprite = createSpriteFromLoadedAssets(this.spritesheetName, {
      animationName: 'idle',
      scale: 2,
      autoplay: true
    });
  }

  changeState(newState: string) {
    if (this.currentState === newState || !this.sprite) return;

    this.currentState = newState;
    const sheet = PIXI.Assets.get(this.spritesheetName);

    if (sheet.animations[newState]) {
      this.sprite.textures = sheet.animations[newState];
      this.sprite.gotoAndPlay(0);
    }
  }
}
```

### Performance Optimization

Reuse textures and manage sprite lifecycle:

```typescript
// Create sprite pool for frequently used animations
class SpritePool {
  private spritesheetName: string;
  private available: PIXI.AnimatedSprite[];
  private inUse: PIXI.AnimatedSprite[];
  private poolSize: number;

  constructor(spritesheetName: string, poolSize = 10) {
    this.spritesheetName = spritesheetName;
    this.available = [];
    this.inUse = [];
    this.poolSize = poolSize;
  }

  init() {
    for (let i = 0; i < this.poolSize; i++) {
      const sprite = createSpriteFromLoadedAssets(this.spritesheetName, {
        autoplay: false
      });
      sprite.visible = false;
      this.available.push(sprite);
    }
  }

  getSprite(): PIXI.AnimatedSprite | null {
    if (this.available.length === 0) return null;

    const sprite = this.available.pop()!;
    this.inUse.push(sprite);
    sprite.visible = true;
    return sprite;
  }

  returnSprite(sprite: PIXI.AnimatedSprite) {
    const index = this.inUse.indexOf(sprite);
    if (index > -1) {
      this.inUse.splice(index, 1);
      this.available.push(sprite);
      sprite.visible = false;
      sprite.stop();
    }
  }
}
```

### Responsive Sprites

Create sprites that adapt to screen size:

```typescript
const createResponsiveSprite = (assetName: string, app: PIXI.Application) => {
  const baseScale = Math.min(app.screen.width / 800, app.screen.height / 600);

  const sprite = createSpriteFromLoadedAssets(assetName, {
    scale: baseScale,
    center: true
  }, app);

  return sprite;
};
```

## Common Patterns

### UI Animation Effects

```typescript
const createUIEffect = (effectName: string, x: number, y: number, onComplete?: () => void) => {
  const effect = createSpriteFromLoadedAssets(effectName, {
    x: x,
    y: y,
    scale: 1.5,
    loop: false,
    autoplay: true
  });

  effect.onComplete = () => {
    if (onComplete) onComplete();
    effect.parent?.removeChild(effect);
    effect.destroy();
  };

  return effect;
};

// Usage
const clickEffect = createUIEffect('clickBurst', 200, 150, () => {
  console.log('Click effect finished');
});
app.stage.addChild(clickEffect);
```

### Character Animation System

```typescript
const createCharacter = (x: number, y: number) => {
  const character = createSpriteFromLoadedAssets('characterSheet', {
    x: x,
    y: y,
    animationName: 'idle',
    scale: 2
  });

  // Add custom methods
  (character as any).setState = (state: string) => {
    const sheet = PIXI.Assets.get('characterSheet');
    if (sheet.animations[state]) {
      character.textures = sheet.animations[state];
      character.gotoAndPlay(0);
    }
  };

  (character as any).moveTo = (targetX: number, targetY: number) => {
    (character as any).setState('walk');
    // Add movement logic here
  };

  return character;
};
```
