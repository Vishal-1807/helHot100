import { Assets, Container } from 'pixi.js';
import { Z_INDEX } from '../../constants/ZIndex';
import createSlider from '../../commons/Slider';
import { UI_POS } from '../../constants/Positions';
import { createButton } from '../../commons';

export const createAudioSettings = (settingsContainer: Container): Container => {
  const container = new Container();
  container.zIndex = Z_INDEX.MODAL_OVERLAY;

  const bgVolumeButton = createButton({
    x: UI_POS.AUDIO_BUTTON_X_RATIO * settingsContainer.width,
    y: UI_POS.AUDIO_BUTTON_Y_RATIO * settingsContainer.height,
    width: settingsContainer.height * UI_POS.AUDIO_BUTTON_WIDTH_RATIO,
    height: settingsContainer.height * UI_POS.AUDIO_BUTTON_HEIGHT_RATIO,
    texture: Assets.get('musicButton'),
  });
  container.addChild(bgVolumeButton);

  const bgVolumeSlider = createSlider(
    settingsContainer.width * UI_POS.AUDIO_SLIDER_WIDTH_RATIO,
    0.02,
    (value: number) => {
      console.log('Background Volume:', Math.round(value * 100) + '%');
    },
    {
      knobTexture: Assets.get('audioKnob'),
      trackTexture: Assets.get('audioTrack'),
      height: settingsContainer.height * UI_POS.AUDIO_SLIDER_HEIGHT_RATIO,
      radius: settingsContainer.height * UI_POS.AUDIO_SLIDER_RADIUS_RATIO
    }
  );
  bgVolumeSlider.x = UI_POS.AUDIO_SLIDER_X_RATIO * settingsContainer.width;
  bgVolumeSlider.y = UI_POS.AUDIO_SLIDER_Y_RATIO * settingsContainer.height;
  container.addChild(bgVolumeSlider);

  const sfxVolumeButton = createButton({
    x: UI_POS.AUDIO_BUTTON_X_RATIO * settingsContainer.width,
    y: (UI_POS.AUDIO_BUTTON_Y_RATIO + UI_POS.VERTICAL_GAP_BETWEEN_SLIDERS) * settingsContainer.height,
    width: settingsContainer.height * UI_POS.AUDIO_BUTTON_WIDTH_RATIO,
    height: settingsContainer.height * UI_POS.AUDIO_BUTTON_HEIGHT_RATIO,
    texture: Assets.get('soundButton'),
  });
  container.addChild(sfxVolumeButton);

  const sfxVolumeSlider = createSlider(
    settingsContainer.width * UI_POS.AUDIO_SLIDER_WIDTH_RATIO,
    0.02,
    (value: number) => {
      console.log('SFX Volume:', Math.round(value * 100) + '%');
    },
    {
      knobTexture: Assets.get('audioKnob'),
      trackTexture: Assets.get('audioTrack'),
      height: settingsContainer.height * UI_POS.AUDIO_SLIDER_HEIGHT_RATIO,
      radius: settingsContainer.height * UI_POS.AUDIO_SLIDER_RADIUS_RATIO
    }
  );
  sfxVolumeSlider.x = UI_POS.AUDIO_SLIDER_X_RATIO * settingsContainer.width;
  sfxVolumeSlider.y = (UI_POS.AUDIO_SLIDER_Y_RATIO + UI_POS.VERTICAL_GAP_BETWEEN_SLIDERS) * settingsContainer.height;
  container.addChild(sfxVolumeSlider);

  const resize = (newWidth: number, newHeight: number) => {
    // Resize buttons
    bgVolumeButton.x = UI_POS.AUDIO_BUTTON_X_RATIO * newWidth;
    bgVolumeButton.y = UI_POS.AUDIO_BUTTON_Y_RATIO * newHeight;
    bgVolumeButton.width = newHeight * UI_POS.AUDIO_BUTTON_WIDTH_RATIO;
    bgVolumeButton.height = newHeight * UI_POS.AUDIO_BUTTON_HEIGHT_RATIO;

    sfxVolumeButton.x = UI_POS.AUDIO_BUTTON_X_RATIO * newWidth;
    sfxVolumeButton.y = (UI_POS.AUDIO_BUTTON_Y_RATIO + UI_POS.VERTICAL_GAP_BETWEEN_SLIDERS) * newHeight;
    sfxVolumeButton.width = newHeight * UI_POS.AUDIO_BUTTON_WIDTH_RATIO;
    sfxVolumeButton.height = newHeight * UI_POS.AUDIO_BUTTON_HEIGHT_RATIO;

    // Resize sliders using the new resize method
    bgVolumeSlider.x = UI_POS.AUDIO_SLIDER_X_RATIO * newWidth;
    bgVolumeSlider.y = UI_POS.AUDIO_SLIDER_Y_RATIO * newHeight;
    (bgVolumeSlider as any).resize(newWidth * UI_POS.AUDIO_SLIDER_WIDTH_RATIO, {
      height: newHeight * UI_POS.AUDIO_SLIDER_HEIGHT_RATIO,
      radius: newHeight * UI_POS.AUDIO_SLIDER_RADIUS_RATIO,
      knobTexture: Assets.get('audioKnob'),
      trackTexture: Assets.get('audioTrack')
    });

    sfxVolumeSlider.x = UI_POS.AUDIO_SLIDER_X_RATIO * newWidth;
    sfxVolumeSlider.y = (UI_POS.AUDIO_SLIDER_Y_RATIO + UI_POS.VERTICAL_GAP_BETWEEN_SLIDERS) * newHeight;
    (sfxVolumeSlider as any).resize(newWidth * UI_POS.AUDIO_SLIDER_WIDTH_RATIO, {
      height: newHeight * UI_POS.AUDIO_SLIDER_HEIGHT_RATIO,
      radius: newHeight * UI_POS.AUDIO_SLIDER_RADIUS_RATIO,
      knobTexture: Assets.get('audioKnob'),
      trackTexture: Assets.get('audioTrack')
    });
  };

  (container as any).resize = resize;

  return container;
};
