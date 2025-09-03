// Payment Gateway Integration Service for SkyShip Logistics
// Handles payments for premium subscriptions and services

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  customerId: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  paymentMethodId: string;
  customerId: string;
  description: string;
  metadata: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethodId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  trialDays: number;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export interface PaymentError {
  code: string;
  message: string;
  details?: any;
}

class PaymentGatewayService {
  private paymentMethods: PaymentMethod[] = [];
  private paymentIntents: PaymentIntent[] = [];
  private subscriptions: Subscription[] = [];
  private plans: PaymentPlan[] = [];

  constructor() {
    this.initializePlans();
    this.loadFromStorage();
  }

  private initializePlans() {
    this.plans = [
      {
        id: 'basic-monthly',
        name: 'Basic Plan',
        description: 'Essential shipping services with basic support',
        amount: 999, // $9.99
        currency: 'usd',
        interval: 'month',
        trialDays: 7,
        features: [
          'Priority customer support',
          'Enhanced tracking',
          'Email notifications',
          'Basic analytics'
        ],
        isActive: true
      },
      {
        id: 'basic-yearly',
        name: 'Basic Plan (Annual)',
        description: 'Essential shipping services with basic support - Save 20%',
        amount: 9590, // $95.90 (20% off)
        currency: 'usd',
        interval: 'year',
        trialDays: 7,
        features: [
          'Priority customer support',
          'Enhanced tracking',
          'Email notifications',
          'Basic analytics',
          '20% annual discount'
        ],
        isActive: true
      },
      {
        id: 'premium-monthly',
        name: 'Premium Plan',
        description: 'Advanced features with dedicated support',
        amount: 1999, // $19.99
        currency: 'usd',
        interval: 'month',
        trialDays: 7,
        features: [
          'All Basic features',
          'Dedicated account manager',
          'Real-time tracking',
          'Advanced analytics',
          'Custom reporting',
          'Priority shipping rates'
        ],
        isPopular: true,
        isActive: true
      },
      {
        id: 'premium-yearly',
        name: 'Premium Plan (Annual)',
        description: 'Advanced features with dedicated support - Save 25%',
        amount: 17990, // $179.90 (25% off)
        currency: 'usd',
        interval: 'year',
        trialDays: 7,
        features: [
          'All Basic features',
          'Dedicated account manager',
          'Real-time tracking',
          'Advanced analytics',
          'Custom reporting',
          'Priority shipping rates',
          '25% annual discount'
        ],
        isPopular: true,
        isActive: true
      },
      {
        id: 'enterprise-monthly',
        name: 'Enterprise Plan',
        description: 'Full-service logistics with white-glove support',
        amount: 4999, // $49.99
        currency: 'usd',
        interval: 'month',
        trialDays: 14,
        features: [
          'All Premium features',
          'Custom logistics solutions',
          'White-glove delivery service',
          '24/7 emergency support',
          'Custom integrations',
          'Dedicated logistics consultant',
          'Volume discounts'
        ],
        isActive: true
      },
      {
        id: 'enterprise-yearly',
        name: 'Enterprise Plan (Annual)',
        description: 'Full-service logistics with white-glove support - Save 30%',
        amount: 41990, // $419.90 (30% off)
        currency: 'usd',
        interval: 'year',
        trialDays: 14,
        features: [
          'All Premium features',
          'Custom logistics solutions',
          'White-glove delivery service',
          '24/7 emergency support',
          'Custom integrations',
          'Dedicated logistics consultant',
          'Volume discounts',
          '30% annual discount'
        ],
        isActive: true
      }
    ];
  }

  private loadFromStorage() {
    try {
      const savedPaymentMethods = localStorage.getItem('paymentMethods');
      const savedPaymentIntents = localStorage.getItem('paymentIntents');
      const savedSubscriptions = localStorage.getItem('subscriptions');
      
      if (savedPaymentMethods) {
        this.paymentMethods = JSON.parse(savedPaymentMethods);
      }
      
      if (savedPaymentIntents) {
        this.paymentIntents = JSON.parse(savedPaymentIntents);
      }
      
      if (savedSubscriptions) {
        this.subscriptions = JSON.parse(savedSubscriptions);
      }
    } catch (error) {
      console.error('Error loading payment data from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('paymentMethods', JSON.stringify(this.paymentMethods));
      localStorage.setItem('paymentIntents', JSON.stringify(this.paymentIntents));
      localStorage.setItem('subscriptions', JSON.stringify(this.subscriptions));
    } catch (error) {
      console.error('Error saving payment data to storage:', error);
    }
  }

  // Plan Management
  getPlans(): PaymentPlan[] {
    return this.plans.filter(plan => plan.isActive);
  }

  getPlanById(id: string): PaymentPlan | undefined {
    return this.plans.find(plan => plan.id === id);
  }

  getPopularPlans(): PaymentPlan[] {
    return this.plans.filter(plan => plan.isPopular && plan.isActive);
  }

  // Payment Method Management
  async addPaymentMethod(customerId: string, paymentMethodData: {
    type: 'card' | 'paypal' | 'bank_transfer';
    cardNumber?: string;
    expiryMonth?: number;
    expiryYear?: number;
    cvv?: string;
    paypalEmail?: string;
    bankAccount?: string;
  }): Promise<PaymentMethod> {
    try {
      // Simulate payment method validation
      if (paymentMethodData.type === 'card') {
        if (!paymentMethodData.cardNumber || !paymentMethodData.expiryMonth || !paymentMethodData.expiryYear || !paymentMethodData.cvv) {
          throw new Error('Missing required card information');
        }
        
        // Simulate card validation
        if (paymentMethodData.cardNumber.length < 13 || paymentMethodData.cardNumber.length > 19) {
          throw new Error('Invalid card number');
        }
        
        if (paymentMethodData.expiryMonth < 1 || paymentMethodData.expiryMonth > 12) {
          throw new Error('Invalid expiry month');
        }
        
        const currentYear = new Date().getFullYear();
        if (paymentMethodData.expiryYear < currentYear) {
          throw new Error('Card has expired');
        }
      }

      const paymentMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: paymentMethodData.type,
        last4: paymentMethodData.type === 'card' ? paymentMethodData.cardNumber!.slice(-4) : undefined,
        brand: paymentMethodData.type === 'card' ? this.detectCardBrand(paymentMethodData.cardNumber!) : undefined,
        expiryMonth: paymentMethodData.expiryMonth,
        expiryYear: paymentMethodData.expiryYear,
        isDefault: this.paymentMethods.filter(pm => pm.customerId === customerId).length === 0,
        customerId
      };

      this.paymentMethods.push(paymentMethod);
      this.saveToStorage();
      
      return paymentMethod;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  getPaymentMethods(customerId: string): PaymentMethod[] {
    return this.paymentMethods.filter(pm => pm.customerId === customerId);
  }

  setDefaultPaymentMethod(customerId: string, paymentMethodId: string): boolean {
    const customerMethods = this.paymentMethods.filter(pm => pm.customerId === customerId);
    const targetMethod = customerMethods.find(pm => pm.id === paymentMethodId);
    
    if (!targetMethod) return false;
    
    // Remove default from all other methods
    customerMethods.forEach(pm => {
      pm.isDefault = false;
    });
    
    // Set target method as default
    targetMethod.isDefault = true;
    
    this.saveToStorage();
    return true;
  }

  removePaymentMethod(paymentMethodId: string): boolean {
    const initialLength = this.paymentMethods.length;
    this.paymentMethods = this.paymentMethods.filter(pm => pm.id !== paymentMethodId);
    this.saveToStorage();
    return this.paymentMethods.length < initialLength;
  }

  // Payment Processing
  async createPaymentIntent(amount: number, currency: string, customerId: string, description: string, metadata: Record<string, string> = {}): Promise<PaymentIntent> {
    try {
      const paymentIntent: PaymentIntent = {
        id: `pi_${Date.now()}`,
        amount,
        currency,
        status: 'pending',
        paymentMethodId: '',
        customerId,
        description,
        metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.paymentIntents.push(paymentIntent);
      this.saveToStorage();
      
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentIntent> {
    try {
      const paymentIntent = this.paymentIntents.find(pi => pi.id === paymentIntentId);
      if (!paymentIntent) {
        throw new Error('Payment intent not found');
      }

      // Simulate payment processing
      paymentIntent.status = 'processing';
      paymentIntent.paymentMethodId = paymentMethodId;
      paymentIntent.updatedAt = new Date();

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success (90% success rate for demo)
      const isSuccess = Math.random() > 0.1;
      paymentIntent.status = isSuccess ? 'succeeded' : 'failed';
      paymentIntent.updatedAt = new Date();

      this.saveToStorage();
      
      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<boolean> {
    try {
      const paymentIntent = this.paymentIntents.find(pi => pi.id === paymentIntentId);
      if (!paymentIntent || paymentIntent.status !== 'succeeded') {
        throw new Error('Payment intent not found or not succeeded');
      }

      // Simulate refund processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create refund record (in production, this would be a separate table)
      console.log(`Refunded ${amount || paymentIntent.amount} ${paymentIntent.currency} for payment ${paymentIntentId}`);
      
      return true;
    } catch (error) {
      console.error('Error processing refund:', error);
      return false;
    }
  }

  // Subscription Management
  async createSubscription(customerId: string, planId: string, paymentMethodId: string): Promise<Subscription> {
    try {
      const plan = this.getPlanById(planId);
      if (!plan) {
        throw new Error('Plan not found');
      }

      const paymentMethod = this.paymentMethods.find(pm => pm.id === paymentMethodId);
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }

      const now = new Date();
      const trialEnd = plan.trialDays > 0 ? new Date(now.getTime() + plan.trialDays * 24 * 60 * 60 * 1000) : undefined;
      
      const subscription: Subscription = {
        id: `sub_${Date.now()}`,
        customerId,
        planId,
        planName: plan.name,
        amount: plan.amount,
        currency: plan.currency,
        interval: plan.interval,
        status: trialEnd ? 'trialing' : 'active',
        currentPeriodStart: now,
        currentPeriodEnd: this.calculateNextPeriod(now, plan.interval),
        trialEnd,
        cancelAtPeriodEnd: false,
        paymentMethodId,
        createdAt: now,
        updatedAt: now
      };

      this.subscriptions.push(subscription);
      this.saveToStorage();
      
      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<Subscription | null> {
    try {
      const subscription = this.subscriptions.find(sub => sub.id === subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      if (cancelAtPeriodEnd) {
        subscription.cancelAtPeriodEnd = true;
        subscription.status = 'canceled';
      } else {
        subscription.status = 'canceled';
        subscription.currentPeriodEnd = new Date();
      }

      subscription.updatedAt = new Date();
      this.saveToStorage();
      
      return subscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return null;
    }
  }

  async updateSubscription(subscriptionId: string, planId: string): Promise<Subscription | null> {
    try {
      const subscription = this.subscriptions.find(sub => sub.id === subscriptionId);
      const newPlan = this.getPlanById(planId);
      
      if (!subscription || !newPlan) {
        throw new Error('Subscription or plan not found');
      }

      subscription.planId = planId;
      subscription.planName = newPlan.name;
      subscription.amount = newPlan.amount;
      subscription.interval = newPlan.interval;
      subscription.updatedAt = new Date();

      this.saveToStorage();
      
      return subscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      return null;
    }
  }

  getSubscriptions(customerId: string): Subscription[] {
    return this.subscriptions.filter(sub => sub.customerId === customerId);
  }

  getActiveSubscription(customerId: string): Subscription | undefined {
    return this.subscriptions.find(sub => 
      sub.customerId === customerId && 
      ['active', 'trialing'].includes(sub.status)
    );
  }

  // Utility Methods
  private detectCardBrand(cardNumber: string): string {
    // Simple card brand detection
    if (cardNumber.startsWith('4')) return 'visa';
    if (cardNumber.startsWith('5')) return 'mastercard';
    if (cardNumber.startsWith('3')) return 'amex';
    if (cardNumber.startsWith('6')) return 'discover';
    return 'unknown';
  }

  private calculateNextPeriod(currentDate: Date, interval: 'month' | 'year'): Date {
    const nextDate = new Date(currentDate);
    if (interval === 'month') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
    return nextDate;
  }

  // Formatting
  formatAmount(amount: number, currency: string): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: amount % 100 === 0 ? 0 : 2
    });
    return formatter.format(amount / 100); // Convert from cents
  }

  // Webhook Simulation (for demo purposes)
  async simulateWebhook(event: string, data: any): Promise<void> {
    console.log(`Webhook received: ${event}`, data);
    
    switch (event) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payment
        break;
      case 'invoice.payment_succeeded':
        // Handle successful subscription payment
        break;
      case 'invoice.payment_failed':
        // Handle failed subscription payment
        break;
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        break;
    }
  }

  // Analytics and Reporting
  getPaymentMetrics(): {
    totalRevenue: number;
    totalTransactions: number;
    successRate: number;
    averageTransactionValue: number;
  } {
    const successfulPayments = this.paymentIntents.filter(pi => pi.status === 'succeeded');
    const totalRevenue = successfulPayments.reduce((sum, pi) => sum + pi.amount, 0);
    const totalTransactions = this.paymentIntents.length;
    const successRate = totalTransactions > 0 ? (successfulPayments.length / totalTransactions) * 100 : 0;
    const averageTransactionValue = successfulPayments.length > 0 ? totalRevenue / successfulPayments.length : 0;

    return {
      totalRevenue,
      totalTransactions,
      successRate,
      averageTransactionValue
    };
  }

  // Export/Import
  exportData(): string {
    return JSON.stringify({
      paymentMethods: this.paymentMethods,
      paymentIntents: this.paymentIntents,
      subscriptions: this.subscriptions
    }, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      this.paymentMethods = data.paymentMethods || [];
      this.paymentIntents = data.paymentIntents || [];
      this.subscriptions = data.subscriptions || [];
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Error importing payment data:', error);
      return false;
    }
  }
}

// Create singleton instance
const paymentGatewayService = new PaymentGatewayService();

export default paymentGatewayService;
