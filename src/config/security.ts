// Security Configuration for SkyShip Admin Access
export const SECURITY_CONFIG = {
  // IP Address Whitelist - Only allow admin access from these IPs
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
  },
  
  // Two-Factor Authentication settings
  TWO_FACTOR: {
    enabled: true,
    method: 'TOTP', // Time-based One-Time Password
    issuer: 'SkyShip Logistics',
    algorithm: 'SHA1',
    digits: 6,
    period: 30
  },
  
  // Rate limiting
  RATE_LIMITING: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  },
  
  // Security headers
  SECURITY_HEADERS: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    'Referrer-Policy': 'strict-origin-when-cross-origin'
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

// Password Validation Function
export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const config = SECURITY_CONFIG.PASSWORD_REQUIREMENTS;

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

  if (config.preventCommonPasswords && isCommonPassword(password)) {
    errors.push('Password is too common and easily guessable');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Check if password is common
const isCommonPassword = (password: string): boolean => {
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    'admin123', 'root', 'toor', 'password1', '12345678'
  ];
  
  return commonPasswords.includes(password.toLowerCase());
};

// IP Address Validation
export const validateIPAddress = (ipAddress: string): boolean => {
  return SECURITY_CONFIG.ALLOWED_IPS.includes(ipAddress);
};

// Permission Check Function
export const hasPermission = (userRole: AdminRole, permission: Permission): boolean => {
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return userPermissions.includes(permission);
};

// Role Hierarchy Check
export const canManageRole = (userRole: AdminRole, targetRole: AdminRole): boolean => {
  const roleHierarchy = {
    [AdminRole.SUPER_ADMIN]: 4,
    [AdminRole.ADMIN]: 3,
    [AdminRole.MODERATOR]: 2,
    [AdminRole.USER]: 1
  };

  return roleHierarchy[userRole] > roleHierarchy[targetRole];
};

// Security Recommendations
export const SECURITY_RECOMMENDATIONS = [
  {
    title: 'Enable Two-Factor Authentication',
    description: 'Implement 2FA for all admin accounts to add an extra layer of security.',
    priority: 'high',
    category: 'authentication'
  },
  {
    title: 'Regular Password Updates',
    description: 'Enforce password changes every 90 days for admin accounts.',
    priority: 'medium',
    category: 'password'
  },
  {
    title: 'IP Address Monitoring',
    description: 'Monitor and log all IP addresses accessing the admin panel.',
    priority: 'high',
    category: 'access_control'
  },
  {
    title: 'Session Management',
    description: 'Implement automatic session timeout and forced re-authentication.',
    priority: 'medium',
    category: 'session'
  },
  {
    title: 'Security Logging',
    description: 'Log all admin actions and security events for audit purposes.',
    priority: 'high',
    category: 'logging'
  },
  {
    title: 'Regular Security Audits',
    description: 'Conduct monthly security reviews and vulnerability assessments.',
    priority: 'medium',
    category: 'audit'
  }
];

// Security Checklist for Implementation
export const SECURITY_CHECKLIST = {
  authentication: [
    'Strong password policy implemented',
    'Two-factor authentication enabled',
    'Account lockout after failed attempts',
    'Session timeout configured',
    'Secure password reset process'
  ],
  access_control: [
    'IP address whitelist configured',
    'Role-based access control implemented',
    'Permission system in place',
    'Admin interface protected',
    'API endpoints secured'
  ],
  monitoring: [
    'Security logging enabled',
    'Failed login attempts tracked',
    'Admin actions logged',
    'Real-time security alerts',
    'Regular log reviews scheduled'
  ],
  infrastructure: [
    'HTTPS/SSL certificates installed',
    'Security headers configured',
    'Rate limiting implemented',
    'Firewall rules configured',
    'Regular backups scheduled'
  ]
};
