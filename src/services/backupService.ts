export interface BackupData {
  id: string;
  timestamp: Date;
  type: 'full' | 'users' | 'config' | 'security';
  size: number;
  description: string;
  data: any;
  checksum: string;
}

export interface BackupConfig {
  autoBackup: boolean;
  backupInterval: number; // hours
  maxBackups: number;
  backupTypes: ('full' | 'users' | 'config' | 'security')[];
  compression: boolean;
  encryption: boolean;
  storageLocation: 'local' | 'cloud';
}

export class BackupService {
  private static readonly STORAGE_KEY = 'skyship_backups';
  private static readonly CONFIG_KEY = 'backup_config';
  
  private static config: BackupConfig = {
    autoBackup: true,
    backupInterval: 24, // 24 hours
    maxBackups: 10,
    backupTypes: ['full', 'users', 'config'],
    compression: true,
    encryption: false, // Demo purposes
    storageLocation: 'local',
  };

  /**
   * Get backup configuration
   */
  static getConfig(): BackupConfig {
    return { ...this.config };
  }

  /**
   * Update backup configuration
   */
  static updateConfig(newConfig: Partial<BackupConfig>): void {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.config));
  }

  /**
   * Load configuration from localStorage
   */
  static loadConfig(): void {
    const saved = localStorage.getItem(this.CONFIG_KEY);
    if (saved) {
      try {
        this.config = { ...this.config, ...JSON.parse(saved) };
      } catch (error) {
        console.error('Failed to load backup config:', error);
      }
    }
  }

  /**
   * Create a full system backup
   */
  static async createFullBackup(): Promise<BackupData> {
    const backupData = {
      users: this.getUsersData(),
      config: this.getConfigData(),
      security: this.getSecurityData(),
      system: this.getSystemData(),
    };

    return this.createBackup('full', backupData, 'Complete system backup');
  }

  /**
   * Create a users-only backup
   */
  static async createUsersBackup(): Promise<BackupData> {
    const usersData = this.getUsersData();
    return this.createBackup('users', usersData, 'Users data backup');
  }

  /**
   * Create a configuration backup
   */
  static async createConfigBackup(): Promise<BackupData> {
    const configData = this.getConfigData();
    return this.createBackup('config', configData, 'System configuration backup');
  }

  /**
   * Create a security data backup
   */
  static async createSecurityBackup(): Promise<BackupData> {
    const securityData = this.getSecurityData();
    return this.createBackup('security', securityData, 'Security logs and settings backup');
  }

  /**
   * Create backup with given data
   */
  private static async createBackup(type: BackupData['type'], data: any, description: string): Promise<BackupData> {
    const timestamp = new Date();
    const id = `backup_${timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Compress data if enabled
    let processedData = data;
    if (this.config.compression) {
      processedData = this.compressData(data);
    }

    // Encrypt data if enabled
    if (this.config.encryption) {
      processedData = this.encryptData(processedData);
    }

    const backup: BackupData = {
      id,
      timestamp,
      type,
      size: JSON.stringify(processedData).length,
      description,
      data: processedData,
      checksum: this.generateChecksum(processedData),
    };

    // Save backup
    this.saveBackup(backup);

    // Clean up old backups if needed
    this.cleanupOldBackups();

    console.log(`Backup created: ${id} (${type})`);
    return backup;
  }

  /**
   * Get users data for backup
   */
  private static getUsersData(): any {
    const registeredUsers = localStorage.getItem('registeredUsers');
    const currentUser = localStorage.getItem('user');
    
    return {
      registeredUsers: registeredUsers ? JSON.parse(registeredUsers) : [],
      currentUser: currentUser ? JSON.parse(currentUser) : null,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get configuration data for backup
   */
  private static getConfigData(): any {
    return {
      ipRestriction: localStorage.getItem('ipRestrictionConfig'),
      passwordPolicy: localStorage.getItem('passwordPolicy'),
      backupConfig: this.config,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get security data for backup
   */
  private static getSecurityData(): any {
    // In a real app, this would include security logs, audit trails, etc.
    return {
      securityEvents: localStorage.getItem('securityEvents') || [],
      loginAttempts: localStorage.getItem('loginAttempts') || [],
      blockedIPs: localStorage.getItem('blockedIPs') || [],
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get system data for backup
   */
  private static getSystemData(): any {
    return {
      version: '2.1.0',
      buildDate: new Date().toISOString(),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Save backup to storage
   */
  private static saveBackup(backup: BackupData): void {
    const backups = this.getBackups();
    backups.push(backup);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(backups));
  }

  /**
   * Get all backups
   */
  static getBackups(): BackupData[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Failed to load backups:', error);
        return [];
      }
    }
    return [];
  }

  /**
   * Restore from backup
   */
  static async restoreBackup(backupId: string): Promise<boolean> {
    try {
      const backups = this.getBackups();
      const backup = backups.find(b => b.id === backupId);
      
      if (!backup) {
        throw new Error('Backup not found');
      }

      // Verify checksum
      if (backup.checksum !== this.generateChecksum(backup.data)) {
        throw new Error('Backup integrity check failed');
      }

      let data = backup.data;

      // Decrypt if needed
      if (this.config.encryption) {
        data = this.decryptData(data);
      }

      // Decompress if needed
      if (this.config.compression) {
        data = this.decompressData(data);
      }

      // Restore data based on type
      switch (backup.type) {
        case 'full':
          await this.restoreFullBackup(data);
          break;
        case 'users':
          await this.restoreUsersBackup(data);
          break;
        case 'config':
          await this.restoreConfigBackup(data);
          break;
        case 'security':
          await this.restoreSecurityBackup(data);
          break;
      }

      console.log(`Backup restored successfully: ${backupId}`);
      return true;
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return false;
    }
  }

  /**
   * Restore full backup
   */
  private static async restoreFullBackup(data: any): Promise<void> {
    if (data.users) {
      await this.restoreUsersBackup(data.users);
    }
    if (data.config) {
      await this.restoreConfigBackup(data.config);
    }
    if (data.security) {
      await this.restoreSecurityBackup(data.security);
    }
  }

  /**
   * Restore users backup
   */
  private static async restoreUsersBackup(data: any): Promise<void> {
    if (data.registeredUsers) {
      localStorage.setItem('registeredUsers', JSON.stringify(data.registeredUsers));
    }
    if (data.currentUser) {
      localStorage.setItem('user', JSON.stringify(data.currentUser));
    }
  }

  /**
   * Restore configuration backup
   */
  private static async restoreConfigBackup(data: any): Promise<void> {
    if (data.ipRestriction) {
      localStorage.setItem('ipRestrictionConfig', data.ipRestriction);
    }
    if (data.passwordPolicy) {
      localStorage.setItem('passwordPolicy', data.passwordPolicy);
    }
    if (data.backupConfig) {
      this.updateConfig(data.backupConfig);
    }
  }

  /**
   * Restore security backup
   */
  private static async restoreSecurityBackup(data: any): Promise<void> {
    if (data.securityEvents) {
      localStorage.setItem('securityEvents', JSON.stringify(data.securityEvents));
    }
    if (data.loginAttempts) {
      localStorage.setItem('loginAttempts', JSON.stringify(data.loginAttempts));
    }
    if (data.blockedIPs) {
      localStorage.setItem('blockedIPs', JSON.stringify(data.blockedIPs));
    }
  }

  /**
   * Delete backup
   */
  static deleteBackup(backupId: string): boolean {
    try {
      const backups = this.getBackups();
      const filteredBackups = backups.filter(b => b.id !== backupId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredBackups));
      console.log(`Backup deleted: ${backupId}`);
      return true;
    } catch (error) {
      console.error('Failed to delete backup:', error);
      return false;
    }
  }

  /**
   * Export backup to file
   */
  static exportBackup(backupId: string): void {
    const backups = this.getBackups();
    const backup = backups.find(b => b.id === backupId);
    
    if (backup) {
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${backup.type}_${backup.timestamp.toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Import backup from file
   */
  static async importBackup(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const backup: BackupData = JSON.parse(text);
      
      // Validate backup structure
      if (!backup.id || !backup.timestamp || !backup.type || !backup.data) {
        throw new Error('Invalid backup file format');
      }

      // Verify checksum
      if (backup.checksum !== this.generateChecksum(backup.data)) {
        throw new Error('Backup integrity check failed');
      }

      // Save imported backup
      this.saveBackup(backup);
      console.log(`Backup imported successfully: ${backup.id}`);
      return true;
    } catch (error) {
      console.error('Failed to import backup:', error);
      return false;
    }
  }

  /**
   * Clean up old backups
   */
  private static cleanupOldBackups(): void {
    const backups = this.getBackups();
    if (backups.length > this.config.maxBackups) {
      // Sort by timestamp and keep only the newest ones
      const sortedBackups = backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      const backupsToKeep = sortedBackups.slice(0, this.config.maxBackups);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(backupsToKeep));
      
      console.log(`Cleaned up ${backups.length - backupsToKeep.length} old backups`);
    }
  }

  /**
   * Generate checksum for data integrity
   */
  private static generateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Compress data (simple demo implementation)
   */
  private static compressData(data: any): any {
    // In production, use proper compression libraries
    return data;
  }

  /**
   * Decompress data
   */
  private static decompressData(data: any): any {
    return data;
  }

  /**
   * Encrypt data (demo implementation)
   */
  private static encryptData(data: any): any {
    // In production, use proper encryption libraries
    return data;
  }

  /**
   * Decrypt data
   */
  private static decryptData(data: any): any {
    return data;
  }

  /**
   * Get backup statistics
   */
  static getBackupStats(): { total: number; totalSize: number; types: Record<string, number> } {
    const backups = this.getBackups();
    const types: Record<string, number> = {};
    let totalSize = 0;

    backups.forEach(backup => {
      types[backup.type] = (types[backup.type] || 0) + 1;
      totalSize += backup.size;
    });

    return {
      total: backups.length,
      totalSize,
      types,
    };
  }

  /**
   * Schedule automatic backup
   */
  static scheduleAutoBackup(): void {
    if (this.config.autoBackup) {
      setInterval(() => {
        this.createFullBackup();
      }, this.config.backupInterval * 60 * 60 * 1000); // Convert hours to milliseconds
    }
  }
}

// Initialize service
BackupService.loadConfig();

// Convenience functions
export const createBackup = (type: BackupData['type']) => {
  switch (type) {
    case 'full': return BackupService.createFullBackup();
    case 'users': return BackupService.createUsersBackup();
    case 'config': return BackupService.createConfigBackup();
    case 'security': return BackupService.createSecurityBackup();
    default: throw new Error('Invalid backup type');
  }
};
export const getBackups = () => BackupService.getBackups();
export const restoreBackup = (id: string) => BackupService.restoreBackup(id);
export const deleteBackup = (id: string) => BackupService.deleteBackup(id);
export const exportBackup = (id: string) => BackupService.exportBackup(id);
export const importBackup = (file: File) => BackupService.importBackup(file);
export const getBackupConfig = () => BackupService.getConfig();
export const updateBackupConfig = (config: Partial<BackupConfig>) => BackupService.updateConfig(config);
export const getBackupStats = () => BackupService.getBackupStats();
