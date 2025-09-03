export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxLength: number;
  preventCommonPasswords: boolean;
  preventUserInfo: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number; // 0-100
}

export class PasswordSecurityService {
  private static readonly DEFAULT_POLICY: PasswordPolicy = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxLength: 128,
    preventCommonPasswords: true,
    preventUserInfo: true,
  };

  private static readonly COMMON_PASSWORDS = [
    'password', '123456', '12345678', 'qwerty', 'abc123', 'password123',
    'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master',
    'hello', 'freedom', 'whatever', 'qazwsx', 'trustno1', 'jordan',
    'harley', 'hunter', 'buster', 'thomas', 'tigger', 'robert',
    'soccer', 'batman', 'test', 'pass', 'love', 'shadow', 'angel',
    'princess', 'master', 'jennifer', 'joshua', 'michael', 'jordan',
    'andrew', 'access', 'admin123', 'administrator', 'root', 'toor',
    'demo', 'guest', 'info', 'adm', 'mysql', 'user', 'administrator',
    'administrator', 'administrator', 'administrator', 'administrator',
  ];

  private static policy: PasswordPolicy = { ...this.DEFAULT_POLICY };

  /**
   * Get current password policy
   */
  static getPolicy(): PasswordPolicy {
    return { ...this.policy };
  }

  /**
   * Update password policy
   */
  static updatePolicy(newPolicy: Partial<PasswordPolicy>): void {
    this.policy = { ...this.policy, ...newPolicy };
    
    // Save to localStorage for persistence
    localStorage.setItem('passwordPolicy', JSON.stringify(this.policy));
  }

  /**
   * Load policy from localStorage
   */
  static loadPolicy(): void {
    const saved = localStorage.getItem('passwordPolicy');
    if (saved) {
      try {
        this.policy = { ...this.policy, ...JSON.parse(saved) };
      } catch (error) {
        console.error('Failed to load password policy:', error);
      }
    }
  }

  /**
   * Reset to default policy
   */
  static resetPolicy(): void {
    this.policy = { ...this.DEFAULT_POLICY };
    localStorage.removeItem('passwordPolicy');
  }

  /**
   * Validate password against policy
   */
  static validatePassword(password: string, userInfo?: { firstName?: string; lastName?: string; email?: string }): PasswordValidationResult {
    const errors: string[] = [];
    let score = 0;

    // Check minimum length
    if (password.length < this.policy.minLength) {
      errors.push(`Password must be at least ${this.policy.minLength} characters long`);
    } else {
      score += 20;
    }

    // Check maximum length
    if (password.length > this.policy.maxLength) {
      errors.push(`Password must be no more than ${this.policy.maxLength} characters long`);
    }

    // Check uppercase requirement
    if (this.policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (/[A-Z]/.test(password)) {
      score += 15;
    }

    // Check lowercase requirement
    if (this.policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else if (/[a-z]/.test(password)) {
      score += 15;
    }

    // Check numbers requirement
    if (this.policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else if (/\d/.test(password)) {
      score += 15;
    }

    // Check special characters requirement
    if (this.policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 15;
    }

    // Check against common passwords
    if (this.policy.preventCommonPasswords && this.COMMON_PASSWORDS.includes(password.toLowerCase())) {
      errors.push('Password is too common. Please choose a more unique password');
    } else {
      score += 10;
    }

    // Check against user information
    if (this.policy.preventUserInfo && userInfo) {
      const userInfoLower = [
        userInfo.firstName?.toLowerCase(),
        userInfo.lastName?.toLowerCase(),
        userInfo.email?.toLowerCase().split('@')[0]
      ].filter(Boolean);

      const passwordLower = password.toLowerCase();
      if (userInfoLower.some(info => info && passwordLower.includes(info))) {
        errors.push('Password should not contain your personal information');
      } else {
        score += 10;
      }
    }

    // Additional complexity scoring
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 5;
    if (/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      score += 10;
    }

    // Determine strength
    let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (score < 40) strength = 'weak';
    else if (score < 60) strength = 'medium';
    else if (score < 80) strength = 'strong';
    else strength = 'very-strong';

    const isValid = errors.length === 0;

    return {
      isValid,
      errors,
      strength,
      score: Math.min(score, 100),
    };
  }

  /**
   * Hash password (demo implementation)
   * In production, use bcrypt, Argon2, or similar
   */
  static hashPassword(password: string): string {
    // Simple hash for demo purposes
    // In production, use proper hashing libraries
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    // Add salt for demo
    const salt = Math.random().toString(36).substring(2, 15);
    return `${salt}:${Math.abs(hash).toString(16)}`;
  }

  /**
   * Verify password hash
   */
  static verifyPassword(password: string, hash: string): boolean {
    const computedHash = this.hashPassword(password);
    return computedHash === hash;
  }

  /**
   * Generate secure password
   */
  static generateSecurePassword(length: number = 16): string {
    const charset = {
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let password = '';
    
    // Ensure at least one character from each required set
    if (this.policy.requireLowercase) {
      password += charset.lowercase[Math.floor(Math.random() * charset.lowercase.length)];
    }
    if (this.policy.requireUppercase) {
      password += charset.uppercase[Math.floor(Math.random() * charset.uppercase.length)];
    }
    if (this.policy.requireNumbers) {
      password += charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
    }
    if (this.policy.requireSpecialChars) {
      password += charset.symbols[Math.floor(Math.random() * charset.symbols.length)];
    }

    // Fill remaining length
    const allChars = Object.values(charset).join('');
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Check password strength without validation
   */
  static getPasswordStrength(password: string): { strength: string; score: number } {
    const result = this.validatePassword(password);
    return {
      strength: result.strength,
      score: result.score,
    };
  }

  /**
   * Get password requirements summary
   */
  static getPasswordRequirements(): string[] {
    const reqs: string[] = [];
    
    if (this.policy.minLength > 0) {
      reqs.push(`At least ${this.policy.minLength} characters`);
    }
    if (this.policy.requireUppercase) {
      reqs.push('One uppercase letter (A-Z)');
    }
    if (this.policy.requireLowercase) {
      reqs.push('One lowercase letter (a-z)');
    }
    if (this.policy.requireNumbers) {
      reqs.push('One number (0-9)');
    }
    if (this.policy.requireSpecialChars) {
      reqs.push('One special character (!@#$%^&*)');
    }
    if (this.policy.preventCommonPasswords) {
      reqs.push('Not a common password');
    }
    if (this.policy.preventUserInfo) {
      reqs.push('Not contain personal information');
    }

    return reqs;
  }
}

// Initialize policy on load
PasswordSecurityService.loadPolicy();

// Convenience functions
export const validatePassword = (password: string, userInfo?: { firstName?: string; lastName?: string; email?: string }) =>
  PasswordSecurityService.validatePassword(password, userInfo);
export const hashPassword = (password: string) => PasswordSecurityService.hashPassword(password);
export const verifyPassword = (password: string, hash: string) => PasswordSecurityService.verifyPassword(password, hash);
export const generateSecurePassword = (length?: number) => PasswordSecurityService.generateSecurePassword(length);
export const getPasswordPolicy = () => PasswordSecurityService.getPolicy();
export const updatePasswordPolicy = (policy: Partial<PasswordPolicy>) => PasswordSecurityService.updatePolicy(policy);
export const resetPasswordPolicy = () => PasswordSecurityService.resetPolicy();
export const getPasswordRequirements = () => PasswordSecurityService.getPasswordRequirements();
