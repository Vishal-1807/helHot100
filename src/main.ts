import { Application, Assets, Sprite } from 'pixi.js'
import { hideSplash, loadAssets, setupSplashVideoLoadDetection } from './loader';
import { GlobalState } from './globals/gameState';
import { WebSocketService } from './WebSockets/WebSocketService';
import { getUIVisibilityManager } from './utils/uiVisibilityManager';
// import { initializeGameButtonManager } from './utils/gameButtonVisibilityManager';
import { initializeActivityManager, resumeActivityTimer } from './utils/gameActivityManager';
import { initializeButtonStateManager, setupGameStateListeners } from './utils/gameButtonStateManager';
import { SoundManager } from './utils/SoundManager';
// import { initializeSettingsPopupManager, getSettingsPopupManager } from './components/popups/SettingsPopupManager';
import { createGameContainer } from './components/gameContainer';
import {UI_THEME} from './components/constants/UIThemeColors';
import { createBetTab, createWinningsTab, createSpinButton, createBalanceTab, 
  createAutoSpinButton, createHomeButton, createSettingsButton, createRulesButton, createReelContainer } from './components/';
import {
  createSimplePositionedContainer,
} from './components/commons/PositionedContainer';
import {REACT_MODE} from './components/constants/ReactMode';


// 🔧 CONFIGURATION: Change this to switch between modes
const USE_REACT_MODE = REACT_MODE; // Set to false for local mode

// Common game initialization logic
const initializeGame = async (app: Application, container?: HTMLDivElement) => {
  // Enable sorting for z-index to work properly
  app.stage.sortableChildren = true;

  //set urls, fetch from window (only if not already set in React mode)
  if (!GlobalState.getS3Url()) {
    const fetchUrls = async () => {
      GlobalState.setS3Url((window as any).s3url);
      GlobalState.setApiUrl((window as any).apiUrl);
      GlobalState.setWebSocketUrl((window as any).websocketUrl);
    }

    await fetchUrls();
    console.log(GlobalState.getS3Url(), GlobalState.getApiUrl(), GlobalState.getWebSocketUrl(), "urls fetched");
  } else {
    console.log('🌐 URLs already set from React mode initialization');
  }

  // Initialize UI Visibility Manager for showing/hiding UI elements
  const uiVisibilityManager = getUIVisibilityManager({
    animationDuration: 300,
    debugMode: true,
    fadeEffect: true
  });

  // Load game assets
  await loadAssets();
  
  // Initialize WebSocket connection
  const ws = WebSocketService.getInstance();

  // Initialize activity manager for handling user inactivity
  const initActivityManager = () => {
    const activityManager = initializeActivityManager({
      timeoutMinutes: 2,
      debugMode: false,
      excludeFromTimer: []
    });

    console.log('🕐 Activity manager initialized with 2-minute timeout');
    return activityManager;
  };

  const activityManager = initActivityManager();

  // Initialize Settings Popup Manager
  // initializeSettingsPopupManager(app);
  console.log('⚙️ Settings popup manager initialized');

  // Start activity timer after initialization
  setTimeout(() => {
    resumeActivityTimer();
    console.log('🕐 Activity timer started after initialization');
  }, 1000);

  // TODO: Create your game components here
  // Example:
  // const background = createBackground(app.screen.width, app.screen.height);
  // app.stage.addChild(background);
  
  // STEP 1: Get player balance
  console.log('📡 STEP 1: Requesting balance...');
  const getBalance = (): Promise<void> => {
    return new Promise((resolve) => {
      ws.on('getbalance', (res) => {
        if (res?.balance !== undefined) {
          GlobalState.setBalance(res.balance);
          console.log('💰 Balance retrieved:', res.balance);
          resolve();
        }
      });
      ws.send('getbalance', { operation: 'getbalance' });
    });
  };

  // STEP 2: Check for pending/active games
  const checkAndHandlePendingGames = async (): Promise<boolean> => {
    console.log('🔍 STEP 2: Checking pending games...');
    return await checkPendingGames(removeSplashScreen);
  };

  // STEP 3: Initialize game UI components
  let gameContainer: any = null;
  // Store container references for resize updates
  let topBar: any, gameBoard: any, bottomBar: any;

  //top bar
  let balanceTab: any, homeButton: any, settingsButton: any, rulesButton: any;

  //reel container
  let reelContainer: any;

  //bottom bar
  let betTab: any, winningsTab: any, spinButton: any, autoSpinButton: any;

  const initializeGameUI = (): void => {
    console.log('🎮 STEP 3: Initializing game UI...');

    // uncomment if you want game container changing with small screens
    // GlobalState.setSmallScreen(app.screen.height < 750);

    gameContainer = createGameContainer({
      app,
      minWidth: 340, // Minimum width for mobile
      maxWidth: Math.max(app.screen.width, 1920), // Allow scaling up to at least 1920px or screen width
      backgroundColor: '#1A2C38'
    });

    // Add background image to the game container (behind all other containers)
    const bgTexture = Assets.get('bg');
    if (bgTexture) {
      const bgSprite = new Sprite(bgTexture);
      const bounds = gameContainer.getGameAreaBounds();
      bgSprite.width = bounds.width;
      bgSprite.height = app.screen.height

      // Position the background at the top-left of the game area
      bgSprite.x = 0;
      bgSprite.y = 0;

      // Set z-index to be behind all other containers
      bgSprite.zIndex = -1;

      // Add to game area
      gameContainer.gameArea.addChild(bgSprite);

      // Store reference for resize handling
      (gameContainer as any).backgroundSprite = bgSprite;

      // console.log('🖼️ Background image added to game container with dimensions:', targetWidth, 'x', targetHeight);
    } else {
      console.warn('⚠️ Background texture not found');
    }
  
    // Get the game area bounds
    const bounds = gameContainer.getGameAreaBounds();
    console.log('📐 Game area bounds:', bounds);

    topBar = createSimplePositionedContainer({
      gameContainerWidth: bounds.width,
      gameContainerHeight: bounds.height,
      height: '12%',
      x: 0,
      y: '0%',
      anchor: { x: 0, y: 0 },
      backgroundColor: '#1A2C38',
      transparent: true,
      // backgroundTexture: Assets.get('topBar'),
      // textureFit: 'cover'
    });

    gameContainer.gameArea.addChild(topBar.container);

    gameBoard = createSimplePositionedContainer({
      gameContainerWidth: bounds.width,
      gameContainerHeight: bounds.height,
      height: '73%',
      x: 0,
      y: '12%',
      anchor: { x: 0, y: 0 },
      backgroundColor: '#4EC9B0',
      transparent: true,
      // backgroundTexture: Assets.get('gameBoard'),
      // textureFit: 'cover'
    });

    gameContainer.gameArea.addChild(gameBoard.container);

    bottomBar = createSimplePositionedContainer({
      gameContainerWidth: bounds.width,
      gameContainerHeight: bounds.height,
      height: '15%',
      x: 0,
      y: '85%',
      anchor: { x: 0, y: 0 },
      backgroundColor: '#1A2C38',
      transparent: true,
      // backgroundTexture: Assets.get('bottomBar'),
      // textureFit: 'cover'
    });

    gameContainer.gameArea.addChild(bottomBar.container);

    addContentToContainers(topBar, gameBoard, bottomBar);

  };

  const addContentToContainers = (topBarRef: any, gameBoardRef: any, bottomBarRef: any) => {
    // Get game container bounds for popups that need full screen dimensions
    const bounds = gameContainer.getGameAreaBounds();

    // ------------------ TOP BAR ELEMENTS -------------------- //
    balanceTab = createBalanceTab(topBarRef.container.width, topBarRef.container.height);
    homeButton = createHomeButton(topBarRef.container.width, topBarRef.container.height);
    settingsButton = createSettingsButton(topBarRef.container.width, topBarRef.container.height, bounds.width, bounds.height, gameContainer.gameArea);
    rulesButton = createRulesButton(topBarRef.container.width, topBarRef.container.height);

    topBarRef.container.addChild(balanceTab);
    topBarRef.container.addChild(homeButton);
    topBarRef.container.addChild(settingsButton);
    topBarRef.container.addChild(rulesButton);

    // ------------------ REEL CONTAINER ELEMENTS -------------------- //
    reelContainer = createReelContainer(gameBoardRef.container.width, gameBoardRef.container.height);

    gameBoardRef.container.addChild(reelContainer);
    
    // ------------------ BOTTOM BAR ELEMENTS ----------------------- //
    betTab = createBetTab(bottomBarRef.container.width, bottomBarRef.container.height);
    winningsTab = createWinningsTab(bottomBarRef.container.width, bottomBarRef.container.height);
    spinButton = createSpinButton(bottomBarRef.container.width, bottomBarRef.container.height);
    autoSpinButton = createAutoSpinButton(bottomBarRef.container.width, bottomBarRef.container.height);

    bottomBarRef.container.addChild(betTab);
    bottomBarRef.container.addChild(winningsTab);
    bottomBarRef.container.addChild(spinButton);
    bottomBarRef.container.addChild(autoSpinButton);
  };

  // STEP 4: Remove splash screen
  let splashRemoved = false;
  const removeSplashScreen = (): void => {
    if (splashRemoved) {
      console.log('🎨 Splash screen already removed, skipping...');
      return;
    }
    console.log('🎨 Removing splash screen...');
    hideSplash();
    splashRemoved = true;
    console.log('✅ Splash screen removed');
  };

  // STEP 5: Initialize sound system
  const initializeSounds = () => {
    console.log('🔊 Initializing sounds...');
    SoundManager.loadAndWaitForCompletion().then(() => {
      console.log('✅ Sounds loaded and ready');
    });
  }

  // Execute the main initialization flow
  const executeMainFlow = async (): Promise<void> => {
    try {
      removeSplashScreen();
      // Step 1: Get player balance
      // await getBalance();

      // Step 2: Check for pending games
      // const hasPendingGame = await checkAndHandlePendingGames();

      // Step 2.5: Set grid dimensions BEFORE initializing UI if pending game exists
      // if(hasPendingGame){
      //   console.log(`🎮 Setting grid dimensions before UI initialization: ${GlobalState.gridCols}x${GlobalState.gridRows}`);
      //   GlobalState.setGridDimensions(GlobalState.gridCols, GlobalState.gridRows);
      // }

      // Step 3: Initialize game UI (now with correct grid dimensions if pending game exists)
      initializeGameUI();

      // Step 3.5: Complete game restoration if pending game exists
      // if(hasPendingGame){
      //   console.log('🎮 Completing game restoration after UI initialization...');
      //   GlobalState.setGameState();
      //   await (window as any).gameGrid.loadGridFromMatrix();
      //   GlobalState.setGameStarted(true);
      // }

      // Step 4: Initialize sounds
      initializeSounds();

      // Step 5: Remove splash screen (since we're not checking for pending games for now)
      console.log('🎨 Removing splash screen...');
      hideSplash();
      SoundManager.playBackground(); // Uncomment when ready to play background music

      console.log('✅ Main initialization flow completed successfully');

    } catch (error) {
      console.error('❌ Error in main initialization flow:', error);
      // Fallback: still initialize UI and remove splash
      initializeGameUI();
      hideSplash();
    }
  };

  // Listen for pending game restoration completion
  GlobalState.addPendingGameRestoreCompleteListener(() => {
    console.log('🎨 Pending game restoration completed - removing splash screen');
    setTimeout(() => {
      hideSplash();
    }, 100);
  });

  // Start the main initialization flow
  executeMainFlow();

  // Handle window resize events
  const resize = () => {
    const newWidth = app.screen.width;
    const newHeight = app.screen.height;

    // Update game container dimensions
    if (gameContainer && typeof gameContainer.updateDimensions === 'function') {
      gameContainer.updateDimensions(newWidth, newHeight);

      // Get updated bounds
      const bounds = gameContainer.getGameAreaBounds();

      // Update background sprite scaling and positioning
      if ((gameContainer as any).backgroundSprite) {
        const bgSprite = (gameContainer as any).backgroundSprite;

        // Update background size to match new container bounds
        bgSprite.width = bounds.width;
        bgSprite.height = newHeight;

        // Position at top-left
        bgSprite.x = 0;
        bgSprite.y = 0;
      }

      // Update positioned containers
      if (topBar && typeof topBar.updateDimensions === 'function') {
        topBar.updateDimensions(bounds.width, bounds.height);
      }
      if (gameBoard && typeof gameBoard.updateDimensions === 'function') {
        console.log(`🎮 GameBoard updated to: ${gameBoard.container.width}x${gameBoard.container.height}`);
        gameBoard.updateDimensions(bounds.width, bounds.height);
      }
      if (bottomBar && typeof bottomBar.updateDimensions === 'function') {
        bottomBar.updateDimensions(bounds.width, bounds.height);
      }

      // ----------------- TOP BAR ELEMENT RESIZING ------------------- //
      // Update top bar tabs with new container dimensions
      const topBarBounds = topBar.getActualBounds();

      if(balanceTab && typeof balanceTab.resize === 'function') {
        (balanceTab as any).resize(topBarBounds.width, topBarBounds.height);
      }
      if(homeButton && typeof homeButton.resize === 'function') {
        (homeButton as any).resize(topBarBounds.width, topBarBounds.height);
      }
      if(settingsButton && typeof settingsButton.resize === 'function') {
        (settingsButton as any).resize(topBarBounds.width, topBarBounds.height, bounds.width, bounds.height);
      }
      if(rulesButton && typeof rulesButton.resize === 'function') {
        (rulesButton as any).resize(topBarBounds.width, topBarBounds.height);
      }

      // --------------- REEL CONTAINER ELEMENT RESIZING ------------------- //
      const gameBoardBounds = gameBoard.getActualBounds();

      if(reelContainer && typeof reelContainer.resize === 'function') {
        console.log(`🎮 GameBoard actual bounds: ${gameBoardBounds.width}x${gameBoardBounds.height}`);
        (reelContainer as any).resize(gameBoardBounds.width, gameBoardBounds.height);
      }

      // ----------------- BOTTOM BAR ELEMENT RESIZING ------------------- //
      // Update bottom bar tabs with new container dimensions
      const bottomBarBounds = bottomBar.getActualBounds();

      if (betTab && typeof (betTab as any).resize === 'function') {
        (betTab as any).resize(bottomBarBounds.width, bottomBarBounds.height);
      }
      if (winningsTab && typeof (winningsTab as any).resize === 'function') {
        (winningsTab as any).resize(bottomBarBounds.width, bottomBarBounds.height);
      }
      if (spinButton && typeof (spinButton as any).resize === 'function') {
        (spinButton as any).resize(bottomBarBounds.width, bottomBarBounds.height);
      }
      if (autoSpinButton && typeof (autoSpinButton as any).resize === 'function') {
        (autoSpinButton as any).resize(bottomBarBounds.width, bottomBarBounds.height);
      }


      // Legacy container support (keeping for compatibility)
      if ((gameContainer as any).headerContainer) {
        (gameContainer as any).headerContainer.updateDimensions(bounds.width, bounds.height);
      }
      if ((gameContainer as any).gameBoardContainer) {
        (gameContainer as any).gameBoardContainer.updateDimensions(bounds.width, bounds.height);

        // Re-apply transparency to game board background after resize
        if ((gameContainer as any).gameBoardContainer.container.children[0]) {
          ((gameContainer as any).gameBoardContainer.container.children[0] as any).alpha = 0;
        }
      }
      if ((gameContainer as any).controlsContainer) {
        (gameContainer as any).controlsContainer.updateDimensions(bounds.width, bounds.height);

        // Update scroll height after resize to maintain minesTab scroll boundary
        if ((gameContainer as any).updateScrollHeight) {
          setTimeout(() => {
            (gameContainer as any).updateScrollHeight();
          }, 100);
        }
      }
    }

    // // Handle settings popup resize
    // try {
    //   const settingsManager = getSettingsPopupManager();
    //   settingsManager.handleResize();
    // } catch (error) {
    //   // Settings manager not initialized yet, ignore
    // }

    // console.log(`📐 Window resized to ${newWidth}x${newHeight}`);
  };

  // Debounced resize handler
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
      resize();
    }, 0); // anything above 0, it doesn't work
  });

  return { app, resize };
};

// React mode initialization (for embedded use)
const initReactMode = async (container: HTMLDivElement) => {
  console.log('🔧 Starting in REACT MODE');

  // Get authentication token from session storage
  const token = sessionStorage.getItem('token') || "";
  if (token) {
    console.log("Token retrieved from session storage:", token);
    GlobalState.setToken(token);
  } else {
    console.warn("No token found in session storage");
  }

  // Fetch URLs first to get S3 URL for splash screen
  const fetchUrls = async () => {
    GlobalState.setS3Url((window as any).s3url);
    GlobalState.setApiUrl((window as any).apiUrl);
    GlobalState.setWebSocketUrl((window as any).websocketUrl);
  }

  await fetchUrls();
  console.log('🌐 URLs fetched for React mode:', GlobalState.getS3Url());

  // Create splash screen overlay with gameContainer dimensions
  const splash = document.createElement('div');
  splash.id = 'splash';
  splash.style.position = 'absolute';
  splash.style.top = '0';
  splash.style.left = '50%';
  splash.style.transform = 'translateX(-50%)';
  splash.style.width = 'min(max(95vw, 340px), 500px)';
  splash.style.height = '100vh';
  splash.style.background = 'black';
  splash.style.zIndex = '10';
  splash.style.display = 'flex';
  splash.style.alignItems = 'center';
  splash.style.justifyContent = 'center';
  splash.style.pointerEvents = 'none';

  // Handle very narrow screens (same logic as gameContainer)
  if (container.clientWidth < 360) {
    splash.style.width = '100vw';
    splash.style.left = '0';
    splash.style.transform = 'none';
  }

  // Create splash video element
  const video = document.createElement('video');
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;
  video.loop = true;
  video.style.width = '100%';
  video.style.height = '100%';
  video.style.objectFit = 'cover';

  const source = document.createElement('source');
  // Use S3 URL fetched from window
  source.src = GlobalState.getS3Url() + 'mines-field/assets/minesSplash.mp4';
  source.type = 'video/mp4';

  video.appendChild(source);
  splash.appendChild(video);
  container.appendChild(splash);

  setupSplashVideoLoadDetection();

  // Initialize PIXI Application
  const app = new Application();
  await app.init({
    background: '#080f16', // TODO: Change to your game's background color
    autoStart: true,
    width: container.clientWidth,
    height: container.clientHeight,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
  });

  // Set canvas styles for proper rendering
  app.canvas.style.position = 'absolute';
  app.canvas.style.top = '0';
  app.canvas.style.left = '0';
  app.canvas.style.width = '100%';
  app.canvas.style.height = '100%';
  app.canvas.style.zIndex = '1';
  app.canvas.style.overflow = 'hidden';
  app.canvas.style.display = 'block';

  // Set container styles
  container.style.overflow = 'hidden';
  container.style.padding = '0';
  container.style.margin = '0';
  container.style.display = 'block';
  container.style.position = 'relative';

  container.appendChild(app.canvas);

  await initializeGame(app, container);
};

// Local mode initialization (for standalone development)
const initLocalMode = async () => {
  console.log('🔧 Starting in LOCAL MODE');
  
  const app = new Application();
  await app.init({
    background: '#080f16', // TODO: Change to your game's background color
    autoStart: true,
    resizeTo: window,
  });
  document.body.appendChild(app.canvas);

  // Set canvas styles
  app.canvas.style.position = 'absolute';
  app.canvas.style.top = '0';
  app.canvas.style.left = '0';
  app.canvas.style.width = '100%';
  app.canvas.style.height = '100%';
  app.canvas.style.zIndex = '1';
  app.canvas.style.overflow = 'hidden';
  app.canvas.style.display = 'block';

  await initializeGame(app);
};

// Main entry point - switches based on USE_REACT_MODE flag
if (USE_REACT_MODE) {
  // Attach React mode function to window for React to call
  (window as any).startPixiGame = initReactMode;
} else {
  // Initialize local mode immediately
  initLocalMode();
}

// Function to check for pending/active games and restore them
const checkPendingGames = async (removeSplashScreen: () => void): Promise<boolean> => {
  const ws = WebSocketService.getInstance();

  return new Promise<boolean>((resolve) => {
    console.log('🔍 === CHECKING PENDING GAMES ===');
    
    // TODO: Replace with your game's load operation
    ws.send('mines_game_load', {
      operation: 'mines_game_load',
      data: {
        tableId: GlobalState.getTableId(),
      },
    });
    
    ws.on('mines_game_load', (res) => {     
      if (res?.status === '400') {
        console.log('✅ No pending game found - clean state');
        resolve(false); // No pending game
      }
      else if (res?.status === '200 OK') {
        console.log('🎮 200 OK response received');
        
        if(res?.hasExistingGame){
          console.log('🎮 Existing game found - processing restoration...');
          console.log('🎮 Restoration data:', res);
          GlobalState.gridCols = parseInt(res?.gridOption?.split('x')[0]);
          GlobalState.gridRows = parseInt(res?.gridOption?.split('x')[1]);
          GlobalState.setRoundId(res?.roundId);
          GlobalState.setReward(res?.currentWinning || 0);
          GlobalState.setStakeAmount(res?.betAmount || 1);
          GlobalState.setMinesCount(res?.mineCount);
          GlobalState.setGameMatrix(res?.revealedMatrix);
          //set mines clicked to 0 if res.revealedCount doesnt exist
          GlobalState.setMinesClickedCount(res?.revealedCount || 0);

          // TODO: Implement your game's restoration logic here
          // Example restoration steps:
          // 1. Validate the game state
          // 2. Restore game variables
          // 3. Restore UI state
          // 4. Restore game board/components
          
          // Check if game is valid and should be restored
          const hasValidRoundId = res?.roundId && res?.roundId !== null && res?.roundId !== '';
          
          if (!hasValidRoundId) {
            console.log('🎮 Game appears to be completed or invalid - starting fresh');
            resolve(false);
            return;
          }

          console.log('🎮 Valid active game found - proceeding with restoration...');

          // TODO: Restore your game state here
          // Example:
          // GlobalState.setRoundId(res?.roundId);
          // GlobalState.setGameStarted(true);
          // etc.

          // Delay visual restoration to ensure all state is set
          setTimeout(() => {
            console.log('🎨 Triggering game restoration...');
            
            if (GlobalState.triggerPendingGameRestore) {
              console.log('🎨 Calling triggerPendingGameRestore()');
              GlobalState.triggerPendingGameRestore();
            } else {
              console.error('⚠️ GlobalState.triggerPendingGameRestore not available!');
              // Fallback: remove splash screen
              setTimeout(() => {
                removeSplashScreen();
              }, 100);
            }
          }, 500);

          resolve(true);
        } else {
          console.log('🔍 No existing game found');
          resolve(false);
        }
      } else {
        console.warn('⚠️ Unknown response status:', res?.status);
        resolve(false);
      }
    });
  });
};