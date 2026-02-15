import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime?: number;
  error?: string;
  timestamp: Date;
}

interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  lastCheck: string;
  responseTime?: number;
}

export class HealthMonitor {
  private checkInterval: NodeJS.Timeout | null = null;
  private healthHistory: Map<string, HealthCheckResult[]> = new Map();
  private readonly HISTORY_SIZE = 100; // Keep last 100 checks per service
  private readonly CHECK_INTERVAL = 60000; // 60 seconds

  constructor() {
    this.initializeHistory();
  }

  private initializeHistory() {
    const services = ['supabase', 'railway', 'vercel', 'zerodha', 'openai'];
    services.forEach(service => {
      this.healthHistory.set(service, []);
    });
  }

  /**
   * Start the health monitoring service
   */
  start() {
    console.log('Starting Health Monitor Service...');
    
    // Run initial check
    this.runHealthChecks();

    // Schedule periodic checks
    this.checkInterval = setInterval(() => {
      this.runHealthChecks();
    }, this.CHECK_INTERVAL);

    console.log(`Health Monitor running - checking every ${this.CHECK_INTERVAL / 1000} seconds`);
  }

  /**
   * Stop the health monitoring service
   */
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('Health Monitor stopped');
    }
  }

  /**
   * Run all health checks
   */
  private async runHealthChecks() {
    const checks = [
      this.checkSupabase(),
      this.checkRailway(),
      this.checkVercel(),
      this.checkZerodha(),
      this.checkOpenAI()
    ];

    const results = await Promise.allSettled(checks);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        this.recordHealthCheck(result.value);
      } else {
        console.error(`Health check failed:`, result.reason);
      }
    });
  }

  /**
   * Check Supabase database connectivity
   */
  private async checkSupabase(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Simple query to check database connectivity
      await prisma.$queryRaw`SELECT 1`;
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'supabase',
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        service: 'supabase',
        status: 'down',
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Check Railway service status
   */
  private async checkRailway(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Check if the backend service is responding
      const response = await axios.get(`${process.env.BACKEND_URL || 'http://localhost:3001'}/health`, {
        timeout: 5000
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'railway',
        status: response.status === 200 ? 'healthy' : 'degraded',
        responseTime,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        service: 'railway',
        status: 'down',
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Check Vercel deployment status
   */
  private async checkVercel(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Check if the frontend is accessible
      const response = await axios.get(process.env.FRONTEND_URL || 'http://localhost:3000', {
        timeout: 5000
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'vercel',
        status: response.status === 200 ? 'healthy' : 'degraded',
        responseTime,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        service: 'vercel',
        status: 'down',
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Check Zerodha API connectivity
   */
  private async checkZerodha(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Simple check to Zerodha API status endpoint
      const response = await axios.get('https://api.kite.trade/', {
        timeout: 5000
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'zerodha',
        status: response.status === 200 ? 'healthy' : 'degraded',
        responseTime,
        timestamp: new Date()
      };
    } catch (error: any) {
      // Zerodha API might return 401 for unauthenticated requests, which is still "healthy"
      if (error.response?.status === 401 || error.response?.status === 403) {
        return {
          service: 'zerodha',
          status: 'healthy',
          responseTime: Date.now() - startTime,
          timestamp: new Date()
        };
      }
      
      return {
        service: 'zerodha',
        status: 'down',
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Check OpenAI API connectivity
   */
  private async checkOpenAI(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Check OpenAI API status
      const response = await axios.get('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        timeout: 5000
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'openai',
        status: response.status === 200 ? 'healthy' : 'degraded',
        responseTime,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        service: 'openai',
        status: 'down',
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Record health check result
   */
  private recordHealthCheck(result: HealthCheckResult) {
    const history = this.healthHistory.get(result.service) || [];
    
    // Add new result
    history.push(result);
    
    // Keep only last N results
    if (history.length > this.HISTORY_SIZE) {
      history.shift();
    }
    
    this.healthHistory.set(result.service, history);
    
    // Log critical failures
    if (result.status === 'down') {
      console.error(`🔴 CRITICAL: ${result.service} is DOWN - ${result.error}`);
      this.sendAlert(result);
    } else if (result.status === 'degraded') {
      console.warn(`🟡 WARNING: ${result.service} is DEGRADED - Response time: ${result.responseTime}ms`);
    }
  }

  /**
   * Send alert for service failures
   */
  private async sendAlert(result: HealthCheckResult) {
    try {
      // Send alert to administrators
      console.log(`📧 Alert: ${result.service} is ${result.status}`);
      
      // Get all admin users
      const adminUsers = await prisma.user.findMany({
        where: { subscriptionPlan: 'admin' },
        select: { id: true, email: true, name: true }
      });
      
      // Send notifications to all admins
      for (const admin of adminUsers) {
        // TODO: Integrate with notification service to send email/push notifications
        console.log(`Notifying admin ${admin.email} about ${result.service} failure`);
        
        // For now, just log. In production, call notification service:
        // await notificationService.sendNotification({
        //   userId: admin.id,
        //   type: 'system_alert',
        //   title: `Service Alert: ${result.service}`,
        //   message: `${result.service} is ${result.status}. ${result.error || ''}`,
        //   priority: 'high'
        // });
      }
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  }

  /**
   * Get current health status for all services
   */
  getHealthStatus(): Record<string, ServiceHealth> {
    const status: Record<string, ServiceHealth> = {};
    
    this.healthHistory.forEach((history, service) => {
      if (history.length === 0) {
        status[service] = {
          status: 'down',
          uptime: 0,
          lastCheck: new Date().toISOString()
        };
        return;
      }
      
      const latestCheck = history[history.length - 1];
      const healthyChecks = history.filter(check => check.status === 'healthy').length;
      const uptime = (healthyChecks / history.length) * 100;
      
      status[service] = {
        status: latestCheck.status,
        uptime: Math.round(uptime * 10) / 10,
        lastCheck: latestCheck.timestamp.toISOString(),
        responseTime: latestCheck.responseTime
      };
    });
    
    return status;
  }

  /**
   * Get health history for a specific service
   */
  getServiceHistory(service: string): HealthCheckResult[] {
    return this.healthHistory.get(service) || [];
  }

  /**
   * Get uptime percentage for a service
   */
  getUptime(service: string): number {
    const history = this.healthHistory.get(service) || [];
    
    if (history.length === 0) return 0;
    
    const healthyChecks = history.filter(check => check.status === 'healthy').length;
    return Math.round((healthyChecks / history.length) * 1000) / 10;
  }
}

// Export singleton instance
export const healthMonitor = new HealthMonitor();
