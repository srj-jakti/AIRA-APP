declare module 'razorpay' {
  interface RazorpayConfig {
    key_id: string;
    key_secret: string;
  }

  interface OrderOptions {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, any>;
  }

  interface Order {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string | null;
    status: string;
    attempts: number;
    notes: Record<string, any>;
    created_at: number;
  }

  interface RefundOptions {
    amount?: number;
    notes?: Record<string, any>;
  }

  interface Refund {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    payment_id: string;
    notes: Record<string, any>;
    receipt: string | null;
    acquirer_data: Record<string, any>;
    created_at: number;
    batch_id: string | null;
    status: string;
    speed_processed: string;
    speed_requested: string;
  }

  interface Orders {
    create(options: OrderOptions): Promise<Order>;
    fetch(orderId: string): Promise<Order>;
    all(options?: any): Promise<{ items: Order[] }>;
  }

  interface Payments {
    fetch(paymentId: string): Promise<any>;
    refund(paymentId: string, options?: RefundOptions): Promise<Refund>;
    all(options?: any): Promise<{ items: any[] }>;
  }

  class Razorpay {
    constructor(config: RazorpayConfig);
    orders: Orders;
    payments: Payments;
  }

  export default Razorpay;
}
