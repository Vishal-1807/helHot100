import { Assets } from 'pixi.js';
import { GlobalState } from './globals/gameState';
import { REACT_MODE } from "./components/constants/ReactMode";

export async function loadAssets() {
    const ASSET_BASE = '';
    // const ASSET_BASE = REACT_MODE ? `${GlobalState.getS3Url()}mines-field/` : 'https://s3.eu-west-2.amazonaws.com/static.inferixai.link/pixi-game-assets/mines-field/'
    
    // Load all assets including the font file
    await Assets.load([
        { alias: 'gridCell', src: `${ASSET_BASE}assets/GridCell.png` },
        // { alias: 'diamondSprite', src: `${ASSET_BASE}sprites/diamond.json` },
        { alias: 'spinButton', src: `${ASSET_BASE}assets/SpinButton.png` },
        { alias: 'autoSpinButton', src: `${ASSET_BASE}assets/AutoSpinButton.png` },
        { alias: 'valueBar', src: `${ASSET_BASE}assets/ValueBar.png` },
        { alias: 'balanceTab', src: `${ASSET_BASE}assets/BalanceTab.png` },
        { alias: 'home', src: `${ASSET_BASE}assets/Home.png` },
        { alias : 'settings', src: `${ASSET_BASE}assets/Settings.png` },
        { alias: 'settingsPopup', src: `${ASSET_BASE}assets/SettingsPopup.png` },
        { alias: 'reelColumn', src: `${ASSET_BASE}assets/ReelColumn.png` },
        { alias: 'button', src: `${ASSET_BASE}assets/Button.png` },
        { alias: 'plusButton', src: `${ASSET_BASE}assets/PlusButton.png` },
        { alias: 'minusButton', src: `${ASSET_BASE}assets/MinusButton.png` },
        { alias: 'closeButton', src: `${ASSET_BASE}assets/CloseButton.png` },
        { alias: 'Sound', src: `${ASSET_BASE}assets/Sound.png` },
        { alias : 'Rules', src: `${ASSET_BASE}assets/Rules.png` },
        { alias: 'History', src: `${ASSET_BASE}assets/History.png` },
        { alias: 'bg', src: `${ASSET_BASE}assets/bg.png` },

        // -------------- SLOT ICONS ----------------- //
        { alias: 'watermelonIcon', src: `${ASSET_BASE}assets/watermelon.png` },
        { alias: 'sevenIcon', src: `${ASSET_BASE}assets/seven.png` },
        { alias: 'plumIcon', src: `${ASSET_BASE}assets/plum.png` },
        { alias: 'grapesIcon', src: `${ASSET_BASE}assets/grapes.png` },
        { alias: 'cherryIcon', src: `${ASSET_BASE}assets/cherry.png` },
        { alias: 'lemonIcon', src: `${ASSET_BASE}assets/lemon.png` },
        { alias: 'scatterIcon', src: `${ASSET_BASE}assets/scatter.png` },
        { alias: 'wildIcon', src: `${ASSET_BASE}assets/wild.png` },

    ]);

    console.log('All assets loaded successfully');

    // Debug: Check if controlsBar asset loaded
    const controlsBarAsset = Assets.get('controlsBar');
    console.log('🎨 ControlsBar asset loaded:', controlsBarAsset);
    console.log('🎨 ControlsBar asset type:', typeof controlsBarAsset);
    if (controlsBarAsset) {
        console.log('🎨 ControlsBar dimensions:', controlsBarAsset.width, 'x', controlsBarAsset.height);
    }

    // Register the custom font for use in PIXI Text
    try {
        // Use the direct path to the font file
        const fontUrl = `${ASSET_BASE}assets/gameFont.ttf`;
        const fontFace = new FontFace('GameFont', `url(${fontUrl})`);
        
        await fontFace.load();
        document.fonts.add(fontFace);
        
        console.log('✅ Custom font "GameFont" loaded and registered successfully');
        
        // Verify the font is available
        await document.fonts.ready;
        const isAvailable = document.fonts.check('16px GameFont');
        console.log('Font availability check:', isAvailable);
        
    } catch (fontError) {
        console.warn('⚠️ Failed to load custom font "GameFont":', fontError);
        console.log('Will fallback to system fonts');
    }
}

export function hideSplash() {
    const splash = document.getElementById('splash');
    if (splash) splash.remove();
}

export function setupSplashVideoLoadDetection() {
    console.log('🎬 Setting up splash video load detection');
    
    // Find the splash video element (created in main.ts)
    const splash = document.getElementById('splash');
    if (!splash) {
      console.warn('⚠️ Splash element not found');
      return;
    }
    
    const video = splash.querySelector('video');
    if (!video) {
      console.warn('⚠️ Video element not found in splash');
      return;
    }
    
    // Add loading detection
    video.addEventListener('loadeddata', () => { //loadeddata is native HTML5 listener for video element
      console.log('🎬 Splash video loaded successfully');
      // Notify React that splash is ready
      if (typeof (window as any).loadingCompleted === 'function') {
        (window as any).loadingCompleted();
      }
    });
  
    video.addEventListener('error', (e) => {
      console.error('❌ Error loading splash video:', e);
      // Still notify React to avoid infinite loading
      if (typeof (window as any).loadingCompleted === 'function') {
        (window as any).loadingCompleted();
      }
    });
  }