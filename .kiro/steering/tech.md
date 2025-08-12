# Technology Stack

## Core Technologies
- **PixiJS 8.7.3**: Main rendering engine for 2D graphics and animations
- **TypeScript 5.8.2**: Primary development language with type safety
- **Vite 6.2.4**: Build tool and development server
- **GSAP 3.12.7**: Animation library for smooth transitions and effects

## Audio & Media
- **@pixi/sound 6.0.1**: PixiJS audio plugin for game sounds
- **Howler 2.2.4**: Web audio library for cross-browser audio support

## Graphics & Effects
- **@pixi/filter-blur 7.4.3**: Blur effects for slot symbols
- **@pixi/graphics-extras 7.4.3**: Additional graphics utilities
- **@pixi/assets 7.4.3**: Asset loading and management

## Build System
- **Vite**: Modern build tool with hot module replacement
- **TypeScript**: Compiled to ES2017 with DOM libraries

## Common Commands
```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install
```

## Asset Management
- Assets loaded via PixiJS Assets API
- Supports PNG images, MP4 videos, OGG/MP3 audio, JSON sprite sheets
- Custom font loading with fallback support
- S3-based asset URLs for production deployment

## WebSocket Integration
- Real-time communication with game backend
- Handles game state, balance updates, and round management
- Token-based authentication for React mode