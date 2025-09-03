export interface SecurityEvent {
  timestamp: Date;
  userId: string;
  userEmail: string;
  userRole: string;
  ipAddress: string;
  action: string;
  resource: string;
  details?: string;
  success: boolean;
  userAgent?: string;
}

export interface LoginAttempt {
  timestamp: Date;
  email: string;
  ipAddress: string;
  success: boolean;
  userAgent?: string;
  failureReason?: string;
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private loginAttempts: LoginAttempt[] = [];
  private maxLogSize = 1000; // Keep last 1000 events

  // Log security events
  logEvent(event: Omit<SecurityEvent, 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date(),
    };

    this.events.push(securityEvent);
    
    // Keep log size manageable
    if (this.events.length > this.maxLogSize) {
      this.events = this.events.slice(-this.maxLogSize);
    }

    // In production, send to security monitoring service
    this.sendToSecurityService(securityEvent);
    
    // Log to console for development
    console.log('🔒 Security Event:', securityEvent);
  }

  // Log login attempts
  logLoginAttempt(attempt: Omit<LoginAttempt, 'timestamp'>) {
    const loginAttempt: LoginAttempt = {
      ...attempt,
      timestamp: new Date(),
    };

    this.loginAttempts.push(loginAttempt);
    
    // Keep login attempts manageable
    if (this.loginAttempts.length > this.maxLogSize) {
      this.loginAttempts = this.loginAttempts.slice(-this.maxLogSize);
    }

    // In production, send to security monitoring service
    this.sendToSecurityService({
      timestamp: loginAttempt.timestamp,
      userId: 'anonymous',
      userEmail: attempt.email,
      userRole: 'anonymous',
      ipAddress: attempt.ipAddress,
      action: 'login_attempt',
      resource: 'auth',
      details: attempt.success ? 'Successful login' : `Failed login: ${attempt.failureReason}`,
      success: attempt.success,
      userAgent: attempt.userAgent,
    });

    // Log to console for development
    console.log('🔐 Login Attempt:', loginAttempt);
  }

  // Get security events for admin review
  getSecurityEvents(limit: number = 100): SecurityEvent[] {
    return this.events.slice(-limit).reverse();
  }

  // Get login attempts for admin review
  getLoginAttempts(limit: number = 100): LoginAttempt[] {
    return this.loginAttempts.slice(-limit).reverse();
  }

  // Get failed login attempts from specific IP (for rate limiting)
  getFailedLoginsFromIP(ipAddress: string, timeWindowMinutes: number = 15): LoginAttempt[] {
    const cutoffTime = new Date(Date.now() - timeWindowMinutes * 60 * 1000);
    return this.loginAttempts.filter(
      attempt => 
        attempt.ipAddress === ipAddress && 
        !attempt.success && 
        attempt.timestamp > cutoffTime
    );
  }

  // Check if IP should be blocked due to too many failed attempts
  isIPBlocked(ipAddress: string): boolean {
    const failedAttempts = this.getFailedLoginsFromIP(ipAddress, 15);
    return failedAttempts.length >= 5; // Block after 5 failed attempts in 15 minutes
  }

  // Export logs for security analysis
  exportLogs(): { events: SecurityEvent[]; loginAttempts: LoginAttempt[] } {
    return {
      events: [...this.events],
      loginAttempts: [...this.loginAttempts],
    };
  }

  // Clear logs (for admin use)
  clearLogs() {
    this.events = [];
    this.loginAttempts = [];
    console.log('🔒 Security logs cleared');
  }

  // Private method to send events to security service
  private sendToSecurityService(event: SecurityEvent) {
    // In production, implement:
    // - Send to SIEM (Security Information and Event Management) system
    // - Send to cloud logging service (AWS CloudWatch, Google Cloud Logging, etc.)
    // - Send to security monitoring dashboard
    // - Send alerts for critical events
    
    // For now, just a placeholder
    if (process.env.NODE_ENV === 'production') {
      // Production security service integration would go here
      fetch('/api/security/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch(error => {
        console.error('Failed to send security event to monitoring service:', error);
      });
    }
  }
}

// Export singleton instance
export const securityLogger = new SecurityLogger();

// Convenience functions for common security events
export const logUserAction = (
  userId: string,
  userEmail: string,
  userRole: string,
  ipAddress: string,
  action: string,
  resource: string,
  details?: string,
  success: boolean = true
) => {
  securityLogger.logEvent({
    userId,
    userEmail,
    userRole,
    ipAddress,
    action,
    resource,
    details,
    success,
  });
};

export const logLoginAttempt = (
  email: string,
  ipAddress: string,
  success: boolean,
  failureReason?: string
) => {
  securityLogger.logLoginAttempt({
    email,
    ipAddress,
    success,
    failureReason,
  });
};
