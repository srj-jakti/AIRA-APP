import { PrismaClient } from '@prisma/client';
import CryptoJS from 'crypto-js';
import { ZerodhaClient, ZerodhaCredentials } from './zerodha';

const prisma = new PrismaClient();

export interface AdminAPIConfig {
  id: string;
  apiKey: string;
  apiSecret: string;
  totpSecret: string;
  userId: string;
  password: string;
  isActive: boolean;
  requestCount: number;
}

export class AdminDataAPIManager {
  private apiClients: Map<string, ZerodhaClient> = new Map();
  private requestCounts: Map<string, number> = new Map();
  private encryptionKey: string;
  private currentClientIndex: number = 0;

  constructor(encryptionKey: string) {
    this.encryptionKey = encryptionKey;
  }

  /**
   * Encrypt sensitive data
   */
  private encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
  }

  /**
   * Decrypt sensitive data
   */
  private decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Add new Admin Data API
   */
  async addAdminAPI(credentials: ZerodhaCredentials): Promise<string> {
    try {
      // Check if we already have 10 APIs
      const count = await prisma.adminDataAPI.count();
      if (count >= 10) {
        throw new Error('Maximum 10 Admin Data APIs allowed');
      }

      // Encrypt sensitive data
      const encryptedApiSecret = this.encrypt(credentials.apiSecret);
      const encryptedTotpSecret = this.encrypt(credentials.totpSecret);
      const encryptedPassword = this.encrypt(credentials.password);
      const encryptedLoginId = this.encrypt(credentials.userId); // Use userId as loginId

      // Save to database
      const adminAPI = await prisma.adminDataAPI.create({
        data: {
          apiKey: credentials.apiKey,
          apiSecret: encryptedApiSecret,
          totpSecret: encryptedTotpSecret,
          loginId: encryptedLoginId,
          userId: credentials.userId,
          password: encryptedPassword,
          isActive: true,
          requestCount: 0,
        },
      });

      // Initialize client
      const client = new ZerodhaClient(credentials);
      this.apiClients.set(adminAPI.id, client);
      this.requestCounts.set(adminAPI.id, 0);

      return adminAPI.id;
    } catch (error) {
      console.error('Failed to add Admin API:', error);
      throw error;
    }
  }

  /**
   * Update Admin Data API
   */
  async updateAdminAPI(id: string, credentials: Partial<ZerodhaCredentials>): Promise<void> {
    try {
      const updateData: any = {};

      if (credentials.apiKey) updateData.apiKey = credentials.apiKey;
      if (credentials.apiSecret) updateData.apiSecret = this.encrypt(credentials.apiSecret);
      if (credentials.totpSecret) updateData.totpSecret = this.encrypt(credentials.totpSecret);
      if (credentials.userId) updateData.userId = credentials.userId;
      if (credentials.password) updateData.password = this.encrypt(credentials.password);

      await prisma.adminDataAPI.update({
        where: { id },
        data: updateData,
      });

      // Reload client if exists
      if (this.apiClients.has(id)) {
        const fullCredentials = await this.getDecryptedCredentials(id);
        const client = new ZerodhaClient(fullCredentials);
        this.apiClients.set(id, client);
      }
    } catch (error) {
      console.error('Failed to update Admin API:', error);
      throw error;
    }
  }

  /**
   * Delete Admin Data API
   */
  async deleteAdminAPI(id: string): Promise<void> {
    try {
      await prisma.adminDataAPI.delete({
        where: { id },
      });

      // Remove from memory
      this.apiClients.delete(id);
      this.requestCounts.delete(id);
    } catch (error) {
      console.error('Failed to delete Admin API:', error);
      throw error;
    }
  }

  /**
   * Get all Admin Data APIs
   */
  async getAllAdminAPIs(): Promise<AdminAPIConfig[]> {
    try {
      const apis = await prisma.adminDataAPI.findMany();
      
      return apis.map(api => ({
        id: api.id,
        apiKey: api.apiKey,
        apiSecret: '***', // Don't expose
        totpSecret: '***', // Don't expose
        userId: api.userId || '', // Handle nullable
        password: '***', // Don't expose
        isActive: api.isActive,
        requestCount: api.requestCount,
      }));
    } catch (error) {
      console.error('Failed to get Admin APIs:', error);
      throw error;
    }
  }

  /**
   * Get decrypted credentials for internal use
   */
  private async getDecryptedCredentials(id: string): Promise<ZerodhaCredentials> {
    const api = await prisma.adminDataAPI.findUnique({
      where: { id },
    });

    if (!api) {
      throw new Error('Admin API not found');
    }

    return {
      apiKey: api.apiKey,
      apiSecret: this.decrypt(api.apiSecret),
      totpSecret: this.decrypt(api.totpSecret),
      userId: api.userId || '', // Handle nullable
      password: this.decrypt(api.password),
    };
  }

  /**
   * Load all Admin APIs into memory
   */
  async loadAllAPIs(): Promise<void> {
    try {
      const apis = await prisma.adminDataAPI.findMany({
        where: { isActive: true },
      });

      for (const api of apis) {
        const credentials = await this.getDecryptedCredentials(api.id);
        const client = new ZerodhaClient(credentials);
        this.apiClients.set(api.id, client);
        this.requestCounts.set(api.id, api.requestCount);
      }

      console.log(`Loaded ${apis.length} Admin Data APIs`);
    } catch (error) {
      console.error('Failed to load Admin APIs:', error);
      throw error;
    }
  }

  /**
   * Get next available client using round-robin load balancing
   */
  getNextClient(): ZerodhaClient | null {
    const activeClients = Array.from(this.apiClients.entries()).filter(
      ([id, client]) => client.isConnected()
    );

    if (activeClients.length === 0) {
      return null;
    }

    // Round-robin selection
    const [id, client] = activeClients[this.currentClientIndex % activeClients.length];
    this.currentClientIndex++;

    // Increment request count
    const currentCount = this.requestCounts.get(id) || 0;
    this.requestCounts.set(id, currentCount + 1);

    // Update in database periodically (every 100 requests)
    if (currentCount % 100 === 0) {
      this.updateRequestCount(id, currentCount + 1);
    }

    return client;
  }

  /**
   * Get client with least requests (for better load distribution)
   */
  getLeastLoadedClient(): ZerodhaClient | null {
    const activeClients = Array.from(this.apiClients.entries()).filter(
      ([id, client]) => client.isConnected()
    );

    if (activeClients.length === 0) {
      return null;
    }

    // Find client with minimum request count
    let minCount = Infinity;
    let selectedId = '';
    let selectedClient: ZerodhaClient | null = null;

    for (const [id, client] of activeClients) {
      const count = this.requestCounts.get(id) || 0;
      if (count < minCount) {
        minCount = count;
        selectedId = id;
        selectedClient = client;
      }
    }

    if (selectedClient && selectedId) {
      // Increment request count
      this.requestCounts.set(selectedId, minCount + 1);
      
      // Update in database periodically
      if (minCount % 100 === 0) {
        this.updateRequestCount(selectedId, minCount + 1);
      }
    }

    return selectedClient;
  }

  /**
   * Update request count in database
   */
  private async updateRequestCount(id: string, count: number): Promise<void> {
    try {
      await prisma.adminDataAPI.update({
        where: { id },
        data: { requestCount: count },
      });
    } catch (error) {
      console.error('Failed to update request count:', error);
    }
  }

  /**
   * Test API connectivity
   */
  async testConnection(id: string): Promise<boolean> {
    try {
      const client = this.apiClients.get(id);
      if (!client) {
        throw new Error('Client not found');
      }

      await client.getProfile();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Set access token for an API
   */
  async setAccessToken(id: string, token: string): Promise<void> {
    const client = this.apiClients.get(id);
    if (client) {
      client.setAccessToken(token);
    }
  }

  /**
   * Get all active clients
   */
  getActiveClients(): ZerodhaClient[] {
    return Array.from(this.apiClients.values()).filter(client => client.isConnected());
  }

  /**
   * Get client count
   */
  getClientCount(): number {
    return this.apiClients.size;
  }

  /**
   * Get active client count
   */
  getActiveClientCount(): number {
    return this.getActiveClients().length;
  }
}
