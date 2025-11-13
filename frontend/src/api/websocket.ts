import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { GenerationProgress } from '@/types';

export class StoryProgressWebSocket {
  private client: Client | null = null;
  private onProgressCallback: ((progress: GenerationProgress) => void) | null = null;

  connect(storyId: string, onProgress: (progress: GenerationProgress) => void) {
    this.onProgressCallback = onProgress;

    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws/story-progress';

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl) as any,
      debug: (str) => {
        console.log('[WebSocket]', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('[WebSocket] Connected');
      this.client?.subscribe(`/topic/story-progress/${storyId}`, (message) => {
        const progress: GenerationProgress = JSON.parse(message.body);
        if (this.onProgressCallback) {
          this.onProgressCallback(progress);
        }
      });
    };

    this.client.onStompError = (frame) => {
      console.error('[WebSocket] Error:', frame.headers['message']);
      console.error('[WebSocket] Details:', frame.body);
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.onProgressCallback = null;
      console.log('[WebSocket] Disconnected');
    }
  }
}
