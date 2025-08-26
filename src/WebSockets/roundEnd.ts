import { GlobalState } from "../globals/gameState";
import { WebSocketService } from "./WebSocketService";

export const sendRoundEndEvent = async () => {
  const ws = WebSocketService.getInstance();
  console.log('Ending round...');
  return new Promise((resolve, reject) => {
    const handleResponse = (res: any) => {
      if (res?.status === '200 OK') {
        // Store balance but don't trigger listeners yet - will be triggered after reels stop and paylines are shown
        GlobalState.balance = res.balance;
        console.log(`💳 Balance stored (not triggered yet): ${res.balance}`);

        // Store reward but don't trigger listeners yet - will be triggered after reels stop and paylines are shown
        GlobalState.reward = res.reward;
        GlobalState.setPaylineMatrices(res.paylines);

        console.log('✅ Round ended successfully (balance and reward stored but not triggered yet)', res);
        resolve(res);
      } else {
        console.error('❌ Failed to end round:', res);
        reject(new Error(res));
      }
    };
    ws.once('round_events', handleResponse);
    ws.send('round_events', {
      operation: 'round_events',
      data: {
        eventType: 'round_end',
        tableId: GlobalState.getTableId(),
        roundId: GlobalState.getRoundId(),
        resultString: GlobalState.getResultString(),
      }
    });
  });
}
