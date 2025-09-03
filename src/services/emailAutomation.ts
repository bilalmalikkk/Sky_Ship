// Email Automation Service for SkyShip Logistics
// Handles automated emails for customer engagement and marketing

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[];
  category: 'welcome' | 'follow-up' | 'marketing' | 'vip' | 'reminder';
}

export interface EmailRecipient {
  email: string;
  name: string;
  company?: string;
  isVIP?: boolean;
  preferences?: {
    marketing: boolean;
    notifications: boolean;
    vipUpdates: boolean;
  };
}

export interface EmailCampaign {
  id: string;
  name: string;
  templateId: string;
  recipients: EmailRecipient[];
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  sentCount: number;
  openCount: number;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailMetrics {
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribed: number;
}

class EmailAutomationService {
  private templates: EmailTemplate[] = [];
  private campaigns: EmailCampaign[] = [];
  private metrics: EmailMetrics = {
    totalSent: 0,
    totalOpened: 0,
    totalClicked: 0,
    openRate: 0,
    clickRate: 0,
    bounceRate: 0,
    unsubscribed: 0
  };

  constructor() {
    this.initializeTemplates();
    this.loadFromStorage();
  }

  private initializeTemplates() {
    this.templates = [
      {
        id: 'welcome-new-customer',
        name: 'Welcome New Customer',
        subject: 'Welcome to SkyShip Logistics - Your Shipping Partner',
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">Welcome to SkyShip!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Your trusted partner in global logistics</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello {{customerName}},</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Welcome to SkyShip Logistics! We're excited to have you on board and look forward to 
                helping you with all your shipping and logistics needs.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #333; margin: 0 0 15px 0;">What's Next?</h3>
                <ul style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Complete your company profile</li>
                  <li>Set up your shipping preferences</li>
                  <li>Request your first quote</li>
                  <li>Explore our premium services</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{websiteUrl}}/quote" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Get Your First Quote
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                If you have any questions or need assistance, our support team is here to help. 
                You can reach us at support@skyship.com or call us at +1 (555) 123-4567.
              </p>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Best regards,<br>
                The SkyShip Team
              </p>
            </div>
            
            <div style="background: #333; padding: 20px; text-align: center; color: white;">
              <p style="margin: 0; font-size: 14px;">
                © 2024 SkyShip Logistics. All rights reserved.<br>
                <a href="{{unsubscribeUrl}}" style="color: #ccc;">Unsubscribe</a> | 
                <a href="{{privacyUrl}}" style="color: #ccc;">Privacy Policy</a>
              </p>
            </div>
          </div>
        `,
        textBody: `
Welcome to SkyShip Logistics!

Hello {{customerName}},

Welcome to SkyShip Logistics! We're excited to have you on board and look forward to helping you with all your shipping and logistics needs.

What's Next?
- Complete your company profile
- Set up your shipping preferences  
- Request your first quote
- Explore our premium services

Get started: {{websiteUrl}}/quote

If you have any questions or need assistance, our support team is here to help. You can reach us at support@skyship.com or call us at +1 (555) 123-4567.

Best regards,
The SkyShip Team

© 2024 SkyShip Logistics. All rights reserved.
        `,
        variables: ['customerName', 'websiteUrl', 'unsubscribeUrl', 'privacyUrl'],
        category: 'welcome'
      },
      {
        id: 'quote-follow-up',
        name: 'Quote Follow-up',
        subject: 'Your SkyShip Quote - Next Steps',
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">Your Quote is Ready!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">SkyShip Logistics</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello {{customerName}},</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Thank you for requesting a quote from SkyShip Logistics. We've prepared a comprehensive 
                quote for your shipping needs and are excited to help you get started.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #333; margin: 0 0 15px 0;">Quote Summary</h3>
                <p style="color: #666; margin: 0;"><strong>Service:</strong> {{serviceType}}</p>
                <p style="color: #666; margin: 5px 0;"><strong>Origin:</strong> {{origin}}</p>
                <p style="color: #666; margin: 5px 0;"><strong>Destination:</strong> {{destination}}</p>
                <p style="color: #666; margin: 5px 0;"><strong>Estimated Cost:</strong> {{estimatedCost}}</p>
                <p style="color: #666; margin: 5px 0;"><strong>Transit Time:</strong> {{transitTime}}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{quoteUrl}}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin-right: 15px;">
                  View Full Quote
                </a>
                <a href="{{websiteUrl}}/contact" style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Contact Sales
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                This quote is valid for 30 days. If you have any questions or need to make adjustments, 
                please don't hesitate to contact our sales team.
              </p>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Best regards,<br>
                The SkyShip Sales Team
              </p>
            </div>
            
            <div style="background: #333; padding: 20px; text-align: center; color: white;">
              <p style="margin: 0; font-size: 14px;">
                © 2024 SkyShip Logistics. All rights reserved.<br>
                <a href="{{unsubscribeUrl}}" style="color: #ccc;">Unsubscribe</a> | 
                <a href="{{privacyUrl}}" style="color: #ccc;">Privacy Policy</a>
              </p>
            </div>
          </div>
        `,
        textBody: `
Your Quote is Ready!

Hello {{customerName}},

Thank you for requesting a quote from SkyShip Logistics. We've prepared a comprehensive quote for your shipping needs and are excited to help you get started.

Quote Summary:
- Service: {{serviceType}}
- Origin: {{origin}}
- Destination: {{destination}}
- Estimated Cost: {{estimatedCost}}
- Transit Time: {{transitTime}}

View your full quote: {{quoteUrl}}
Contact sales: {{websiteUrl}}/contact

This quote is valid for 30 days. If you have any questions or need to make adjustments, please don't hesitate to contact our sales team.

Best regards,
The SkyShip Sales Team

© 2024 SkyShip Logistics. All rights reserved.
        `,
        variables: ['customerName', 'serviceType', 'origin', 'destination', 'estimatedCost', 'transitTime', 'quoteUrl', 'websiteUrl', 'unsubscribeUrl', 'privacyUrl'],
        category: 'follow-up'
      },
      {
        id: 'vip-welcome',
        name: 'VIP Welcome',
        subject: 'Welcome to SkyShip VIP - Exclusive Benefits Await',
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">🎉 VIP Access Granted!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Welcome to SkyShip's Exclusive VIP Program</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello {{customerName}},</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Congratulations! You're now part of SkyShip's exclusive VIP program. As a VIP member, 
                you'll enjoy premium services, priority support, and exclusive benefits that set us apart.
              </p>
              
              <div style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); padding: 20px; border-radius: 8px; margin: 20px 0; color: white;">
                <h3 style="margin: 0 0 15px 0;">🌟 Your VIP Benefits</h3>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Priority customer support with dedicated agents</li>
                  <li>Exclusive shipping discounts and rates</li>
                  <li>Real-time shipment tracking and notifications</li>
                  <li>Personal account manager</li>
                  <li>VIP-only promotions and offers</li>
                  <li>24/7 emergency support line</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{vipDashboardUrl}}" style="background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Access VIP Dashboard
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Your VIP account manager, {{accountManager}}, will be in touch within 24 hours to 
                personally welcome you and discuss your specific logistics needs.
              </p>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Welcome to the VIP family!<br>
                The SkyShip VIP Team
              </p>
            </div>
            
            <div style="background: #333; padding: 20px; text-align: center; color: white;">
              <p style="margin: 0; font-size: 14px;">
                © 2024 SkyShip Logistics. All rights reserved.<br>
                <a href="{{unsubscribeUrl}}" style="color: #ccc;">Unsubscribe</a> | 
                <a href="{{privacyUrl}}" style="color: #ccc;">Privacy Policy</a>
              </p>
            </div>
          </div>
        `,
        textBody: `
VIP Access Granted!

Hello {{customerName}},

Congratulations! You're now part of SkyShip's exclusive VIP program. As a VIP member, you'll enjoy premium services, priority support, and exclusive benefits that set us apart.

🌟 Your VIP Benefits:
- Priority customer support with dedicated agents
- Exclusive shipping discounts and rates
- Real-time shipment tracking and notifications
- Personal account manager
- VIP-only promotions and offers
- 24/7 emergency support line

Access your VIP dashboard: {{vipDashboardUrl}}

Your VIP account manager, {{accountManager}}, will be in touch within 24 hours to personally welcome you and discuss your specific logistics needs.

Welcome to the VIP family!
The SkyShip VIP Team

© 2024 SkyShip Logistics. All rights reserved.
        `,
        variables: ['customerName', 'vipDashboardUrl', 'accountManager', 'unsubscribeUrl', 'privacyUrl'],
        category: 'vip'
      },
      {
        id: 'shipment-update',
        name: 'Shipment Update',
        subject: 'Your Shipment Status Update - {{trackingNumber}}',
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">📦 Shipment Update</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Tracking: {{trackingNumber}}</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello {{customerName}},</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Your shipment has been updated. Here are the latest details:
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="color: #333; margin: 0 0 15px 0;">📊 Shipment Details</h3>
                <p style="color: #666; margin: 0;"><strong>Status:</strong> {{status}}</p>
                <p style="color: #666; margin: 5px 0;"><strong>Location:</strong> {{location}}</p>
                <p style="color: #666; margin: 5px 0;"><strong>Updated:</strong> {{timestamp}}</p>
                <p style="color: #666; margin: 5px 0;"><strong>Estimated Delivery:</strong> {{estimatedDelivery}}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{trackingUrl}}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Track Shipment
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                {{statusMessage}}
              </p>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Best regards,<br>
                The SkyShip Team
              </p>
            </div>
            
            <div style="background: #333; padding: 20px; text-align: center; color: white;">
              <p style="margin: 0; font-size: 14px;">
                © 2024 SkyShip Logistics. All rights reserved.<br>
                <a href="{{unsubscribeUrl}}" style="color: #ccc;">Unsubscribe</a> | 
                <a href="{{privacyUrl}}" style="color: #ccc;">Privacy Policy</a>
              </p>
            </div>
          </div>
        `,
        textBody: `
Shipment Update

Hello {{customerName}},

Your shipment has been updated. Here are the latest details:

📊 Shipment Details:
- Status: {{status}}
- Location: {{location}}
- Updated: {{timestamp}}
- Estimated Delivery: {{estimatedDelivery}}

Track your shipment: {{trackingUrl}}

{{statusMessage}}

Best regards,
The SkyShip Team

© 2024 SkyShip Logistics. All rights reserved.
        `,
        variables: ['customerName', 'trackingNumber', 'status', 'location', 'timestamp', 'estimatedDelivery', 'trackingUrl', 'statusMessage', 'unsubscribeUrl', 'privacyUrl'],
        category: 'reminder'
      }
    ];
  }

  private loadFromStorage() {
    try {
      const savedCampaigns = localStorage.getItem('emailCampaigns');
      const savedMetrics = localStorage.getItem('emailMetrics');
      
      if (savedCampaigns) {
        this.campaigns = JSON.parse(savedCampaigns);
      }
      
      if (savedMetrics) {
        this.metrics = JSON.parse(savedMetrics);
      }
    } catch (error) {
      console.error('Error loading email data from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('emailCampaigns', JSON.stringify(this.campaigns));
      localStorage.setItem('emailMetrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.error('Error saving email data to storage:', error);
    }
  }

  // Template Management
  getTemplates(category?: string): EmailTemplate[] {
    if (category) {
      return this.templates.filter(template => template.category === category);
    }
    return this.templates;
  }

  getTemplateById(id: string): EmailTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  // Campaign Management
  createCampaign(campaign: Omit<EmailCampaign, 'id' | 'createdAt' | 'updatedAt' | 'sentCount' | 'openCount' | 'clickCount'>): EmailCampaign {
    const newCampaign: EmailCampaign = {
      ...campaign,
      id: Date.now().toString(),
      sentCount: 0,
      openCount: 0,
      clickCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.campaigns.push(newCampaign);
    this.saveToStorage();
    return newCampaign;
  }

  getCampaigns(): EmailCampaign[] {
    return this.campaigns;
  }

  getCampaignById(id: string): EmailCampaign | undefined {
    return this.campaigns.find(campaign => campaign.id === id);
  }

  updateCampaign(id: string, updates: Partial<EmailCampaign>): EmailCampaign | null {
    const campaignIndex = this.campaigns.findIndex(campaign => campaign.id === id);
    if (campaignIndex === -1) return null;
    
    this.campaigns[campaignIndex] = {
      ...this.campaigns[campaignIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    this.saveToStorage();
    return this.campaigns[campaignIndex];
  }

  deleteCampaign(id: string): boolean {
    const initialLength = this.campaigns.length;
    this.campaigns = this.campaigns.filter(campaign => campaign.id !== id);
    this.saveToStorage();
    return this.campaigns.length < initialLength;
  }

  // Email Sending
  async sendEmail(templateId: string, recipient: EmailRecipient, variables: Record<string, string>): Promise<boolean> {
    try {
      const template = this.getTemplateById(templateId);
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      // Replace variables in template
      let htmlBody = template.htmlBody;
      let textBody = template.textBody;
      let subject = template.subject;

      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        htmlBody = htmlBody.replace(regex, value);
        textBody = textBody.replace(regex, value);
        subject = subject.replace(regex, value);
      });

      // Simulate email sending (in production, this would integrate with email service)
      console.log('Sending email:', {
        to: recipient.email,
        subject,
        template: template.name,
        isVIP: recipient.isVIP
      });

      // Update metrics
      this.metrics.totalSent++;
      this.updateMetrics();
      this.saveToStorage();

      // Simulate delivery delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendBulkEmail(templateId: string, recipients: EmailRecipient[], variables: Record<string, string>): Promise<{
    success: number;
    failed: number;
    total: number;
  }> {
    let success = 0;
    let failed = 0;
    const total = recipients.length;

    for (const recipient of recipients) {
      try {
        // Add recipient-specific variables
        const recipientVariables = {
          ...variables,
          customerName: recipient.name,
          customerEmail: recipient.email,
          company: recipient.company || 'N/A'
        };

        const result = await this.sendEmail(templateId, recipient, recipientVariables);
        if (result) {
          success++;
        } else {
          failed++;
        }

        // Rate limiting - don't send too many emails too quickly
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error sending email to ${recipient.email}:`, error);
        failed++;
      }
    }

    return { success, failed, total };
  }

  // Automated Email Triggers
  async sendWelcomeEmail(customer: EmailRecipient): Promise<boolean> {
    const variables = {
      websiteUrl: 'https://skyship.com',
      unsubscribeUrl: 'https://skyship.com/unsubscribe',
      privacyUrl: 'https://skyship.com/privacy'
    };

    return this.sendEmail('welcome-new-customer', customer, variables);
  }

  async sendQuoteFollowUp(customer: EmailRecipient, quoteData: Record<string, string>): Promise<boolean> {
    const variables = {
      ...quoteData,
      websiteUrl: 'https://skyship.com',
      unsubscribeUrl: 'https://skyship.com/unsubscribe',
      privacyUrl: 'https://skyship.com/privacy'
    };

    return this.sendEmail('quote-follow-up', customer, variables);
  }

  async sendVIPWelcome(customer: EmailRecipient): Promise<boolean> {
    const variables = {
      vipDashboardUrl: 'https://skyship.com/vip-dashboard',
      accountManager: 'Sarah Johnson',
      unsubscribeUrl: 'https://skyship.com/unsubscribe',
      privacyUrl: 'https://skyship.com/privacy'
    };

    return this.sendEmail('vip-welcome', customer, variables);
  }

  async sendShipmentUpdate(customer: EmailRecipient, shipmentData: Record<string, string>): Promise<boolean> {
    const variables = {
      ...shipmentData,
      trackingUrl: `https://skyship.com/tracking/${shipmentData.trackingNumber}`,
      unsubscribeUrl: 'https://skyship.com/unsubscribe',
      privacyUrl: 'https://skyship.com/privacy'
    };

    return this.sendEmail('shipment-update', customer, variables);
  }

  // Metrics and Analytics
  getMetrics(): EmailMetrics {
    return { ...this.metrics };
  }

  private updateMetrics() {
    if (this.metrics.totalSent > 0) {
      this.metrics.openRate = (this.metrics.totalOpened / this.metrics.totalSent) * 100;
      this.metrics.clickRate = (this.metrics.totalClicked / this.metrics.totalSent) * 100;
    }
  }

  recordEmailOpen(campaignId: string): void {
    const campaign = this.getCampaignById(campaignId);
    if (campaign) {
      campaign.openCount++;
      this.metrics.totalOpened++;
      this.updateMetrics();
      this.saveToStorage();
    }
  }

  recordEmailClick(campaignId: string): void {
    const campaign = this.getCampaignById(campaignId);
    if (campaign) {
      campaign.clickCount++;
      this.metrics.totalClicked++;
      this.updateMetrics();
      this.saveToStorage();
    }
  }

  // Marketing Automation
  async triggerAutomatedEmails(): Promise<void> {
    // This would typically run on a schedule (daily, hourly, etc.)
    // For demo purposes, we'll simulate some automated triggers
    
    console.log('Running automated email triggers...');
    
    // In production, this would:
    // 1. Check for new customers and send welcome emails
    // 2. Check for quote requests and send follow-ups
    // 3. Check for VIP upgrades and send VIP welcome emails
    // 4. Check for shipment updates and send notifications
    // 5. Send scheduled marketing campaigns
  }

  // Unsubscribe Management
  unsubscribe(email: string): boolean {
    // In production, this would update a database
    // For demo, we'll just log it
    console.log(`Email ${email} unsubscribed`);
    this.metrics.unsubscribed++;
    this.saveToStorage();
    return true;
  }

  // Export/Import
  exportCampaigns(): string {
    return JSON.stringify(this.campaigns, null, 2);
  }

  importCampaigns(jsonData: string): boolean {
    try {
      const campaigns = JSON.parse(jsonData);
      this.campaigns = campaigns;
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Error importing campaigns:', error);
      return false;
    }
  }
}

// Create singleton instance
const emailAutomationService = new EmailAutomationService();

export default emailAutomationService;
