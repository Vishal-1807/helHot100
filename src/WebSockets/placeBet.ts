import { GlobalState } from "../globals/gameState";
import { WebSocketService } from "./WebSocketService";
import { sendRoundEndEvent } from "./roundEnd";

export const sendPlaceBetEvent = async () => {
  // Wait for WebSocket to connect
  const ws = WebSocketService.getInstance();

  console.log('Placing bet...');

  return new Promise(async (resolve, reject) => {
    const handleResponse = async (res: any) => {
      if (res?.status === '200 OK') {
        // Only set game started on successful bet placement and remove win modal if in case it exists
        GlobalState.setReward(0);
        GlobalState.setGameStarted(true);
        GlobalState.setBalance(res.balance);
        GlobalState.setResultString(res.winCombo);
        GlobalState.setReelMatrix(res.matrix);

        console.log('✅ Bet placed successfully - game started', res);

        try{
          // send round end event
          await sendRoundEndEvent();
          console.log('✅ Round ended successfully', res);
          resolve(res);
        }catch(error){
          console.error('❌ Failed to place bet:', error);
          reject(new Error(error));
        }

        // // Enable grid and pick random button
        // enableGrid();
        // enablePickRandomButton();

        // Show cashout and pick random buttons after successful bet
        // showGameButtons();
        resolve(res);
      } else {
        console.error('❌ Failed to place bet:', res);
        // Ensure game state is reset on failure
        GlobalState.setGameStarted(false);
        reject(new Error(res));
      }
    };
      ws.once('placebet', handleResponse);

      ws.send('placebet', {
        operation: 'placebet',
        data: {
          roundId: GlobalState.getRoundId(),
          tableId: GlobalState.getTableId(),
          stakeAmount: String(GlobalState.getStakeAmount()),
        }
      });
    });
}