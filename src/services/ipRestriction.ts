export interface IPRestrictionConfig {
  enabled: boolean;
  allowedIPs: string[];
  allowedRanges: string[]; // CIDR notation like "192.168.1.0/24"
  whitelistMode: boolean; // true = only allow listed IPs, false = block listed IPs
  adminOnly: boolean; // Apply only to admin routes
}

export class IPRestrictionService {
  private static config: IPRestrictionConfig = {
    enabled: true,
    allowedIPs: [
      '127.0.0.1',        // Localhost
      '::1',              // IPv6 localhost
      '192.168.1.1',      // Example office IP
      '192.168.1.100',    // Example office IP range
      '10.0.0.1',         // Example VPN IP
    ],
    allowedRanges: [
      '192.168.1.0/24',   // Office network
      '10.0.0.0/8',       // VPN network
    ],
    whitelistMode: true,  // Only allow listed IPs
    adminOnly: true,      // Apply only to admin routes
  };

  /**
   * Get current IP restriction configuration
   */
  static getConfig(): IPRestrictionConfig {
    return { ...this.config };
  }

  /**
   * Update IP restriction configuration
   */
  static updateConfig(newConfig: Partial<IPRestrictionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Save to localStorage for persistence
    localStorage.setItem('ipRestrictionConfig', JSON.stringify(this.config));
  }

  /**
   * Load configuration from localStorage
   */
  static loadConfig(): void {
    const saved = localStorage.getItem('ipRestrictionConfig');
    if (saved) {
      try {
        this.config = { ...this.config, ...JSON.parse(saved) };
      } catch (error) {
        console.error('Failed to load IP restriction config:', error);
      }
    }
  }

  /**
   * Get client IP address (demo implementation)
   * In production, this would get the real IP from the request
   */
  static getClientIP(): string {
    // For demo purposes, return a mock IP
    // In production, this would get the real client IP
    const mockIPs = [
      '192.168.1.1',    // Allowed office IP
      '192.168.1.100',  // Allowed office IP
      '203.0.113.1',    // Blocked external IP
      '198.51.100.1',   // Blocked external IP
    ];
    
    // For testing, you can change this index to test different scenarios
    const testIndex = parseInt(localStorage.getItem('testIPIndex') || '0');
    return mockIPs[testIndex % mockIPs.length];
  }

  /**
   * Check if IP is allowed
   */
  static isIPAllowed(ip: string): boolean {
    if (!this.config.enabled) {
      return true;
    }

    // Check exact IP matches
    if (this.config.allowedIPs.includes(ip)) {
      return this.config.whitelistMode;
    }

    // Check IP ranges (CIDR)
    if (this.isIPInRanges(ip, this.config.allowedRanges)) {
      return this.config.whitelistMode;
    }

    // If whitelist mode, IP is not allowed
    // If blacklist mode, IP is allowed
    return !this.config.whitelistMode;
  }

  /**
   * Check if IP is in allowed ranges
   */
  private static isIPInRanges(ip: string, ranges: string[]): boolean {
    return ranges.some(range => this.isIPInRange(ip, range));
  }

  /**
   * Check if IP is in specific CIDR range
   */
  private static isIPInRange(ip: string, cidr: string): boolean {
    try {
      const [rangeIP, prefix] = cidr.split('/');
      const prefixLength = parseInt(prefix);
      
      if (isNaN(prefixLength) || prefixLength < 0 || prefixLength > 32) {
        return false;
      }

      const ipNum = this.ipToNumber(ip);
      const rangeNum = this.ipToNumber(rangeIP);
      const mask = (0xFFFFFFFF << (32 - prefixLength)) >>> 0;

      return (ipNum & mask) === (rangeNum & mask);
    } catch (error) {
      console.error('Error checking IP range:', error);
      return false;
    }
  }

  /**
   * Convert IP address to number for comparison
   */
  private static ipToNumber(ip: string): number {
    const parts = ip.split('.');
    if (parts.length !== 4) {
      throw new Error('Invalid IP address format');
    }

    let result = 0;
    for (let i = 0; i < 4; i++) {
      const part = parseInt(parts[i]);
      if (isNaN(part) || part < 0 || part > 255) {
        throw new Error('Invalid IP address part');
      }
      result = (result << 8) + part;
    }
    return result >>> 0; // Convert to unsigned 32-bit
  }

  /**
   * Check if current client can access admin
   */
  static canAccessAdmin(): boolean {
    if (!this.config.adminOnly) {
      return true;
    }

    const clientIP = this.getClientIP();
    const isAllowed = this.isIPAllowed(clientIP);

    // Log access attempt
    console.log(`Admin access attempt from IP: ${clientIP}, Allowed: ${isAllowed}`);

    return isAllowed;
  }

  /**
   * Get blocked IPs for monitoring
   */
  static getBlockedIPs(): string[] {
    if (!this.config.enabled) {
      return [];
    }

    const clientIP = this.getClientIP();
    if (!this.isIPAllowed(clientIP)) {
      return [clientIP];
    }

    return [];
  }

  /**
   * Test IP restriction with different IPs
   */
  static testWithIP(ipIndex: number): void {
    localStorage.setItem('testIPIndex', ipIndex.toString());
    console.log(`Testing with IP index: ${ipIndex}`);
  }

  /**
   * Reset to default configuration
   */
  static resetConfig(): void {
    this.config = {
      enabled: true,
      allowedIPs: [
        '127.0.0.1',
        '::1',
        '192.168.1.1',
        '192.168.1.100',
        '10.0.0.1',
      ],
      allowedRanges: [
        '192.168.1.0/24',
        '10.0.0.0/8',
      ],
      whitelistMode: true,
      adminOnly: true,
    };
    
    localStorage.removeItem('ipRestrictionConfig');
    localStorage.removeItem('testIPIndex');
  }
}

// Initialize configuration on load
IPRestrictionService.loadConfig();

// Convenience functions
export const checkIPAccess = (ip: string) => IPRestrictionService.isIPAllowed(ip);
export const canAccessAdmin = () => IPRestrictionService.canAccessAdmin();
export const getIPRestrictionConfig = () => IPRestrictionService.getConfig();
export const updateIPRestrictionConfig = (config: Partial<IPRestrictionConfig>) => 
  IPRestrictionService.updateConfig(config);
export const testIPRestriction = (ipIndex: number) => IPRestrictionService.testWithIP(ipIndex);
export const resetIPRestrictionConfig = () => IPRestrictionService.resetConfig();
