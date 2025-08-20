import { Assets } from 'pixi.js';
import { GlobalState } from './globals/gameState';
import { REACT_MODE } from "./components/constants/ReactMode";

export async function loadAssets() {
    const ASSET_BASE = '';
    // const ASSET_BASE = REACT_MODE ? `${GlobalState.getS3Url()}mines-field/` : 'https://s3.eu-west-2.amazonaws.com/static.inferixai.link/pixi-game-assets/mines-field/'
    
    // Load all assets including the font file
    await Assets.load([
        { alias: 'spinButton', src: `${ASSET_BASE}assets/SpinButton.png` },
        { alias: 'autoSpinButton', src: `${ASSET_BASE}assets/Auto.png` },
        { alias: 'autoSpinStopButton', src: `${ASSET_BASE}assets/AutoStop.png` },
        { alias: 'valueBar', src: `${ASSET_BASE}assets/ValueBar.png` },
        { alias: 'home', src: `${ASSET_BASE}assets/Home.png` },
        { alias : 'settings', src: `${ASSET_BASE}assets/Settings.png` },
        { alias: 'reelColumn', src: `${ASSET_BASE}assets/ReelColumn.png` },
        { alias: 'plusButton', src: `${ASSET_BASE}assets/PlusButton.png` },
        { alias: 'minusButton', src: `${ASSET_BASE}assets/MinusButton.png` },
        { alias: 'closeButton', src: `${ASSET_BASE}assets/CloseButton.png` },
        { alias : 'Rules', src: `${ASSET_BASE}assets/Rules.png` },
        { alias: 'bg', src: `${ASSET_BASE}assets/bganimation.mp4` },

        // -------------- SLOT ICONS ----------------- //
        { alias: 'watermelonIcon', src: `${ASSET_BASE}assets/watermelon.png` },
        { alias: 'sevenIcon', src: `${ASSET_BASE}assets/seven.png` },
        { alias: 'plumIcon', src: `${ASSET_BASE}assets/plum.png` },
        { alias: 'grapesIcon', src: `${ASSET_BASE}assets/grapes.png` },
        { alias: 'cherryIcon', src: `${ASSET_BASE}assets/cherry.png` },
        { alias: 'lemonIcon', src: `${ASSET_BASE}assets/lemon.png` },
        { alias: 'scatterIcon', src: `${ASSET_BASE}assets/scatter.png` },
        { alias: 'wildIcon', src: `${ASSET_BASE}assets/wild.png` },

        // -------------- SLOT WIN SPRITES ----------------- //
        { alias: 'lemonWin', src: `${ASSET_BASE}sprites/lemon.json` },
        { alias: 'plumWin', src: `${ASSET_BASE}sprites/plum.json` },
        { alias: 'wildWin', src: `${ASSET_BASE}sprites/wild.json` },
        { alias: 'scatterWin', src: `${ASSET_BASE}sprites/scatter.json` },
        { alias: 'cherryWin', src: `${ASSET_BASE}sprites/cherry.json` },
        { alias: 'grapesWin', src: `${ASSET_BASE}sprites/grapes.json` },
        { alias: 'sevenWin', src: `${ASSET_BASE}sprites/seven.json` },
        { alias: 'watermelonWin', src: `${ASSET_BASE}sprites/watermelon.json` },
        { alias: 'lemonWin', src: `${ASSET_BASE}sprites/lemon.json` },

        // ---------------- BLURRED SLOT ICONS ----------------- //
        { alias: 'watermelonBlur', src: `${ASSET_BASE}assets/watermelonBlur.png` },
        { alias: 'sevenBlur', src: `${ASSET_BASE}assets/sevenBlur.png` },
        { alias: 'plumBlur', src: `${ASSET_BASE}assets/plumBlur.png` },
        { alias: 'grapesBlur', src: `${ASSET_BASE}assets/grapesBlur.png` },
        { alias: 'cherryBlur', src: `${ASSET_BASE}assets/cherryBlur.png` },
        { alias: 'lemonBlur', src: `${ASSET_BASE}assets/lemonBlur.png` },
        { alias: 'scatterBlur', src: `${ASSET_BASE}assets/scatterBlur.png` },
        { alias: 'wildBlur', src: `${ASSET_BASE}assets/wildBlur.png` },

        // ------------- WIN POPUP ----------------- //
        { alias: 'totalWin', src: `${ASSET_BASE}assets/TotalWin.png` },
        { alias: 'bigWin', src: `${ASSET_BASE}assets/BigWin.png` },

        // ----------------- COMMON POPUP ----------------- //
        { alias: 'commonPopup', src: `${ASSET_BASE}assets/CommonPopup.png` },
        { alias: 'previousButton', src: `${ASSET_BASE}assets/previousButton.png` },
        { alias: 'nextButton', src: `${ASSET_BASE}assets/nextButton.png` },

        // --------------- SETTINGS AUDIO ----------------- //
        { alias: 'musicButton', src: `${ASSET_BASE}assets/musicButton.png` },
        { alias: 'soundButton', src: `${ASSET_BASE}assets/soundButton.png` },
        { alias: 'audioKnob', src: `${ASSET_BASE}assets/audioKnob.png` },
        { alias: 'audioTrack', src: `${ASSET_BASE}assets/audioTrack.png` },

        // ----------------- RULES PAGES ----------------- //
        { alias: 'PaylinePage1', src: `${ASSET_BASE}assets/PaylinePage1.png` },
        { alias: 'PaylinePage2', src: `${ASSET_BASE}assets/PaylinePage2.png` },
        { alias: 'PaylinePage3', src: `${ASSET_BASE}assets/PaylinePage3.png` },
        { alias: 'PaylinePage4', src: `${ASSET_BASE}assets/PaylinePage4.png` },
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