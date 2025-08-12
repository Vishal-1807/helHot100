import { Container, Assets, Texture } from 'pixi.js';
import createSlider from '../components/commons/Slider';

/**
 * Examples demonstrating the Slider component with texture support
 */

// Example 1: Basic slider without textures (default graphics)
export const createBasicSlider = (appWidth: number, appHeight: number): Container => {
  const container = new Container();
  
  const slider = createSlider(
    200, // width
    0.5, // initial value (50%)
    (value: number) => {
      console.log('Basic slider value changed:', value);
    }
  );
  
  slider.x = appWidth * 0.5 - 100; // Center horizontally
  slider.y = appHeight * 0.3;
  
  container.addChild(slider);
  return container;
};

// Example 2: Slider with custom knob texture and custom dimensions
export const createSliderWithKnobTexture = (appWidth: number, appHeight: number): Container => {
  const container = new Container();

  // Get a texture from loaded assets (you can use any loaded texture)
  const knobTexture = Assets.get('spinButton'); // Using spin button texture as knob

  const slider = createSlider(
    200, // width
    0.3, // initial value (30%)
    (value: number) => {
      console.log('Textured knob slider value changed:', value);
    },
    {
      knobTexture: knobTexture,
      height: 15, // Custom track height
      radius: 20  // Custom knob radius
    }
  );

  slider.x = appWidth * 0.5 - 100; // Center horizontally
  slider.y = appHeight * 0.5;

  container.addChild(slider);
  return container;
};

// Example 3: Slider with custom track texture and thin design
export const createSliderWithTrackTexture = (appWidth: number, appHeight: number): Container => {
  const container = new Container();

  // Get a texture from loaded assets
  const trackTexture = Assets.get('valueBar'); // Using value bar texture as track

  const slider = createSlider(
    200, // width
    0.7, // initial value (70%)
    (value: number) => {
      console.log('Textured track slider value changed:', value);
    },
    {
      trackTexture: trackTexture,
      height: 6,  // Thinner track
      radius: 10  // Smaller knob
    }
  );

  slider.x = appWidth * 0.5 - 100; // Center horizontally
  slider.y = appHeight * 0.7;

  container.addChild(slider);
  return container;
};

// Example 4: Slider with both knob and track textures and custom dimensions
export const createFullyTexturedSlider = (appWidth: number, appHeight: number): Container => {
  const container = new Container();

  // Get textures from loaded assets
  const knobTexture = Assets.get('autoSpinButton'); // Using auto spin button as knob
  const trackTexture = Assets.get('balanceTab'); // Using balance tab as track

  const slider = createSlider(
    250, // width
    0.8, // initial value (80%)
    (value: number) => {
      console.log('Fully textured slider value changed:', value);
    },
    {
      knobTexture: knobTexture,
      trackTexture: trackTexture,
      height: 20, // Thick track
      radius: 25  // Large knob
    }
  );

  slider.x = appWidth * 0.5 - 125; // Center horizontally
  slider.y = appHeight * 0.9;

  container.addChild(slider);
  return container;
};

// Example 5: Multiple sliders with different configurations and dimensions
export const createMultipleSliders = (appWidth: number, appHeight: number): Container => {
  const container = new Container();

  // Volume slider with knob texture - compact design
  const volumeSlider = createSlider(
    150,
    0.6,
    (value: number) => {
      console.log('Volume:', Math.round(value * 100) + '%');
    },
    {
      knobTexture: Assets.get('settings'),
      height: 8,
      radius: 12
    }
  );
  volumeSlider.x = appWidth * 0.2;
  volumeSlider.y = appHeight * 0.4;

  // Brightness slider with track texture - medium design
  const brightnessSlider = createSlider(
    150,
    0.4,
    (value: number) => {
      console.log('Brightness:', Math.round(value * 100) + '%');
    },
    {
      trackTexture: Assets.get('valueBar'),
      height: 12,
      radius: 16
    }
  );
  brightnessSlider.x = appWidth * 0.8 - 150;
  brightnessSlider.y = appHeight * 0.4;

  // Speed slider with both textures - large design
  const speedSlider = createSlider(
    180,
    0.5,
    (value: number) => {
      console.log('Speed:', Math.round(value * 100) + '%');
    },
    {
      knobTexture: Assets.get('home'),
      trackTexture: Assets.get('balanceTab'),
      height: 18,
      radius: 22
    }
  );
  speedSlider.x = appWidth * 0.5 - 90;
  speedSlider.y = appHeight * 0.6;

  container.addChild(volumeSlider);
  container.addChild(brightnessSlider);
  container.addChild(speedSlider);

  return container;
};

/**
 * Usage example in your main game:
 *
 * // In your main game initialization:
 * const sliderExamples = createMultipleSliders(app.screen.width, app.screen.height);
 * app.stage.addChild(sliderExamples);
 *
 * // Or create individual sliders with custom dimensions:
 * const mySlider = createSlider(200, 0.5, (value) => {
 *   console.log('Slider value:', value);
 * }, {
 *   knobTexture: Assets.get('myKnobTexture'),
 *   trackTexture: Assets.get('myTrackTexture'),
 *   height: 15,  // Custom track height
 *   radius: 18   // Custom knob radius
 * });
 *
 * // Compact slider for mobile:
 * const compactSlider = createSlider(120, 0.3, (value) => {
 *   console.log('Compact slider:', value);
 * }, {
 *   height: 6,   // Thin track
 *   radius: 10   // Small knob
 * });
 *
 * // Large slider for desktop:
 * const largeSlider = createSlider(300, 0.7, (value) => {
 *   console.log('Large slider:', value);
 * }, {
 *   knobTexture: Assets.get('largeKnob'),
 *   trackTexture: Assets.get('largeTrack'),
 *   height: 25,  // Thick track
 *   radius: 30   // Large knob
 * });
 *
 * // Resize slider when screen size changes:
 * const resizeSlider = (newScreenWidth: number, newScreenHeight: number) => {
 *   const newSliderWidth = newScreenWidth * 0.6; // 60% of screen width
 *   (mySlider as any).resize(newSliderWidth, {
 *     height: newScreenHeight * 0.02,  // 2% of screen height
 *     radius: newScreenHeight * 0.015, // 1.5% of screen height
 *     knobTexture: Assets.get('myKnobTexture'),
 *     trackTexture: Assets.get('myTrackTexture')
 *   });
 * };
 */
