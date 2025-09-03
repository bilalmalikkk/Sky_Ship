import { Buffer } from 'buffer';

// Simple TOTP implementation for demo purposes
// In production, use a proper library like 'otplib' or 'speakeasy'
export class TwoFactorAuth {
  private static readonly ALGORITHM = 'SHA1';
  private static readonly DIGITS = 6;
  private static readonly PERIOD = 30; // 30 seconds

  /**
   * Generate a secret key for 2FA
   */
  static generateSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  /**
   * Generate a QR code URL for authenticator apps
   */
  static generateQRUrl(email: string, secret: string, issuer: string = 'SkyShip'): string {
    const encodedIssuer = encodeURIComponent(issuer);
    const encodedEmail = encodeURIComponent(email);
    const encodedSecret = encodeURIComponent(secret);
    
    return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${encodedSecret}&issuer=${encodedIssuer}&algorithm=${this.ALGORITHM}&digits=${this.DIGITS}&period=${this.PERIOD}`;
  }

  /**
   * Generate current TOTP code
   */
  static generateTOTP(secret: string): string {
    const now = Math.floor(Date.now() / 1000);
    const counter = Math.floor(now / this.PERIOD);
    
    // Simple hash implementation for demo
    // In production, use proper crypto libraries
    const hash = this.simpleHash(secret + counter.toString());
    const code = parseInt(hash.substring(0, 8), 16) % Math.pow(10, this.DIGITS);
    
    return code.toString().padStart(this.DIGITS, '0');
  }

  /**
   * Validate TOTP code
   */
  static validateTOTP(secret: string, code: string, window: number = 1): boolean {
    const currentCode = this.generateTOTP(secret);
    
    if (code === currentCode) {
      return true;
    }

    // Check previous and next periods for time drift
    for (let i = 1; i <= window; i++) {
      const prevCounter = Math.floor((Date.now() / 1000 - i * this.PERIOD) / this.PERIOD);
      const nextCounter = Math.floor((Date.now() / 1000 + i * this.PERIOD) / this.PERIOD);
      
      const prevCode = this.generateTOTP(secret);
      const nextCode = this.generateTOTP(secret);
      
      if (code === prevCode || code === nextCode) {
        return true;
      }
    }

    return false;
  }

  /**
   * Simple hash function for demo purposes
   * In production, use proper crypto libraries
   */
  private static simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Backup codes for 2FA recovery
   */
  static generateBackupCodes(count: number = 8): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Validate backup code
   */
  static validateBackupCode(backupCodes: string[], code: string): boolean {
    const index = backupCodes.indexOf(code.toUpperCase());
    if (index !== -1) {
      // Remove used backup code
      backupCodes.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Convenience functions
export const generate2FASecret = () => TwoFactorAuth.generateSecret();
export const generate2FAQR = (email: string, secret: string, issuer?: string) => 
  TwoFactorAuth.generateQRUrl(email, secret, issuer);
export const generate2FACode = (secret: string) => TwoFactorAuth.generateTOTP(secret);
export const validate2FACode = (secret: string, code: string) => TwoFactorAuth.validateTOTP(secret, code);
export const generateBackupCodes = (count?: number) => TwoFactorAuth.generateBackupCodes(count);
export const validateBackupCode = (backupCodes: string[], code: string) => 
  TwoFactorAuth.validateBackupCode(backupCodes, code);
