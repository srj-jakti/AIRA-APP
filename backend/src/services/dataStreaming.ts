import { Server } from 'socket.io';
import { AdminDataAPIManager } from './adminDataAPI';
import { ZerodhaClient } from './zerodha';

export interface MarketTick {
  instrument_token: number;
  last_price: number;
  volume: number;
  buy_quantity: number;
  sell_quantity: number;
  change: number;
  timestamp: Date;
}

export class DataStreamingService {
  private io: Server;
  private adminAPIManager: AdminDataAPIManager;
  private activeClient: ZerodhaClient | null = null;
  private subscribedTokens: Set<number> = new Set();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 2000;
  private isConnecting: boolean = false;
  private lastTickTimestamp: number = Date.now();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(io: Server, adminAPIManager: AdminDataAPIManager) {
    this.io = io;
    this.adminAPIManager = adminAPIManager;
    this.startHealthCheck();
  }

  /**
   * Start health check to detect connection issues
   */
  private startHealthCheck(): void {
    this.healthCheckInterval = setInterval(() => {
      const timeSinceLastTick = Date.now() - this.lastTickTimestamp;
      
      // If no ticks received for 10 seconds during market hours, reconnect
      if (timeSinceLastTick > 10000 && this.isMarketHours()) {
        console.warn('No ticks received for 10 seconds, attempting reconnect...');
        this.handleFailover();
      }
    }, 5000);
  }

  /**
   * Check if current time is during market hours
   */
  private isMarketHours(): boolean {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    
    // Market hours: 9:15 AM to 3:30 PM IST
    const marketOpen = 9 * 60 + 15; // 9:15 AM
    const marketClose = 15 * 60 + 30; // 3:30 PM
    
    // Check if it's a weekday (Monday-Friday)
    const day = now.getDay();
    const isWeekday = day >= 1 && day <= 5;
    
    return isWeekday && currentTime >= marketOpen && currentTime <= marketClose;
  }

  /**
   * Connect to WebSocket using available Admin API
   */
  async connect(): Promise<boolean> {
    if (this.isConnecting) {
      console.log('Connection already in progress...');
      return false;
    }

    this.isConnecting = true;

    try {
      // Get next available client
      const client = this.adminAPIManager.getNextClient();
      
      if (!client) {
        console.error('No active Admin API clients available');
        this.isConnecting = false;
        return false;
      }

      // Disconnect previous client if exists
      if (this.activeClient) {
        this.activeClient.disconnectWebSocket();
      }

      // Set up tick handler
      client.onTick((ticks: any[]) => {
        this.handleTicks(ticks);
      });

      // Connect WebSocket
      const tokens = Array.from(this.subscribedTokens);
      if (tokens.length > 0) {
        client.connectWebSocket(tokens, 'quote');
      }

      this.activeClient = client;
      this.reconnectAttempts = 0;
      this.isConnecting = false;
      
      console.log('WebSocket connected successfully');
      return true;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.isConnecting = false;
      return false;
    }
  }

  /**
   * Handle incoming ticks
   */
  private handleTicks(ticks: any[]): void {
    this.lastTickTimestamp = Date.now();
    
    // Transform ticks to our format
    const marketTicks: MarketTick[] = ticks.map(tick => ({
      instrument_token: tick.instrument_token,
      last_price: tick.last_price,
      volume: tick.volume,
      buy_quantity: tick.buy_quantity,
      sell_quantity: tick.sell_quantity,
      change: tick.change,
      timestamp: new Date(),
    }));

    // Broadcast to all connected clients
    this.io.emit('market:ticks', marketTicks);
  }

  /**
   * Handle failover to another API
   */
  private async handleFailover(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      this.io.emit('market:error', { 
        message: 'Unable to connect to market data. Please try again later.' 
      });
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting failover (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    // Wait before reconnecting
    await new Promise(resolve => setTimeout(resolve, this.reconnectDelay));

    // Try to connect with next available client
    const connected = await this.connect();

    if (!connected) {
      // Exponential backoff
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
      await this.handleFailover();
    } else {
      // Reset delay on successful connection
      this.reconnectDelay = 2000;
    }
  }

  /**
   * Subscribe to instruments
   */
  async subscribe(tokens: number[]): Promise<void> {
    // Add tokens to subscribed set
    tokens.forEach(token => this.subscribedTokens.add(token));

    // If already connected, subscribe to new tokens
    if (this.activeClient) {
      try {
        this.activeClient.disconnectWebSocket();
        this.activeClient.connectWebSocket(Array.from(this.subscribedTokens), 'quote');
      } catch (error) {
        console.error('Failed to subscribe to tokens:', error);
        await this.handleFailover();
      }
    } else {
      // Connect if not already connected
      await this.connect();
    }
  }

  /**
   * Unsubscribe from instruments
   */
  async unsubscribe(tokens: number[]): Promise<void> {
    // Remove tokens from subscribed set
    tokens.forEach(token => this.subscribedTokens.delete(token));

    // If still have subscriptions, reconnect with updated list
    if (this.subscribedTokens.size > 0 && this.activeClient) {
      try {
        this.activeClient.disconnectWebSocket();
        this.activeClient.connectWebSocket(Array.from(this.subscribedTokens), 'quote');
      } catch (error) {
        console.error('Failed to unsubscribe from tokens:', error);
        await this.handleFailover();
      }
    } else if (this.subscribedTokens.size === 0) {
      // Disconnect if no more subscriptions
      this.disconnect();
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.activeClient) {
      this.activeClient.disconnectWebSocket();
      this.activeClient = null;
    }
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    this.subscribedTokens.clear();
    this.reconnectAttempts = 0;
    console.log('WebSocket disconnected');
  }

  /**
   * Get connection status
   */
  getStatus(): {
    connected: boolean;
    subscribedCount: number;
    activeClient: boolean;
    reconnectAttempts: number;
  } {
    return {
      connected: this.activeClient !== null,
      subscribedCount: this.subscribedTokens.size,
      activeClient: this.activeClient?.isConnected() || false,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  /**
   * Force reconnect
   */
  async forceReconnect(): Promise<boolean> {
    console.log('Forcing reconnect...');
    this.disconnect();
    return await this.connect();
  }
}
