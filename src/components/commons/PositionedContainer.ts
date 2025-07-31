import { Container, Graphics, FederatedPointerEvent, Texture, Sprite } from 'pixi.js';

interface PositionedContainerConfig {
  gameContainerWidth: number;
  gameContainerHeight: number;
  width?: number | string; // Added width option
  height?: number | string; // Made height optional
  x?: number | string;
  y?: number | string;
  anchor?: { x: number; y: number };
  backgroundColor?: number | string;
  transparent?: boolean;
  borderColor?: number | string;
  borderWidth?: number;
  borderRadius?: number;
  opacity?: number;
  marginLeft?: number;
  marginRight?: number;
  backgroundTexture?: Texture;
  textureScale?: number;
  textureRepeat?: boolean;
  textureFit?: 'stretch' | 'cover' | 'contain' | 'tile' | 'center';
  scrollable?: boolean;
  scrollHeight?: number;
}

export interface PositionedContainerResult {
  container: Container;
  contentArea: Container;
  background: Graphics;
  backgroundSprite?: Sprite;
  updatePosition: (w: number, h: number) => void;
  updateDimensions: (w: number, h: number) => void;
  setWidth: (w: number | string) => void; // Added to set width
  setHeight: (h: number | string) => void;
  setPosition: (x: number | string, y: number | string) => void;
  setAnchor: (anchor: { x: number; y: number }) => void;
  getActualBounds: () => { x: number; y: number; width: number; height: number };
  setBackgroundTexture?: (t: Texture | null, f?: 'stretch' | 'cover' | 'contain' | 'tile' | 'center') => void;
  setTextureScale?: (s: number) => void;
  setScrollHeight?: (h: number) => void;
  getScrollPosition?: () => { scrollY: number; maxScrollY: number };
  scrollTo?: (y: number) => void;
}

const parseColor = (color: number | string | undefined): number => {
  if (color === undefined) return 0x000000;
  if (typeof color === 'number') return color;
  const clean = color.replace('#', '');
  const hex = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  return parseInt(hex, 16);
};

export const createPositionedContainer = (config: PositionedContainerConfig): PositionedContainerResult => {
  const {
    gameContainerWidth, gameContainerHeight,
    width = '100%', // Default to 100%
    height = '100%', // Default to 100%
    x = 0,
    y = 0,
    anchor = { x: 0, y: 0 },
    backgroundColor = 0x1A2C38,
    transparent = false,
    borderColor, borderWidth = 0, borderRadius = 0,
    opacity = 1, marginLeft = 0, marginRight = 0,
    backgroundTexture, textureScale = 1, textureFit = 'stretch',
    scrollable = false, scrollHeight = 0
  } = config;

  const mainContainer = new Container();
  mainContainer.sortableChildren = true;

  const background = new Graphics();
  let backgroundSprite: Sprite | undefined;
  if (backgroundTexture) {
    backgroundSprite = new Sprite(backgroundTexture);
    backgroundSprite.zIndex = 0;
  }

  const contentArea = new Container();
  contentArea.sortableChildren = true;

  let scrollMask: Graphics | null = null;
  let scrollContent: Container | null = null;
  let scrollY = 0;
  let contentHeight = scrollHeight;
  let isDragging = false;
  let lastPointerY = 0;
  let velocity = 0;
  let lastTime = 0;

  if (backgroundSprite) mainContainer.addChild(backgroundSprite);
  mainContainer.addChild(background);
  mainContainer.addChild(contentArea);

  if (scrollable) {
    scrollContent = new Container();
    scrollContent.sortableChildren = true;

    scrollMask = new Graphics();
    scrollMask.zIndex = -1;

    contentArea.addChild(scrollMask);
    contentArea.addChild(scrollContent);
    scrollContent.mask = scrollMask;

    mainContainer.eventMode = 'static';
    mainContainer.cursor = 'pointer';
  }

  let currentWidth = width;
  let currentHeight = height;
  let currentX = x;
  let currentY = y;
  let currentAnchor = anchor;
  let currentTextureFit = textureFit;

  const calculateActualWidth = (gw: number): number => {
    if (typeof currentWidth === 'string' && currentWidth.endsWith('%')) {
      return (gw * parseFloat(currentWidth)) / 100;
    }
    return typeof currentWidth === 'number' ? currentWidth : parseFloat(currentWidth.toString());
  };

  const calculateActualHeight = (gh: number): number => {
    if (typeof currentHeight === 'string' && currentHeight.endsWith('%')) {
      return (gh * parseFloat(currentHeight)) / 100;
    }
    return typeof currentHeight === 'number' ? currentHeight : parseFloat(currentHeight.toString());
  };

  const calculateActualX = (gw: number): number => {
    if (typeof currentX === 'string' && currentX.endsWith('%')) {
      return (gw * parseFloat(currentX)) / 100;
    }
    return typeof currentX === 'number' ? currentX : parseFloat(currentX.toString());
  };

  const calculateActualY = (gh: number): number => {
    if (typeof currentY === 'string' && currentY.endsWith('%')) {
      return (gh * parseFloat(currentY)) / 100;
    }
    return typeof currentY === 'number' ? currentY : parseFloat(currentY.toString());
  };

  const updateBackgroundTexture = (cw: number, ch: number) => {
    if (!backgroundSprite) return;

    const aw = calculateActualWidth(cw) - marginLeft - marginRight;
    const ah = calculateActualHeight(ch);
    const pad = borderWidth;
    const tw = aw - pad * 2;
    const th = ah - pad * 2;

    backgroundSprite.x = pad;
    backgroundSprite.y = pad;

    switch (currentTextureFit) {
      case 'stretch':
        backgroundSprite.width = tw;
        backgroundSprite.height = th;
        break;
      case 'cover': {
        const s = Math.max(tw / backgroundSprite.texture.width, th / backgroundSprite.texture.height) * textureScale;
        backgroundSprite.scale.set(s);
        backgroundSprite.x = pad + (tw - backgroundSprite.width) / 2;
        backgroundSprite.y = pad + (th - backgroundSprite.height) / 2;
        break;
      }
      case 'contain': {
        const s = Math.min(tw / backgroundSprite.texture.width, th / backgroundSprite.texture.height) * textureScale;
        backgroundSprite.scale.set(s);
        backgroundSprite.x = pad + (tw - backgroundSprite.width) / 2;
        backgroundSprite.y = pad + (th - backgroundSprite.height) / 2;
        break;
      }
      case 'center':
        backgroundSprite.scale.set(textureScale);
        backgroundSprite.x = pad + (tw - backgroundSprite.width) / 2;
        backgroundSprite.y = pad + (th - backgroundSprite.height) / 2;
        break;
      case 'tile':
        backgroundSprite.scale.set(textureScale);
        backgroundSprite.x = pad;
        backgroundSprite.y = pad;
        break;
    }
    backgroundSprite.alpha = opacity;
  };

  const drawBackground = (cw: number, ch: number) => {
    const aw = calculateActualWidth(cw) - marginLeft - marginRight;
    const ah = calculateActualHeight(ch);
    background.clear();
    updateBackgroundTexture(cw, ch);

    const useTrans = transparent || !!backgroundSprite;
    const fillColor = useTrans ? { color: 0x000000, alpha: 0 } : { color: parseColor(backgroundColor), alpha: opacity };

    if (borderWidth > 0 && borderColor !== undefined) {
      const innerPad = borderWidth;
      const iw = aw - innerPad * 2;
      const ih = ah - innerPad * 2;
      if (iw > 0 && ih > 0) {
        if (borderRadius > 0) {
          background.roundRect(innerPad, innerPad, iw, ih, Math.max(0, borderRadius - innerPad));
        } else {
          background.rect(innerPad, innerPad, iw, ih);
        }
        background.fill(fillColor);
      }
    } else {
      if (borderRadius > 0) {
        background.roundRect(0, 0, aw, ah, borderRadius);
      } else {
        background.rect(0, 0, aw, ah);
      }
      background.fill(fillColor);
    }

    if (scrollable && scrollMask) {
      scrollMask.clear();
      if (borderRadius > 0) {
        scrollMask.beginFill(0xffffff).drawRoundedRect(
          borderWidth, borderWidth,
          aw - borderWidth * 2, ah - borderWidth * 2,
          borderRadius
        ).endFill();
      } else {
        scrollMask.beginFill(0xffffff).drawRect(
          borderWidth, borderWidth,
          aw - borderWidth * 2, ah - borderWidth * 2
        ).endFill();
      }
    }
  };

  const setupScrolling = () => {
    if (!scrollable || !scrollContent) return;

    const getBounds = () => {
      const ah = calculateActualHeight(gameContainerHeight);
      const aw = calculateActualWidth(gameContainerWidth) - marginLeft - marginRight;
      return { width: aw, height: ah };
    };

    mainContainer.on('wheel', e => {
      const b = getBounds();
      if (contentHeight <= b.height) return;
      scrollY = Math.max(0, Math.min(scrollY + e.deltaY * 0.5, contentHeight - b.height));
      scrollContent.y = -scrollY;
    });

    mainContainer.on('pointerdown', (e: FederatedPointerEvent) => {
      if (contentHeight <= getBounds().height) return;
      isDragging = true;
      lastPointerY = e.global.y;
      lastTime = Date.now();
      velocity = 0;
      mainContainer.cursor = 'grabbing';
    });

    mainContainer.on('pointermove', (e: FederatedPointerEvent) => {
      if (!isDragging) return;
      const currentY = e.global.y;
      const dt = Date.now() - lastTime;
      const dy = currentY - lastPointerY;
      if (dt > 0) velocity = dy / dt;
      scrollY = Math.max(0, Math.min(scrollY - dy, contentHeight - getBounds().height));
      scrollContent.y = -scrollY;
      lastPointerY = currentY;
      lastTime = Date.now();
    });

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      mainContainer.cursor = 'pointer';
      if (Math.abs(velocity) > 0.1) {
        const b = getBounds();
        const momentum = () => {
          velocity *= 0.95;
          scrollY = Math.max(0, Math.min(scrollY - velocity * 16, contentHeight - b.height));
          scrollContent!.y = -scrollY;
          if (Math.abs(velocity) > 0.01) requestAnimationFrame(momentum);
        };
        requestAnimationFrame(momentum);
      }
    };
    mainContainer.on('pointerup', endDrag);
    mainContainer.on('pointerupoutside', endDrag);
  };

  const updatePosition = (cw: number, ch: number) => {
    const aw = calculateActualWidth(cw) - marginLeft - marginRight;
    const ah = calculateActualHeight(ch);
    const ax = calculateActualX(cw);
    const ay = calculateActualY(ch);

    mainContainer.pivot.set(aw * currentAnchor.x, ah * currentAnchor.y);
    mainContainer.x = ax + marginLeft;
    mainContainer.y = ay;
    drawBackground(cw, ch);
    contentArea.x = borderWidth;
    contentArea.y = borderWidth;
  };

  const updateDimensions = updatePosition;

  const setWidth = (w: number | string) => {
    currentWidth = w;
    const bounds = mainContainer.parent?.getBounds();
    if (bounds) updatePosition(bounds.width, bounds.height);
  };

  const setHeight = (h: number | string) => {
    currentHeight = h;
    const bounds = mainContainer.parent?.getBounds();
    if (bounds) updatePosition(bounds.width, bounds.height);
  };

  const setPosition = (newX: number | string, newY: number | string) => {
    currentX = newX;
    currentY = newY;
    const bounds = mainContainer.parent?.getBounds();
    if (bounds) updatePosition(bounds.width, bounds.height);
  };

  const setAnchor = (newAnchor: { x: number; y: number }) => {
    currentAnchor = newAnchor;
    const bounds = mainContainer.parent?.getBounds();
    if (bounds) updatePosition(bounds.width, bounds.height);
  };

  const setBackgroundTexture = (tex: Texture | null, fit: any = 'stretch') => {
    if (tex) {
      if (!backgroundSprite) {
        backgroundSprite = new Sprite(tex);
        backgroundSprite.zIndex = 0;
        mainContainer.addChild(backgroundSprite);
      } else {
        backgroundSprite.texture = tex;
      }
      currentTextureFit = fit;
    } else if (backgroundSprite) {
      mainContainer.removeChild(backgroundSprite);
      backgroundSprite = undefined;
    }
    const bounds = mainContainer.parent?.getBounds();
    if (bounds) updatePosition(bounds.width, bounds.height);
  };

  const setTextureScale = (s: number) => {
    const bounds = mainContainer.parent?.getBounds();
    if (bounds) updatePosition(bounds.width, bounds.height);
  };

  const getActualBounds = () => {
    const aw = calculateActualWidth(gameContainerWidth) - marginLeft - marginRight;
    const ah = calculateActualHeight(gameContainerHeight);
    const ax = calculateActualX(gameContainerWidth);
    const ay = calculateActualY(gameContainerHeight);
    return {
      x: ax - aw * currentAnchor.x,
      y: ay - ah * currentAnchor.y,
      width: aw,
      height: ah
    };
  };

  updatePosition(gameContainerWidth, gameContainerHeight);
  if (scrollable) setupScrolling();

  const result: PositionedContainerResult = {
    container: mainContainer,
    contentArea: scrollContent ?? contentArea,
    background,
    backgroundSprite,
    updatePosition,
    updateDimensions,
    setWidth,
    setHeight,
    setPosition,
    setAnchor,
    getActualBounds,
    setBackgroundTexture,
    setTextureScale
  };

  if (scrollable) {
    result.setScrollHeight = (h: number) => { contentHeight = h; };
    result.getScrollPosition = () => ({
      scrollY,
      maxScrollY: Math.max(0, contentHeight - calculateActualHeight(gameContainerHeight))
    });
    result.scrollTo = (y: number) => {
      const max = contentHeight - calculateActualHeight(gameContainerHeight);
      scrollY = Math.max(0, Math.min(y, max));
      if (scrollContent) scrollContent.y = -scrollY;
    };
  }

  return result;
};

// Updated helper functions with width, x, y, and anchor options

/**
 * Creates a simple positioned container with minimal styling and optional texture
 */
export const createSimplePositionedContainer = ({
  gameContainerWidth,
  gameContainerHeight,
  width = '100%',
  height = '100%',
  x = 0,
  y = 0,
  anchor = { x: 0, y: 0 },
  backgroundColor = 0x1A2C38,
  transparent = false,
  backgroundTexture,
  textureFit = 'stretch'
}: {
  gameContainerWidth: number;
  gameContainerHeight: number;
  width?: number | string;
  height?: number | string;
  x?: number | string;
  y?: number | string;
  anchor?: { x: number; y: number };
  backgroundColor?: number | string;
  transparent?: boolean;
  backgroundTexture?: Texture;
  textureFit?: 'stretch' | 'cover' | 'contain' | 'tile' | 'center';
}): PositionedContainerResult => {
  return createPositionedContainer({
    gameContainerWidth,
    gameContainerHeight,
    width,
    height,
    x,
    y,
    anchor,
    backgroundColor,
    transparent,
    backgroundTexture,
    textureFit
  });
};

/**
 * Creates a styled positioned container with border, rounded corners and optional texture
 */
export const createStyledPositionedContainer = ({
  gameContainerWidth,
  gameContainerHeight,
  width = '100%',
  height = '100%',
  x = 0,
  y = 0,
  anchor = { x: 0, y: 0 },
  backgroundColor = 0x1A2C38,
  transparent = false,
  borderColor = 0x304553,
  borderWidth = 2,
  borderRadius = 8,
  backgroundTexture,
  textureFit = 'stretch'
}: {
  gameContainerWidth: number;
  gameContainerHeight: number;
  width?: number | string;
  height?: number | string;
  x?: number | string;
  y?: number | string;
  anchor?: { x: number; y: number };
  backgroundColor?: number | string;
  transparent?: boolean;
  borderColor?: number | string;
  borderWidth?: number;
  borderRadius?: number;
  backgroundTexture?: Texture;
  textureFit?: 'stretch' | 'cover' | 'contain' | 'tile' | 'center';
}): PositionedContainerResult => {
  return createPositionedContainer({
    gameContainerWidth,
    gameContainerHeight,
    width,
    height,
    x,
    y,
    anchor,
    backgroundColor,
    transparent,
    borderColor,
    borderWidth,
    borderRadius,
    backgroundTexture,
    textureFit
  });
};

/**
 * Creates a container with horizontal margins and optional texture
 */
export const createMarginedPositionedContainer = ({
  gameContainerWidth,
  gameContainerHeight,
  width = '100%',
  height = '100%',
  x = 0,
  y = 0,
  anchor = { x: 0, y: 0 },
  marginHorizontal = 10,
  backgroundColor = 0x1A2C38,
  transparent = false,
  backgroundTexture,
  textureFit = 'stretch'
}: {
  gameContainerWidth: number;
  gameContainerHeight: number;
  width?: number | string;
  height?: number | string;
  x?: number | string;
  y?: number | string;
  anchor?: { x: number; y: number };
  marginHorizontal?: number;
  backgroundColor?: number | string;
  transparent?: boolean;
  backgroundTexture?: Texture;
  textureFit?: 'stretch' | 'cover' | 'contain' | 'tile' | 'center';
}): PositionedContainerResult => {
  return createPositionedContainer({
    gameContainerWidth,
    gameContainerHeight,
    width,
    height,
    x,
    y,
    anchor,
    backgroundColor,
    transparent,
    marginLeft: marginHorizontal,
    marginRight: marginHorizontal,
    backgroundTexture,
    textureFit
  });
};

/**
 * Creates a scrollable positioned container with specified scroll height and optional texture
 */
export const createScrollablePositionedContainer = ({
  gameContainerWidth,
  gameContainerHeight,
  width = '100%',
  height = '100%',
  x = 0,
  y = 0,
  anchor = { x: 0, y: 0 },
  scrollHeight,
  backgroundColor = 0x1A2C38,
  transparent = false,
  borderColor = 0x304553,
  borderWidth = 2,
  borderRadius = 8,
  scrollable = true,
  backgroundTexture,
  textureFit = 'stretch'
}: {
  gameContainerWidth: number;
  gameContainerHeight: number;
  width?: number | string;
  height?: number | string;
  x?: number | string;
  y?: number | string;
  anchor?: { x: number; y: number };
  scrollHeight: number;
  backgroundColor?: number | string;
  transparent?: boolean;
  borderColor?: number | string;
  borderWidth?: number;
  borderRadius?: number;
  scrollable?: boolean;
  backgroundTexture?: Texture;
  textureFit?: 'stretch' | 'cover' | 'contain' | 'tile' | 'center';
}): PositionedContainerResult => {
  return createPositionedContainer({
    gameContainerWidth,
    gameContainerHeight,
    width,
    height,
    x,
    y,
    anchor,
    backgroundColor,
    transparent,
    borderColor,
    borderWidth,
    borderRadius,
    scrollable,
    scrollHeight,
    backgroundTexture,
    textureFit
  });
};

/**
 * Creates a textured positioned container with focus on texture display
 */
export const createTexturedPositionedContainer = ({
  gameContainerWidth,
  gameContainerHeight,
  width = '100%',
  height = '100%',
  x = 0,
  y = 0,
  anchor = { x: 0, y: 0 },
  backgroundTexture,
  textureFit = 'contain',
  textureScale = 1,
  borderWidth = 0,
  borderRadius = 0,
  opacity = 1,
  transparent = false
}: {
  gameContainerWidth: number;
  gameContainerHeight: number;
  width?: number | string;
  height?: number | string;
  x?: number | string;
  y?: number | string;
  anchor?: { x: number; y: number };
  backgroundTexture: Texture;
  textureFit?: 'stretch' | 'cover' | 'contain' | 'tile' | 'center';
  textureScale?: number;
  borderWidth?: number;
  borderRadius?: number;
  opacity?: number;
  transparent?: boolean;
}): PositionedContainerResult => {
  return createPositionedContainer({
    gameContainerWidth,
    gameContainerHeight,
    width,
    height,
    x,
    y,
    anchor,
    backgroundTexture,
    textureFit,
    textureScale,
    borderWidth,
    borderRadius,
    opacity,
    transparent
  });
};