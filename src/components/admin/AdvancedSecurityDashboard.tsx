import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Database,
  Network,
  Key,
  QrCode,
  Copy,
  Plus,
  Minus
} from "lucide-react";
import { 
  getIPRestrictionConfig, 
  updateIPRestrictionConfig, 
  testIPRestriction,
  canAccessAdmin,
  getBlockedIPs
} from "@/services/ipRestriction";
import { 
  getPasswordPolicy, 
  updatePasswordPolicy, 
  resetPasswordPolicy,
  generateSecurePassword,
  getPasswordRequirements
} from "@/services/passwordSecurity";
import { 
  getBackupConfig, 
  updateBackupConfig, 
  createBackup, 
  getBackups, 
  restoreBackup, 
  deleteBackup, 
  exportBackup, 
  importBackup,
  getBackupStats
} from "@/services/backupService";
import { 
  generate2FASecret, 
  generate2FAQR, 
  generate2FACode, 
  validate2FACode,
  generateBackupCodes
} from "@/services/twoFactorAuth";
import { IPRestrictionConfig } from "@/services/ipRestriction";
import { PasswordPolicy } from "@/services/passwordSecurity";
import { BackupConfig, BackupData } from "@/services/backupService";

const AdvancedSecurityDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [ipConfig, setIPConfig] = useState<IPRestrictionConfig | null>(null);
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy | null>(null);
  const [backupConfig, setBackupConfig] = useState<BackupConfig | null>(null);
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [backupStats, setBackupStats] = useState<any>(null);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFASecret, setTwoFASecret] = useState("");
  const [twoFAQR, setTwoFAQR] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFAVerification, setTwoFAVerification] = useState("");
  const [twoFABackupCodes, setTwoFABackupCodes] = useState<string[]>([]);
  const [testIPIndex, setTestIPIndex] = useState(0);
  const [currentClientIP, setCurrentClientIP] = useState("");
  const [canAccess, setCanAccess] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadConfigurations();
    loadBackups();
    checkIPAccess();
  }, []);

  const loadConfigurations = () => {
    setIPConfig(getIPRestrictionConfig());
    setPasswordPolicy(getPasswordPolicy());
    setBackupConfig(getBackupConfig());
  };

  const loadBackups = () => {
    setBackups(getBackups());
    setBackupStats(getBackupStats());
  };

  const checkIPAccess = () => {
    const access = canAccessAdmin();
    setCanAccess(access);
    // In a real app, this would get the actual client IP
    setCurrentClientIP("192.168.1.1"); // Demo IP
  };

  const handleIPConfigUpdate = (updates: Partial<IPRestrictionConfig>) => {
    if (ipConfig) {
      const newConfig = { ...ipConfig, ...updates };
      updateIPRestrictionConfig(newConfig);
      setIPConfig(newConfig);
      setSuccessMessage("IP restriction configuration updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handlePasswordPolicyUpdate = (updates: Partial<PasswordPolicy>) => {
    if (passwordPolicy) {
      const newPolicy = { ...passwordPolicy, ...updates };
      updatePasswordPolicy(newPolicy);
      setPasswordPolicy(newPolicy);
      setSuccessMessage("Password policy updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleBackupConfigUpdate = (updates: Partial<BackupConfig>) => {
    if (backupConfig) {
      const newConfig = { ...backupConfig, ...updates };
      updateBackupConfig(newConfig);
      setBackupConfig(newConfig);
      setSuccessMessage("Backup configuration updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleCreateBackup = async (type: BackupData['type']) => {
    try {
      await createBackup(type);
      loadBackups();
      setSuccessMessage(`${type} backup created successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to create backup");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (window.confirm("Are you sure you want to restore this backup? This will overwrite current data.")) {
      try {
        await restoreBackup(backupId);
        setSuccessMessage("Backup restored successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        // Reload configurations
        loadConfigurations();
      } catch (error) {
        setErrorMessage("Failed to restore backup");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    }
  };

  const handleDeleteBackup = (backupId: string) => {
    if (window.confirm("Are you sure you want to delete this backup?")) {
      deleteBackup(backupId);
      loadBackups();
      setSuccessMessage("Backup deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleExportBackup = (backupId: string) => {
    exportBackup(backupId);
    setSuccessMessage("Backup exported successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importBackup(file);
        loadBackups();
        setSuccessMessage("Backup imported successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        setErrorMessage("Failed to import backup");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    }
  };

  const setup2FA = () => {
    const secret = generate2FASecret();
    const qr = generate2FAQR("admin@skyship.com", secret);
    const backupCodes = generateBackupCodes();
    
    setTwoFASecret(secret);
    setTwoFAQR(qr);
    setTwoFABackupCodes(backupCodes);
    setShow2FASetup(true);
  };

  const verify2FA = () => {
    if (validate2FACode(twoFASecret, twoFAVerification)) {
      setSuccessMessage("2FA verification successful! 2FA is now enabled.");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShow2FASetup(false);
    } else {
      setErrorMessage("Invalid 2FA code. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const testIPRestriction = (index: number) => {
    testIPRestriction(index);
    setTestIPIndex(index);
    setTimeout(checkIPAccess, 100);
  };

  const generatePassword = () => {
    if (passwordPolicy) {
      const password = generateSecurePassword(16);
      setTwoFACode(password);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccessMessage("Copied to clipboard!");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const getStatusColor = (status: boolean) => status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  const getStatusIcon = (status: boolean) => status ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}
      {errorMessage && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IP Access</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{canAccess ? "Allowed" : "Blocked"}</div>
            <p className="text-xs text-muted-foreground">Current IP: {currentClientIP}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">2FA Status</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{show2FASetup ? "Setup" : "Disabled"}</div>
            <p className="text-xs text-muted-foreground">Two-factor authentication</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backups</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backupStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Total backups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Overall security</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Security Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ip">IP Security</TabsTrigger>
          <TabsTrigger value="2fa">Two-Factor Auth</TabsTrigger>
          <TabsTrigger value="passwords">Password Policy</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
                <CardDescription>Current security configuration status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">IP Restrictions</span>
                  <Badge className={getStatusColor(ipConfig?.enabled || false)}>
                    {ipConfig?.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">2FA Protection</span>
                  <Badge className={getStatusColor(show2FASetup)}>
                    {show2FASetup ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Strong Passwords</span>
                  <Badge className={getStatusColor(passwordPolicy?.requireSpecialChars || false)}>
                    {passwordPolicy?.requireSpecialChars ? "Required" : "Optional"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto Backup</span>
                  <Badge className={getStatusColor(backupConfig?.autoBackup || false)}>
                    {backupConfig?.autoBackup ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common security tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={setup2FA} className="w-full justify-start" variant="outline">
                  <Key className="w-4 h-4 mr-2" />
                  Setup 2FA
                </Button>
                <Button onClick={() => handleCreateBackup('full')} className="w-full justify-start" variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Create Backup
                </Button>
                <Button onClick={checkIPAccess} className="w-full justify-start" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Test IP Access
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* IP Security Tab */}
        <TabsContent value="ip" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>IP Restriction Configuration</CardTitle>
              <CardDescription>Control admin access by IP address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {ipConfig && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ip-enabled">Enable IP Restrictions</Label>
                    <Switch
                      id="ip-enabled"
                      checked={ipConfig.enabled}
                      onCheckedChange={(checked) => handleIPConfigUpdate({ enabled: checked })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Allowed IP Addresses</Label>
                      <div className="space-y-2 mt-2">
                        {ipConfig.allowedIPs.map((ip, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input value={ip} readOnly />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newIPs = ipConfig.allowedIPs.filter((_, i) => i !== index);
                                handleIPConfigUpdate({ allowedIPs: newIPs });
                              }}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newIPs = [...ipConfig.allowedIPs, "192.168.1.1"];
                            handleIPConfigUpdate({ allowedIPs: newIPs });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add IP
                        </Button>
                      </div>
                    </div>

                                         <div>
                       <Label>IP Access Mode</Label>
                       <Select
                         value={ipConfig.whitelistMode ? "whitelist" : "blacklist"}
                         onValueChange={(value) => handleIPConfigUpdate({ whitelistMode: value === "whitelist" })}
                       >
                         <SelectTrigger>
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="whitelist">Whitelist (Only listed IPs)</SelectItem>
                           <SelectItem value="blacklist">Blacklist (Block listed IPs)</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                  </div>

                  <div>
                    <Label>Test IP Restrictions</Label>
                    <div className="flex gap-2 mt-2">
                      {[0, 1, 2, 3].map((index) => (
                        <Button
                          key={index}
                          variant={testIPIndex === index ? "default" : "outline"}
                          onClick={() => testIPRestriction(index)}
                        >
                          Test IP {index + 1}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Two-Factor Authentication Tab */}
        <TabsContent value="2fa" className="space-y-6">
          {!show2FASetup ? (
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your admin account</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={setup2FA} className="w-full">
                  <Key className="w-4 h-4 mr-2" />
                  Setup 2FA
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Setup 2FA</CardTitle>
                  <CardDescription>Scan the QR code with your authenticator app</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="bg-gray-100 p-4 rounded-lg inline-block">
                      <QrCode className="w-32 h-32" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Secret Key (Manual Entry)</Label>
                    <div className="flex items-center gap-2">
                      <Input value={twoFASecret} readOnly />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(twoFASecret)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Verification Code</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={twoFAVerification}
                        onChange={(e) => setTwoFAVerification(e.target.value)}
                        placeholder="Enter 6-digit code"
                      />
                      <Button onClick={verify2FA}>Verify</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Backup Codes</CardTitle>
                  <CardDescription>Save these codes in case you lose access to your authenticator</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {twoFABackupCodes.map((code, index) => (
                      <div key={index} className="bg-gray-100 p-2 rounded text-center font-mono">
                        {code}
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full mt-4"
                    variant="outline"
                    onClick={() => copyToClipboard(twoFABackupCodes.join('\n'))}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All Codes
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Password Policy Tab */}
        <TabsContent value="passwords" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password Security Policy</CardTitle>
              <CardDescription>Configure password requirements and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {passwordPolicy && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Minimum Length</Label>
                      <Input
                        type="number"
                        value={passwordPolicy.minLength}
                        onChange={(e) => handlePasswordPolicyUpdate({ minLength: parseInt(e.target.value) })}
                        min="6"
                        max="128"
                      />
                    </div>
                    <div>
                      <Label>Maximum Length</Label>
                      <Input
                        type="number"
                        value={passwordPolicy.maxLength}
                        onChange={(e) => handlePasswordPolicyUpdate({ maxLength: parseInt(e.target.value) })}
                        min="8"
                        max="256"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Require Uppercase Letters</Label>
                      <Switch
                        checked={passwordPolicy.requireUppercase}
                        onCheckedChange={(checked) => handlePasswordPolicyUpdate({ requireUppercase: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Require Lowercase Letters</Label>
                      <Switch
                        checked={passwordPolicy.requireLowercase}
                        onCheckedChange={(checked) => handlePasswordPolicyUpdate({ requireLowercase: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Require Numbers</Label>
                      <Switch
                        checked={passwordPolicy.requireNumbers}
                        onCheckedChange={(checked) => handlePasswordPolicyUpdate({ requireNumbers: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Require Special Characters</Label>
                      <Switch
                        checked={passwordPolicy.requireSpecialChars}
                        onCheckedChange={(checked) => handlePasswordPolicyUpdate({ requireSpecialChars: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Prevent Common Passwords</Label>
                      <Switch
                        checked={passwordPolicy.preventCommonPasswords}
                        onCheckedChange={(checked) => handlePasswordPolicyUpdate({ preventCommonPasswords: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Prevent Personal Information</Label>
                      <Switch
                        checked={passwordPolicy.preventUserInfo}
                        onCheckedChange={(checked) => handlePasswordPolicyUpdate({ preventUserInfo: checked })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Password Requirements</Label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {getPasswordRequirements().map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Generate Secure Password</Label>
                    <div className="flex items-center gap-2">
                      <Input value={twoFACode} readOnly placeholder="Generated password will appear here" />
                      <Button onClick={generatePassword} variant="outline">
                        Generate
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(twoFACode)}
                        disabled={!twoFACode}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => resetPasswordPolicy()}>Reset to Default</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Restore Tab */}
        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup Configuration</CardTitle>
                <CardDescription>Configure automatic backup settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {backupConfig && (
                  <>
                    <div className="flex items-center justify-between">
                      <Label>Enable Auto Backup</Label>
                      <Switch
                        checked={backupConfig.autoBackup}
                        onCheckedChange={(checked) => handleBackupConfigUpdate({ autoBackup: checked })}
                      />
                    </div>
                    <div>
                      <Label>Backup Interval (hours)</Label>
                      <Input
                        type="number"
                        value={backupConfig.backupInterval}
                        onChange={(e) => handleBackupConfigUpdate({ backupInterval: parseInt(e.target.value) })}
                        min="1"
                        max="168"
                      />
                    </div>
                    <div>
                      <Label>Maximum Backups</Label>
                      <Input
                        type="number"
                        value={backupConfig.maxBackups}
                        onChange={(e) => handleBackupConfigUpdate({ maxBackups: parseInt(e.target.value) })}
                        min="1"
                        max="100"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manual Backup</CardTitle>
                <CardDescription>Create backups manually</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleCreateBackup('full')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Full System Backup
                </Button>
                <Button
                  onClick={() => handleCreateBackup('users')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Users Backup
                </Button>
                <Button
                  onClick={() => handleCreateBackup('config')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Configuration Backup
                </Button>
                <Button
                  onClick={() => handleCreateBackup('security')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Security Backup
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Backup Management</CardTitle>
              <CardDescription>View, restore, and manage existing backups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backups.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No backups found</p>
                ) : (
                  backups.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{backup.description}</h3>
                        <p className="text-sm text-gray-500">
                          {backup.timestamp.toLocaleString()} • {backup.type} • {backup.size} bytes
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestoreBackup(backup.id)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExportBackup(backup.id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteBackup(backup.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6">
                <Label>Import Backup</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedSecurityDashboard;
