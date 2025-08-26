import { GlobalState } from "../globals/gameState";
import { WebSocketService } from "./WebSocketService";
import { sendPlaceBetEvent } from "./placeBet";

export const sendRoundStartEvent = async () => {
  // Early validation - check balance before making any WebSocket calls
  if (GlobalState.getStakeAmount() > GlobalState.getBalance()) {
    if (typeof window.openLowBalancePopup === 'function') {
      window.openLowBalancePopup();
    }
    console.log('Low balance popup triggered - stopping game initialization');
    return false; // Return false to indicate failure
  }

  const ws = WebSocketService.getInstance();
  console.log('Starting round...');
  return new Promise((resolve, reject) => {
    const handleResponse = async (res: any) => {
      if (res?.status === '200 OK') {
        GlobalState.setReward(0);
        GlobalState.setRoundId(res.roundId);

        // Update balance immediately for round start (if needed)
        GlobalState.setBalance(res.balance);
        console.log(`💳 Balance updated at round start: ${res.balance}`);

        console.log('✅ Round started successfully, now placing bet...', res);

        try {
          // Wait for bet placement to complete
          await sendPlaceBetEvent();
          resolve(res);
        } catch (betError) {
          console.error('❌ Bet placement failed after round start:', betError);
          reject(new Error(betError));
        }
      } else {
        console.error('❌ Failed to start round:', res);
        reject(new Error(res));
      }
    };
    ws.once('round_events', handleResponse);
    ws.send('round_events', {
      operation: 'round_events',
      data: {
        eventType: 'round_start',
        tableId: GlobalState.getTableId(),
      }
    });
  });
}