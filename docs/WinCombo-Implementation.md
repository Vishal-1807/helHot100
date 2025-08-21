# WinCombo Implementation Guide

## Overview

The WinCombo system parses server-provided winning combinations and processes existing payline matrices to create winning payline visualizations. This document explains how the WinCombo format works and how it's implemented.

## WinCombo Format

```
LINE14_CHERRY_3:LINE88_CHERRY_3:LINE0_SCATTER_8:
```

### Format Structure

Each WinCombo consists of multiple payline entries separated by colons (`:`):

- **Format**: `LINEX_ICON_COUNT:`
- **LINEX**: Payline number from backend (this number doesn't matter for processing)
- **ICON**: Icon type (e.g., CHERRY, SCATTER, SEVEN, WILD)
- **COUNT**: Number of matching icons

### Processing Rules

**IMPORTANT**: Each WinCombo entry corresponds to existing payline matrices **row-wise** (in order):

1. **Regular Paylines** (all except last): Use only the first `COUNT` positions from the corresponding payline matrix
2. **Last Payline** (typically scatter): Use ALL positions from the corresponding payline matrix, ignoring the count

### Example Mapping

If you have existing payline matrices:
```typescript
paylineMatrices[0] = [[0,0], [0,1], [0,2], [0,3], [0,4]]  // Top row
paylineMatrices[1] = [[1,0], [1,1], [1,2], [1,3], [1,4]]  // Middle row
paylineMatrices[2] = [[2,0], [2,1], [2,2], [2,3], [2,4]]  // Bottom row
```

And WinCombo: `"LINE14_CHERRY_3:LINE88_CHERRY_3:LINE0_SCATTER_8:"`

Then:
- `LINE14_CHERRY_3` → Use first 3 positions from `paylineMatrices[0]` → `[[0,0], [0,1], [0,2]]`
- `LINE88_CHERRY_3` → Use first 3 positions from `paylineMatrices[1]` → `[[1,0], [1,1], [1,2]]`
- `LINE0_SCATTER_8` → Use ALL positions from `paylineMatrices[2]` (last entry) → `[[2,0], [2,1], [2,2], [2,3], [2,4]]`

## Implementation

### 1. Existing Payline Matrices

The system works with existing payline matrices stored in GlobalState. These matrices define the actual payline patterns used in the game:

```typescript
// Example payline matrices (these come from your game's payline system)
const paylineMatrices = [
  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], // Matrix 0: Top row
  [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]], // Matrix 1: Middle row
  [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]], // Matrix 2: Bottom row
  [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]], // Matrix 3: V-shape
  // ... more payline matrices as defined by your game
];
```

### 2. Parsing Function

The `parseWinCombo()` function processes WinCombo strings against existing payline matrices:

```typescript
const parseWinCombo = (winCombo: string): number[][][] => {
  // Get existing payline matrices from GlobalState
  const existingPaylineMatrices = GlobalState.getPaylineMatrices();

  // Parse each WinCombo entry and map to corresponding matrix
  // Apply count rules based on position in WinCombo
  // Return processed position matrices
};
```

### 3. Integration with Spin Handler

The spin handler automatically processes WinCombo:

```typescript
// Parse WinCombo to get payline matrices
const winCombo = GlobalState.getWinCombo();
const paylineMatrices = parseWinCombo(winCombo);

// Store and visualize
GlobalState.setPaylineMatrices(paylineMatrices);
// Create visual paylines...
```

## Usage Examples

### Example 1: Basic Usage

```typescript
import { GlobalState } from '../globals/gameState';

// Server provides WinCombo
const winCombo = "LINE1_SEVEN_5:LINE3_CHERRY_4:LINE0_SCATTER_8:";

// Set in GlobalState
GlobalState.setWinCombo(winCombo);

// Spin handler automatically processes it
```

### Example 2: Custom Paylines

```typescript
import { addPaylineDefinition } from '../components/Logic/spinClickHandler';

// Add custom payline
addPaylineDefinition(25, [
  [0, 0], [1, 1], [0, 2], [1, 3], [0, 4] // Custom pattern
]);

// Use in WinCombo
const customWinCombo = "LINE25_WILD_4:";
GlobalState.setWinCombo(customWinCombo);
```

## Detailed Example Breakdown

### Input WinCombo
```
LINE14_CHERRY_3:LINE88_CHERRY_3:LINE0_SCATTER_8:
```

### Existing Payline Matrices
```typescript
paylineMatrices[0] = [[0,0], [0,1], [0,2], [0,3], [0,4]]  // Top row
paylineMatrices[1] = [[1,0], [1,1], [1,2], [1,3], [1,4]]  // Middle row
paylineMatrices[2] = [[2,0], [2,1], [2,2], [2,3], [2,4]]  // Bottom row
```

### Processing Steps

1. **Split by colon**: `["LINE14_CHERRY_3", "LINE88_CHERRY_3", "LINE0_SCATTER_8"]`

2. **Parse each entry** (LINE numbers are ignored):
   - Entry 0: `LINE14_CHERRY_3` → Cherry icons, count 3
   - Entry 1: `LINE88_CHERRY_3` → Cherry icons, count 3
   - Entry 2: `LINE0_SCATTER_8` → Scatter icons, count 8 (last entry)

3. **Map to payline matrices row-wise**:
   - **Entry 0** → `paylineMatrices[0]`: Use first 3 positions → `[[0,0], [0,1], [0,2]]`
   - **Entry 1** → `paylineMatrices[1]`: Use first 3 positions → `[[1,0], [1,1], [1,2]]`
   - **Entry 2** → `paylineMatrices[2]`: Use ALL positions (last entry) → `[[2,0], [2,1], [2,2], [2,3], [2,4]]`

4. **Result**: Array of processed position matrices for rendering

## API Reference

### Core Functions

#### `parseWinCombo(winCombo: string): number[][][]`
Parses WinCombo string into payline matrices.

**Parameters:**
- `winCombo`: WinCombo string from server

**Returns:**
- Array of payline position matrices

#### `addPaylineDefinition(lineNumber: number, positions: number[][])`
Adds or updates a payline definition.

**Parameters:**
- `lineNumber`: Payline number (e.g., 25 for LINE25)
- `positions`: Array of [row, col] positions

#### `getAvailablePaylines(): number[]`
Returns array of all available payline numbers.

#### `testWinComboParsing()`
Runs test cases to demonstrate WinCombo parsing.

### Integration Points

#### GlobalState Methods
- `GlobalState.setWinCombo(winCombo: string)`: Store WinCombo
- `GlobalState.getWinCombo(): string`: Retrieve WinCombo
- `GlobalState.setPaylineMatrices(matrices: number[][][])`: Store parsed matrices
- `GlobalState.getPaylineMatrices(): number[][][]`: Retrieve matrices

## Testing

### Run Tests
```typescript
import { testWinComboParsing } from '../components/Logic/spinClickHandler';

// Run built-in tests
testWinComboParsing();
```

### Custom Tests
```typescript
import { runAllWinComboExamples } from '../examples/winComboExample';

// Run comprehensive examples
runAllWinComboExamples();
```

## Matrix Coordinate System

The slot machine uses a 4x5 grid (4 rows, 5 columns):

```
[0,0] [0,1] [0,2] [0,3] [0,4]  <- Top row
[1,0] [1,1] [1,2] [1,3] [1,4]  <- Middle row  
[2,0] [2,1] [2,2] [2,3] [2,4]  <- Bottom row
[3,0] [3,1] [3,2] [3,3] [3,4]  <- Bottom row (if 4 rows)
```

Positions are defined as `[row, column]` arrays.

## Best Practices

1. **Always validate WinCombo format** before processing
2. **Handle missing payline definitions** gracefully
3. **Log parsing steps** for debugging
4. **Test with various WinCombo formats**
5. **Use helper functions** for adding custom paylines

## Troubleshooting

### Common Issues

1. **Invalid WinCombo format**: Check for proper `LINEX_ICON_COUNT` structure
2. **Missing payline definition**: Add definition using `addPaylineDefinition()`
3. **Incorrect position count**: Verify payline definitions have correct positions
4. **Empty results**: Check for empty or malformed WinCombo strings

### Debug Tips

- Enable console logging to trace parsing steps
- Use `testWinComboParsing()` to verify functionality
- Check `getAvailablePaylines()` for supported payline numbers
- Verify GlobalState contains correct WinCombo data
