import { jwtDecode } from 'jwt-decode';

// Admin Security Configuration
export const ADMIN_SECURITY_CONFIG = {
  // IP Whitelist - Only allow admin access from these IPs
  ALLOWED_IPS: [
    '127.0.0.1', // Localhost for development
    '::1', // IPv6 localhost
    // Add your office IP addresses here
    // '192.168.1.100',
    // '10.0.0.50'
  ],
  
  // Session timeout (in minutes)
  SESSION_TIMEOUT: 30,
  
  // Maximum login attempts before lockout
  MAX_LOGIN_ATTEMPTS: 5,
  
  // Lockout duration (in minutes)
  LOCKOUT_DURATION: 15,
  
  // Required password strength
  PASSWORD_REQUIREMENTS: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true
  }
};

// Admin Role Definitions
export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user'
}

// Permission Definitions
export enum Permission {
  // User Management
  VIEW_USERS = 'view_users',
  CREATE_USERS = 'create_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',
  
  // Content Management
  VIEW_CONTENT = 'view_content',
  CREATE_CONTENT = 'create_content',
  EDIT_CONTENT = 'edit_content',
  DELETE_CONTENT = 'delete_content',
  
  // System Settings
  VIEW_SETTINGS = 'view_settings',
  EDIT_SETTINGS = 'edit_settings',
  SYSTEM_CONFIG = 'system_config',
  
  // Analytics and Reports
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data',
  
  // Security
  VIEW_LOGS = 'view_logs',
  SECURITY_CONFIG = 'security_config',
  
  // CRM Access
  VIEW_CRM = 'view_crm',
  EDIT_CRM = 'edit_crm',
  CRM_ADMIN = 'crm_admin'
}

// Role-Permission Mapping
export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  [AdminRole.SUPER_ADMIN]: Object.values(Permission), // All permissions
  [AdminRole.ADMIN]: [
    Permission.VIEW_USERS,
    Permission.CREATE_USERS,
    Permission.EDIT_USERS,
    Permission.VIEW_CONTENT,
    Permission.CREATE_CONTENT,
    Permission.EDIT_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.VIEW_SETTINGS,
    Permission.EDIT_SETTINGS,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
    Permission.VIEW_LOGS,
    Permission.VIEW_CRM,
    Permission.EDIT_CRM
  ],
  [AdminRole.MODERATOR]: [
    Permission.VIEW_USERS,
    Permission.VIEW_CONTENT,
    Permission.CREATE_CONTENT,
    Permission.EDIT_CONTENT,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_CRM
  ],
  [AdminRole.USER]: [
    Permission.VIEW_CONTENT,
    Permission.VIEW_ANALYTICS
  ]
};

// Security Log Entry Interface
export interface SecurityLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: string;
}

// Admin Security Service
export class AdminSecurityService {
  private static instance: AdminSecurityService;
  private securityLogs: SecurityLogEntry[] = [];
  private loginAttempts: Map<string, { count: number; lastAttempt: Date }> = new Map();
  private lockedAccounts: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): AdminSecurityService {
    if (!AdminSecurityService.instance) {
      AdminSecurityService.instance = new AdminSecurityService();
    }
    return AdminSecurityService.instance;
  }

  // IP Address Validation
  public validateIPAddress(ipAddress: string): boolean {
    // Check if IP is in whitelist
    if (ADMIN_SECURITY_CONFIG.ALLOWED_IPS.includes(ipAddress)) {
      return true;
    }

    // Log unauthorized IP attempt
    this.logSecurityEvent({
      action: 'IP_ACCESS_DENIED',
      resource: 'admin_panel',
      ipAddress,
      success: false,
      details: 'IP address not in whitelist'
    });

    return false;
  }

  // Password Strength Validation
  public validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = ADMIN_SECURITY_CONFIG.PASSWORD_REQUIREMENTS;

    if (password.length < config.minLength) {
      errors.push(`Password must be at least ${config.minLength} characters long`);
    }

    if (config.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (config.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (config.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (config.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    if (config.preventCommonPasswords && this.isCommonPassword(password)) {
      errors.push('Password is too common and easily guessable');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Login Attempt Tracking
  public trackLoginAttempt(email: string, ipAddress: string): boolean {
    const now = new Date();
    const attempt = this.loginAttempts.get(email);

    if (!attempt) {
      this.loginAttempts.set(email, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if account is locked
    if (this.lockedAccounts.has(email)) {
      const lockoutEnd = new Date(attempt.lastAttempt.getTime() + (ADMIN_SECURITY_CONFIG.LOCKOUT_DURATION * 60 * 1000));
      
      if (now < lockoutEnd) {
        this.logSecurityEvent({
          action: 'LOGIN_ATTEMPT_LOCKED',
          resource: 'admin_login',
          ipAddress,
          success: false,
          details: `Account locked until ${lockoutEnd.toISOString()}`
        });
        return false;
      } else {
        // Unlock account after lockout period
        this.lockedAccounts.delete(email);
        this.loginAttempts.delete(email);
      }
    }

    // Check if too many attempts in short time
    const timeDiff = now.getTime() - attempt.lastAttempt.getTime();
    const timeWindow = 15 * 60 * 1000; // 15 minutes

    if (timeDiff < timeWindow) {
      attempt.count++;
      if (attempt.count >= ADMIN_SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
        this.lockedAccounts.add(email);
        this.logSecurityEvent({
          action: 'ACCOUNT_LOCKED',
          resource: 'admin_login',
          ipAddress,
          success: false,
          details: `Account locked due to ${attempt.count} failed login attempts`
        });
        return false;
      }
    } else {
      // Reset counter if outside time window
      attempt.count = 1;
    }

    attempt.lastAttempt = now;
    return true;
  }

  // Permission Check
  public hasPermission(userRole: AdminRole, permission: Permission): boolean {
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];
    return userPermissions.includes(permission);
  }

  // Role Hierarchy Check
  public canManageRole(userRole: AdminRole, targetRole: AdminRole): boolean {
    const roleHierarchy = {
      [AdminRole.SUPER_ADMIN]: 4,
      [AdminRole.ADMIN]: 3,
      [AdminRole.MODERATOR]: 2,
      [AdminRole.USER]: 1
    };

    return roleHierarchy[userRole] > roleHierarchy[targetRole];
  }

  // Security Event Logging
  public logSecurityEvent(logEntry: Omit<SecurityLogEntry, 'id' | 'timestamp'>): void {
    const entry: SecurityLogEntry = {
      ...logEntry,
      id: this.generateId(),
      timestamp: new Date()
    };

    this.securityLogs.push(entry);
    
    // In production, this would be sent to a secure logging service
    console.log('Security Event:', entry);
    
    // Keep only last 1000 logs in memory
    if (this.securityLogs.length > 1000) {
      this.securityLogs = this.securityLogs.slice(-1000);
    }
  }

  // Get Security Logs (for admin review)
  public getSecurityLogs(
    filters?: {
      startDate?: Date;
      endDate?: Date;
      userId?: string;
      action?: string;
      success?: boolean;
    }
  ): SecurityLogEntry[] {
    let filteredLogs = [...this.securityLogs];

    if (filters?.startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
    }

    if (filters?.endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
    }

    if (filters?.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }

    if (filters?.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action);
    }

    if (filters?.success !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.success === filters.success);
    }

    return filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Session Management
  public validateSession(token: string): { isValid: boolean; user?: any; error?: string } {
    try {
      const decoded = jwtDecode(token) as any;
      const now = Date.now() / 1000;

      if (decoded.exp && decoded.exp < now) {
        return { isValid: false, error: 'Session expired' };
      }

      if (decoded.iat && (now - decoded.iat) > (ADMIN_SECURITY_CONFIG.SESSION_TIMEOUT * 60)) {
        return { isValid: false, error: 'Session timeout' };
      }

      return { isValid: true, user: decoded };
    } catch (error) {
      return { isValid: false, error: 'Invalid token' };
    }
  }

  // Generate secure ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Check if password is common
  private isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ];
    
    return commonPasswords.includes(password.toLowerCase());
  }

  // Get current security status
  public getSecurityStatus(): {
    totalLogs: number;
    recentFailures: number;
    lockedAccounts: number;
    activeSessions: number;
  } {
    const now = new Date();
    const recentTime = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // Last 24 hours

    const recentFailures = this.securityLogs.filter(
      log => log.timestamp >= recentTime && !log.success
    ).length;

    return {
      totalLogs: this.securityLogs.length,
      recentFailures,
      lockedAccounts: this.lockedAccounts.size,
      activeSessions: 0 // This would be tracked in production
    };
  }
}

// Export singleton instance
export const adminSecurity = AdminSecurityService.getInstance();
