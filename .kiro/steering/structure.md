# Project Structure

## Root Structure
- `src/` - Main source code
- `public/` - Static assets (images, sounds, sprites)
- `docs/` - Component documentation
- `index.html` - Entry point with splash screen setup

## Source Organization (`src/`)

### Core Files
- `main.ts` - Application entry point and initialization
- `loader.ts` - Asset loading and splash screen management
- `global.d.ts` - TypeScript global declarations

### Components (`src/components/`)
- `gameContainer.ts` - Main game container with responsive layout
- `commons/` - Reusable UI components (Button, Popup, Text, etc.)
- `constants/` - Game constants, positions, colors, z-index values
- `BottomBar/` - Bet controls, spin buttons, winnings display
- `TopBar/` - Balance, home, settings, rules buttons
- `ReelContainer/` - Slot reel mechanics and animations
- `Logic/` - Game logic for reel animations and slot mechanics
- `popups/` - Win popups and settings/rules content

### Global State (`src/globals/`)
- `gameState.ts` - Centralized state management with listeners

### Utilities (`src/utils/`)
- `SoundManager.ts` - Audio system management
- `gameActivityManager.ts` - User inactivity handling
- `gameButtonStateManager.ts` - Button state coordination
- `uiVisibilityManager.ts` - UI show/hide animations

### WebSocket (`src/WebSockets/`)
- `WebSocketService.ts` - Real-time backend communication
- `loadHistory.ts` - Game history management
- `token.ts` - Authentication handling

## Asset Structure (`public/`)
- `assets/` - UI textures, slot symbols, backgrounds
- `sounds/` - Audio files (OGG/MP3)
- `sprites/` - JSON sprite sheets with animations

## Architecture Patterns

### Component Creation
- Factory functions that return PixiJS containers
- Consistent resize() methods for responsive design
- Event listener cleanup and state management

### State Management
- GlobalState singleton with listener patterns
- Reactive updates via callback subscriptions
- Centralized game state with WebSocket sync

### Responsive Design
- Percentage-based positioning for UI elements
- Automatic scaling and repositioning on resize

### Asset Loading
- Centralized asset definitions in loader.ts
- Alias-based asset references
- S3 URL configuration for production deployment