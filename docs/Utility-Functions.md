# Utility Functions

The Utility Functions provide essential helper functions for game development and applications. These functions offer secure, reliable, and optimized solutions for common programming tasks, with a focus on cryptographically secure random number generation for fair gaming applications.

## Features

- Cryptographically secure random number generation
- Uniform distribution across specified ranges
- Browser-native security using Web Crypto API
- Suitable for gaming applications requiring fairness
- Simple, lightweight implementation
- Cross-browser compatibility

## Installation

These utility functions work in modern browsers that support the Web Crypto API. No additional dependencies required beyond standard browser APIs.

## Usage

Import the utility functions you need from the utilities module.

```jsx
import { getSecureRandomNumber } from './path/to/getRandom.js';
```

---

# getSecureRandomNumber Function

The `getSecureRandomNumber` function generates cryptographically secure random integers within a specified range using the browser's Web Crypto API.

## Features

- **Cryptographically Secure**: Uses `window.crypto.getRandomValues()` for true randomness
- **Uniform Distribution**: Ensures fair distribution across the entire range
- **Integer Results**: Returns whole numbers within the specified bounds
- **Inclusive Range**: Both minimum and maximum values are included in possible results
- **Gaming Suitable**: Appropriate for applications requiring fair random outcomes

## API Reference

### getSecureRandomNumber(min: number, max: number): number

Generates a cryptographically secure random integer between min and max (inclusive).

Parameters

- min (Number): Minimum value (inclusive)
- max (Number): Maximum value (inclusive)

Returns

- Number: Random integer between min and max (inclusive)

```jsx
const randomValue = getSecureRandomNumber(1, 100); // Random number from 1 to 100
console.log(randomValue); // e.g., 42
```

## Usage Examples

### Basic Random Number Generation

Generate random numbers for various game mechanics:

```jsx
import { getSecureRandomNumber } from './getRandom.js';

// Dice roll (1-6)
const diceRoll = getSecureRandomNumber(1, 6);
console.log(`Dice rolled: ${diceRoll}`);

// Percentage chance (0-100)
const chance = getSecureRandomNumber(0, 100);
if (chance <= 25) {
  console.log('25% chance event occurred!');
}

// Random array index
const items = ['sword', 'shield', 'potion', 'gold', 'gem'];
const randomIndex = getSecureRandomNumber(0, items.length - 1);
const randomItem = items[randomIndex];
console.log(`Found: ${randomItem}`);
```

### Slot Machine Reel Generation

Generate random symbols for slot machine reels:

```jsx
import { getSecureRandomNumber } from './getRandom.js';

// Define slot symbols
const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];

// Generate random reel
const generateReel = (positions = 3) => {
  const reel = [];
  for (let i = 0; i < positions; i++) {
    const symbolIndex = getSecureRandomNumber(0, symbols.length - 1);
    reel.push(symbols[symbolIndex]);
  }
  return reel;
};

// Generate 5 reels for a slot machine
const slotResult = [];
for (let reel = 0; reel < 5; reel++) {
  slotResult.push(generateReel(3));
}

console.log('Slot Result:', slotResult);
// Example output: [['🍒', '⭐', '🍋'], ['💎', '🍇', '🍊'], ...]
```

### Loot Box System

Create a fair loot box system with rarity tiers:

```jsx
import { getSecureRandomNumber } from './getRandom.js';

// Define loot rarities with drop rates
const lootTable = [
  { rarity: 'Common', items: ['Iron Sword', 'Leather Armor', 'Health Potion'], weight: 60 },
  { rarity: 'Rare', items: ['Steel Sword', 'Chain Mail', 'Mana Potion'], weight: 30 },
  { rarity: 'Epic', items: ['Magic Sword', 'Plate Armor', 'Elixir'], weight: 9 },
  { rarity: 'Legendary', items: ['Dragon Blade', 'Divine Armor', 'Phoenix Feather'], weight: 1 }
];

const openLootBox = () => {
  // Calculate total weight
  const totalWeight = lootTable.reduce((sum, tier) => sum + tier.weight, 0);
  
  // Generate random number within total weight
  const roll = getSecureRandomNumber(1, totalWeight);
  
  // Determine which tier was rolled
  let currentWeight = 0;
  for (const tier of lootTable) {
    currentWeight += tier.weight;
    if (roll <= currentWeight) {
      // Select random item from this tier
      const itemIndex = getSecureRandomNumber(0, tier.items.length - 1);
      return {
        rarity: tier.rarity,
        item: tier.items[itemIndex]
      };
    }
  }
};

// Open multiple loot boxes
for (let i = 0; i < 10; i++) {
  const loot = openLootBox();
  console.log(`Loot Box ${i + 1}: ${loot.rarity} - ${loot.item}`);
}
```

### Random Event System

Create random events with different probabilities:

```jsx
import { getSecureRandomNumber } from './getRandom.js';

// Define random events
const randomEvents = [
  { 
    name: 'Treasure Found', 
    probability: 15, 
    effect: () => console.log('🏆 You found a treasure chest!') 
  },
  { 
    name: 'Monster Encounter', 
    probability: 25, 
    effect: () => console.log('👹 A wild monster appears!') 
  },
  { 
    name: 'Merchant', 
    probability: 10, 
    effect: () => console.log('🛒 A traveling merchant offers his wares.') 
  },
  { 
    name: 'Nothing', 
    probability: 50, 
    effect: () => console.log('🌿 You continue on your journey.') 
  }
];

const triggerRandomEvent = () => {
  const roll = getSecureRandomNumber(1, 100);
  let cumulativeProbability = 0;
  
  for (const event of randomEvents) {
    cumulativeProbability += event.probability;
    if (roll <= cumulativeProbability) {
      event.effect();
      return event.name;
    }
  }
};

// Trigger random events
setInterval(() => {
  triggerRandomEvent();
}, 3000); // Every 3 seconds
```

### Card Shuffling Algorithm

Implement a fair card shuffling system:

```jsx
import { getSecureRandomNumber } from './getRandom.js';

// Create a standard deck of cards
const createDeck = () => {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = [];
  
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push(`${rank}${suit}`);
    }
  }
  
  return deck;
};

// Fisher-Yates shuffle using secure random
const shuffleDeck = (deck) => {
  const shuffled = [...deck]; // Create a copy
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getSecureRandomNumber(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
  }
  
  return shuffled;
};

// Usage
const originalDeck = createDeck();
const shuffledDeck = shuffleDeck(originalDeck);

console.log('Original deck:', originalDeck.slice(0, 5)); // First 5 cards
console.log('Shuffled deck:', shuffledDeck.slice(0, 5)); // First 5 cards after shuffle

// Deal hands
const dealHand = (deck, handSize = 5) => {
  return deck.splice(0, handSize);
};

const playerHand = dealHand(shuffledDeck);
const dealerHand = dealHand(shuffledDeck);

console.log('Player hand:', playerHand);
console.log('Dealer hand:', dealerHand);
```

### Random Position Generator

Generate random positions for game objects:

```jsx
import { getSecureRandomNumber } from './getRandom.js';

// Generate random positions within screen bounds
const generateRandomPosition = (screenWidth, screenHeight, margin = 50) => {
  return {
    x: getSecureRandomNumber(margin, screenWidth - margin),
    y: getSecureRandomNumber(margin, screenHeight - margin)
  };
};

// Generate multiple random positions ensuring minimum distance
const generateSpacedPositions = (count, screenWidth, screenHeight, minDistance = 100) => {
  const positions = [];
  const maxAttempts = 1000;
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let validPosition = false;
    
    while (!validPosition && attempts < maxAttempts) {
      const newPos = generateRandomPosition(screenWidth, screenHeight);
      
      // Check distance from existing positions
      validPosition = positions.every(existingPos => {
        const distance = Math.sqrt(
          Math.pow(newPos.x - existingPos.x, 2) + 
          Math.pow(newPos.y - existingPos.y, 2)
        );
        return distance >= minDistance;
      });
      
      if (validPosition) {
        positions.push(newPos);
      }
      
      attempts++;
    }
    
    // If we couldn't find a valid position, add it anyway
    if (!validPosition) {
      positions.push(generateRandomPosition(screenWidth, screenHeight));
    }
  }
  
  return positions;
};

// Usage
const enemyPositions = generateSpacedPositions(10, 800, 600, 80);
console.log('Enemy positions:', enemyPositions);
```

### Random Color Generator

Generate random colors for visual variety:

```jsx
import { getSecureRandomNumber } from './getRandom.js';

// Generate random RGB color
const generateRandomColor = () => {
  const r = getSecureRandomNumber(0, 255);
  const g = getSecureRandomNumber(0, 255);
  const b = getSecureRandomNumber(0, 255);
  
  return {
    rgb: `rgb(${r}, ${g}, ${b})`,
    hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
    pixi: (r << 16) | (g << 8) | b // PIXI.js color format
  };
};

// Generate random color from predefined palette
const generatePaletteColor = (palette) => {
  const index = getSecureRandomNumber(0, palette.length - 1);
  return palette[index];
};

// Usage
const randomColor = generateRandomColor();
console.log('Random color:', randomColor);

const gameColors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF];
const paletteColor = generatePaletteColor(gameColors);
console.log('Palette color:', paletteColor.toString(16));
```

## Security Considerations

### Why Use Cryptographically Secure Random Numbers?

1. **Fairness**: Ensures truly random outcomes in games
2. **Unpredictability**: Prevents players from predicting patterns
3. **Security**: Suitable for applications with monetary value
4. **Compliance**: Meets requirements for fair gaming applications

### Browser Compatibility

The `getSecureRandomNumber` function requires:
- Modern browsers supporting `window.crypto.getRandomValues()`
- HTTPS context (required for crypto API in most browsers)

### Fallback for Older Browsers

```jsx
const getRandomNumber = (min, max) => {
  // Check if crypto API is available
  if (window.crypto && window.crypto.getRandomValues) {
    return getSecureRandomNumber(min, max);
  } else {
    // Fallback to Math.random (less secure)
    console.warn('Using Math.random fallback - not cryptographically secure');
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};
```

## Performance Notes

- The function is very fast for typical gaming use cases
- Suitable for real-time applications
- No noticeable performance impact for normal usage patterns
- Consider caching results if generating large quantities of random numbers

## Best Practices

1. **Use for Fair Gaming**: Always use secure random for game mechanics affecting outcomes
2. **Range Validation**: Ensure min ≤ max before calling the function
3. **Error Handling**: Wrap in try-catch for production applications
4. **Testing**: Test random distributions in development to ensure fairness

```jsx
// Example with error handling
const safeGetSecureRandomNumber = (min, max) => {
  try {
    if (min > max) {
      throw new Error('Minimum value cannot be greater than maximum value');
    }
    return getSecureRandomNumber(min, max);
  } catch (error) {
    console.error('Random number generation failed:', error);
    return min; // Safe fallback
  }
};
```
