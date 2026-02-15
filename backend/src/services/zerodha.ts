import type { Connect, Exchanges } from 'kiteconnect';
import * as speakeasy from 'speakeasy';

// Use require for KiteConnect as it's a CommonJS module
const { KiteConnect } = require('kiteconnect');

export interface ZerodhaCredentials {
  apiKey: string;
  apiSecret: string;
  totpSecret: string;
  userId: string;
  password: string;
}

export interface ZerodhaPosition {
  tradingsymbol: string;
  exchange: string;
  quantity: number;
  average_price: number;
  last_price: number;
  pnl: number;
  product: string;
}

export interface ZerodhaOrder {
  order_id: string;
  tradingsymbol: string;
  exchange: string;
  transaction_type: string;
  quantity: number;
  price: number;
  status: string;
  order_timestamp: string | Date;
}

export class ZerodhaClient {
  private kite: Connect;
  private credentials: ZerodhaCredentials;
  private accessToken: string | null = null;
  private wsConnection: any = null;

  constructor(credentials: ZerodhaCredentials) {
    this.credentials = credentials;
    this.kite = new KiteConnect({
      api_key: credentials.apiKey,
    });
  }

  /**
   * Generate TOTP code for 2FA authentication
   */
  private generateTOTP(): string {
    return speakeasy.totp({
      secret: this.credentials.totpSecret,
      encoding: 'base32',
    });
  }

  /**
   * Auto-login to Zerodha using credentials and TOTP
   */
  async login(): Promise<boolean> {
    try {
      // Step 1: Get login URL
      const loginUrl = this.kite.getLoginURL();
      
      // Step 2: Simulate login (in production, use Puppeteer or similar)
      // For now, we'll use the manual flow with request token
      // This is a placeholder - actual implementation needs browser automation
      
      // Step 3: Generate TOTP
      const totp = this.generateTOTP();
      
      // Step 4: Complete login and get request token
      // This would be done via browser automation in production
      
      // For manual flow, user needs to provide request token
      // We'll implement the session generation part
      
      console.log('Login URL:', loginUrl);
      console.log('TOTP Code:', totp);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  /**
   * Set access token (from manual login or stored session)
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
    this.kite.setAccessToken(token);
  }

  /**
   * Generate session using request token
   */
  async generateSession(requestToken: string): Promise<string> {
    try {
      const response = await this.kite.generateSession(
        requestToken,
        this.credentials.apiSecret
      );
      this.accessToken = response.access_token;
      this.kite.setAccessToken(this.accessToken);
      return this.accessToken!;
    } catch (error) {
      console.error('Session generation failed:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<any> {
    try {
      return await this.kite.getProfile();
    } catch (error) {
      console.error('Failed to get profile:', error);
      throw error;
    }
  }

  /**
   * Get account balance
   */
  async getBalance(): Promise<number> {
    try {
      const margins = await this.kite.getMargins();
      return margins.equity?.available?.live_balance || 0;
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  /**
   * Get current positions
   */
  async getPositions(): Promise<ZerodhaPosition[]> {
    try {
      const positions = await this.kite.getPositions();
      return positions.net;
    } catch (error) {
      console.error('Failed to get positions:', error);
      throw error;
    }
  }

  /**
   * Get orders
   */
  async getOrders(): Promise<ZerodhaOrder[]> {
    try {
      return await this.kite.getOrders();
    } catch (error) {
      console.error('Failed to get orders:', error);
      throw error;
    }
  }

  /**
   * Place order
   */
  async placeOrder(params: {
    exchange: string;
    tradingsymbol: string;
    transaction_type: 'BUY' | 'SELL';
    quantity: number;
    product: 'MIS' | 'CNC' | 'NRML';
    order_type: 'MARKET' | 'LIMIT';
    price?: number;
    trigger_price?: number;
    validity?: 'DAY' | 'IOC';
  }): Promise<string> {
    try {
      const order = await this.kite.placeOrder('regular', params as any);
      return order.order_id;
    } catch (error) {
      console.error('Failed to place order:', error);
      throw error;
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      await this.kite.cancelOrder('regular', orderId);
      return true;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      return false;
    }
  }

  /**
   * Get historical data
   */
  async getHistoricalData(params: {
    instrument_token: number;
    from: Date;
    to: Date;
    interval: 'minute' | '3minute' | '5minute' | '15minute' | '30minute' | 'day';
  }): Promise<any[]> {
    try {
      return await this.kite.getHistoricalData(
        params.instrument_token,
        params.interval,
        params.from,
        params.to
      );
    } catch (error) {
      console.error('Failed to get historical data:', error);
      throw error;
    }
  }

  /**
   * Get instruments list
   */
  async getInstruments(exchange?: Exchanges): Promise<any[]> {
    try {
      return await this.kite.getInstruments(exchange);
    } catch (error) {
      console.error('Failed to get instruments:', error);
      throw error;
    }
  }

  /**
   * Connect to WebSocket for real-time data
   */
  connectWebSocket(tokens: number[], mode: 'ltp' | 'quote' | 'full' = 'quote'): void {
    try {
      const KiteTicker = require('kiteconnect').KiteTicker;
      const ticker = new KiteTicker({
        api_key: this.credentials.apiKey,
        access_token: this.accessToken,
      });

      ticker.connect();
      
      ticker.on('connect', () => {
        console.log('WebSocket connected');
        ticker.subscribe(tokens);
        ticker.setMode(mode, tokens);
      });

      ticker.on('ticks', (ticks: any[]) => {
        // Emit ticks to subscribers
        this.handleTicks(ticks);
      });

      ticker.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      ticker.on('error', (error: any) => {
        console.error('WebSocket error:', error);
      });

      ticker.on('reconnect', (reconnectCount: number, delay: number) => {
        console.log(`Reconnecting... Attempt ${reconnectCount}, delay ${delay}ms`);
      });

      this.wsConnection = ticker;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      throw error;
    }
  }

  /**
   * Handle incoming ticks
   */
  private handleTicks(ticks: any[]): void {
    // This will be overridden by the data streaming service
    console.log('Received ticks:', ticks.length);
  }

  /**
   * Set tick handler
   */
  onTick(handler: (ticks: any[]) => void): void {
    this.handleTicks = handler;
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket(): void {
    if (this.wsConnection) {
      this.wsConnection.disconnect();
      this.wsConnection = null;
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.accessToken !== null;
  }
}
