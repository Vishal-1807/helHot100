import { Container, Graphics, Texture, Sprite } from 'pixi.js';

interface SliderOptions {
  knobTexture?: Texture;
  trackTexture?: Texture;
  height?: number;
  radius?: number;
}

function createSlider(
  width: number,
  initialValue: number,
  onChange: (value: number) => void,
  options: SliderOptions = {}
): Container {
  const slider = new Container();
  const { knobTexture, trackTexture, height = 10, radius = 14 } = options;

  const trackColor = 0x8B6311; // Reddish-orange color for track
  const knobColor = 0x8B6311; // Gold color for knob

  // Track - use texture if provided, otherwise use graphics
  let track: Graphics | Sprite;
  if (trackTexture) {
    track = new Sprite(trackTexture);
    track.width = width;
    track.height = height;
  } else {
    track = new Graphics();
    track.roundRect(0, 0, width, height, height/2);
    track.fill({ color: trackColor });
  }
  slider.addChild(track);

  // Knob - use texture if provided, otherwise use graphics with gold border
  let knob: Graphics | Sprite;
  let baseKnobScale = 1; // Store the base scale for textured knobs

  if (knobTexture) {
    knob = new Sprite(knobTexture);
    knob.anchor.set(0.5, 0.5);

    // Scale the sprite to match the desired radius
    // The desired diameter is radius * 2, so we scale to fit that size
    const desiredDiameter = radius * 2;
    const originalSize = Math.max(knob.width, knob.height); // Use the larger dimension
    baseKnobScale = desiredDiameter / originalSize;
    knob.scale.set(baseKnobScale);
  } else {
    knob = new Graphics();
    knob.circle(0, 0, radius);
    knob.fill({ color: knobColor });
    knob.stroke({ color: 0xCAAD28, width: 3 });
  }
  knob.y = height / 2;
  slider.addChild(knob);

  knob.eventMode = 'static';
  knob.cursor = 'pointer';

  // Set initial position
  const setKnobX = (value: number) => {
    knob.x = Math.max(0, Math.min(width, value * width));
  };

  setKnobX(initialValue);

  // Drag logic
  let dragging = false;

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return;

    // Get the global position of the slider
    const globalPos = slider.getGlobalPosition();

    // Calculate the local X position relative to the slider
    // Use clientX for better cross-browser compatibility
    const localX = e.clientX - globalPos.x;

    // Constrain the position to the slider width
    const constrainedX = Math.max(0, Math.min(width, localX));

    // Calculate the normalized value (0-1)
    const value = constrainedX / width;

    // Update the knob position
    setKnobX(value);

    // Trigger the onChange callback with the new value
    onChange(value);
  };

  // Function to update knob appearance based on dragging state
  const updateKnobAppearance = (isDragging: boolean) => {
    if (knobTexture) {
      // For textured knobs, scale relative to the base scale
      if (isDragging) {
        knob.scale.set(baseKnobScale * 1.1); // 10% larger when dragging
        knob.alpha = 0.8; // Slightly transparent when dragging
      } else {
        knob.scale.set(baseKnobScale); // Return to base scale
        knob.alpha = 1;
      }
    } else {
      // For graphics knobs, redraw with different appearance
      const graphicsKnob = knob as Graphics;
      if (isDragging) {
        // Make the knob slightly larger and brighter when dragging
        graphicsKnob.clear();
        graphicsKnob.circle(0, 0, radius * 1.1);
        graphicsKnob.fill({ color: 0xCAAD28 }); // Brighter fill
        graphicsKnob.stroke({ color: 0xCAAD28, width: 3 }); // Brighter gold border
      } else {
        // Return to normal appearance
        graphicsKnob.clear();
        graphicsKnob.circle(0, 0, radius);
        graphicsKnob.fill({ color: knobColor });
        graphicsKnob.stroke({ color: 0xCAAD28, width: 3 });
      }
    }
  };

  const stopDrag = () => {
    dragging = false;
    updateKnobAppearance(false);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', stopDrag);
  };

  // Allow clicking on the knob to start dragging
  knob.on('pointerdown', () => {
    dragging = true;
    updateKnobAppearance(true); // Update appearance when dragging starts
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDrag);
  });

  // Allow clicking directly on the track to set the value
  track.eventMode = 'static';
  track.cursor = 'pointer';
  track.on('pointerdown', (e) => {
    // Get the global position of the slider
    const globalPos = slider.getGlobalPosition();
    // Calculate the local X position relative to the slider
    const localX = e.global.x - globalPos.x;
    // Calculate the value based on the click position
    let value = Math.max(0, Math.min(1, localX / width));
    // Update the knob position
    setKnobX(value);
    // Trigger the onChange callback
    onChange(value);

    // Move the knob to the clicked position
    knob.x = Math.max(0, Math.min(width, localX));

    // Start dragging from this point
    dragging = true;
    updateKnobAppearance(true); // Update appearance when dragging starts
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDrag);
  });

  // Add resize method to the slider container
  (slider as any).resize = (newWidth: number, newOptions: Partial<SliderOptions> = {}) => {
    const newHeight = newOptions.height || height;
    const newRadius = newOptions.radius || radius;
    const newKnobTexture = newOptions.knobTexture || knobTexture;
    const newTrackTexture = newOptions.trackTexture || trackTexture;

    // Get current value before changing width
    const currentValue = knob.x / width;

    // Update width reference
    width = newWidth;

    // Resize track
    if (newTrackTexture) {
      (track as Sprite).width = newWidth;
      (track as Sprite).height = newHeight;
    } else {
      const graphicsTrack = track as Graphics;
      graphicsTrack.clear();
      graphicsTrack.roundRect(0, 0, newWidth, newHeight, newHeight/2);
      graphicsTrack.fill({ color: trackColor });
    }

    // Resize knob
    if (newKnobTexture) {
      const spriteKnob = knob as Sprite;
      const desiredDiameter = newRadius * 2;
      const originalSize = Math.max(spriteKnob.texture.width, spriteKnob.texture.height);
      baseKnobScale = desiredDiameter / originalSize;
      knob.scale.set(baseKnobScale);
    } else {
      const graphicsKnob = knob as Graphics;
      graphicsKnob.clear();
      graphicsKnob.circle(0, 0, newRadius);
      graphicsKnob.fill({ color: knobColor });
      graphicsKnob.stroke({ color: 0xCAAD28, width: 3 });
    }

    // Update knob Y position
    knob.y = newHeight / 2;

    // Maintain current slider value position using the saved value
    setKnobX(currentValue); // This will use the new width
  };

  return slider;
}

export default createSlider;