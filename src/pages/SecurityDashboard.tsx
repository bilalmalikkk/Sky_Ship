import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Lock, 
  Users, 
  Activity,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  MapPin,
  UserCheck,
  Key,
  Clock,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { adminSecurity, AdminRole, Permission, SecurityLogEntry, ADMIN_SECURITY_CONFIG } from "@/services/adminSecurity";

const SecurityDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [securityStatus, setSecurityStatus] = useState(adminSecurity.getSecurityStatus());
  const [securityLogs, setSecurityLogs] = useState<SecurityLogEntry[]>([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    userId: '',
    action: '',
    success: undefined as boolean | undefined
  });
  const [ipWhitelist, setIpWhitelist] = useState(ADMIN_SECURITY_CONFIG.ALLOWED_IPS);
  const [newIp, setNewIp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSecurityLogs();
    const interval = setInterval(() => {
      setSecurityStatus(adminSecurity.getSecurityStatus());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadSecurityLogs = () => {
    const logs = adminSecurity.getSecurityLogs({
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      userId: filters.userId || undefined,
      action: filters.action || undefined,
      success: filters.success
    });
    setSecurityLogs(logs);
  };

  const addIpToWhitelist = () => {
    if (newIp && !ipWhitelist.includes(newIp)) {
      const updatedList = [...ipWhitelist, newIp];
      setIpWhitelist(updatedList);
      setNewIp('');
      
      // Log the change
      adminSecurity.logSecurityEvent({
        action: 'IP_WHITELIST_ADDED',
        resource: 'security_config',
        ipAddress: newIp,
        userId: 'admin',
        userEmail: 'admin@skyship.com',
        userAgent: navigator.userAgent,
        success: true,
        details: 'IP address added to whitelist'
      });
    }
  };

  const removeIpFromWhitelist = (ip: string) => {
    if (ip !== '127.0.0.1' && ip !== '::1') { // Prevent removing localhost
      const updatedList = ipWhitelist.filter(ipAddr => ipAddr !== ip);
      setIpWhitelist(updatedList);
      
      adminSecurity.logSecurityEvent({
        action: 'IP_WHITELIST_REMOVED',
        resource: 'security_config',
        ipAddress: ip,
        userId: 'admin',
        userEmail: 'admin@skyship.com',
        userAgent: navigator.userAgent,
        success: true,
        details: 'IP address removed from whitelist'
      });
    }
  };

  const exportSecurityLogs = () => {
    const csvContent = [
      'Timestamp,User ID,User Email,Action,Resource,IP Address,User Agent,Success,Details',
      ...securityLogs.map(log => 
        `${log.timestamp.toISOString()},"${log.userId}","${log.userEmail}","${log.action}","${log.resource}","${log.ipAddress}","${log.userAgent}","${log.success}","${log.details || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN_SUCCESS':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'LOGIN_FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'IP_ACCESS_DENIED':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'ACCOUNT_LOCKED':
        return <Lock className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN_SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'LOGIN_FAILED':
        return 'bg-red-100 text-red-800';
      case 'IP_ACCESS_DENIED':
        return 'bg-orange-100 text-orange-800';
      case 'ACCOUNT_LOCKED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Security Dashboard
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Monitor and manage security settings, track access attempts, and protect your admin interface.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge className="bg-white/20 text-white px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                {securityStatus.totalLogs} Security Events
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {securityStatus.recentFailures} Recent Failures
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2">
                <Lock className="w-4 h-4 mr-2" />
                {securityStatus.lockedAccounts} Locked Accounts
              </Badge>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="logs">Security Logs</TabsTrigger>
                <TabsTrigger value="access">Access Control</TabsTrigger>
                <TabsTrigger value="settings">Security Settings</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                {/* Security Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {securityStatus.totalLogs}
                      </h3>
                      <p className="text-gray-600">Total Security Events</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {securityStatus.recentFailures}
                      </h3>
                      <p className="text-gray-600">Recent Failures (24h)</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-orange-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {securityStatus.lockedAccounts}
                      </h3>
                      <p className="text-gray-600">Locked Accounts</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {securityStatus.activeSessions}
                      </h3>
                      <p className="text-gray-600">Active Sessions</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Security Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Recent Security Events
                    </CardTitle>
                    <CardDescription>
                      Latest security activities and access attempts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {securityLogs.slice(0, 10).map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getActionIcon(log.action)}
                            <div>
                              <p className="font-medium">{log.action.replace(/_/g, ' ')}</p>
                              <p className="text-sm text-gray-600">
                                {log.userEmail} • {log.ipAddress}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getActionColor(log.action)}>
                              {log.success ? 'Success' : 'Failed'}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {log.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Logs Tab */}
              <TabsContent value="logs" className="space-y-8">
                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Filter Security Logs</CardTitle>
                    <CardDescription>
                      Filter logs by date, user, action, and status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={filters.startDate}
                          onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={filters.endDate}
                          onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="userId">User ID</Label>
                        <Input
                          id="userId"
                          placeholder="Filter by user"
                          value={filters.userId}
                          onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="action">Action</Label>
                        <Select value={filters.action} onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="All actions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All actions</SelectItem>
                            <SelectItem value="LOGIN_SUCCESS">Login Success</SelectItem>
                            <SelectItem value="LOGIN_FAILED">Login Failed</SelectItem>
                            <SelectItem value="IP_ACCESS_DENIED">IP Access Denied</SelectItem>
                            <SelectItem value="ACCOUNT_LOCKED">Account Locked</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="success">Status</Label>
                        <Select value={filters.success?.toString() || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, success: value === '' ? undefined : value === 'true' }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All statuses</SelectItem>
                            <SelectItem value="true">Success</SelectItem>
                            <SelectItem value="false">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button onClick={loadSecurityLogs}>
                        <Filter className="w-4 h-4 mr-2" />
                        Apply Filters
                      </Button>
                      <Button variant="outline" onClick={() => setFilters({ startDate: '', endDate: '', userId: '', action: '', success: undefined })}>
                        Clear Filters
                      </Button>
                      <Button variant="outline" onClick={exportSecurityLogs}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Logs Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Security Logs</CardTitle>
                    <CardDescription>
                      {securityLogs.length} events found
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {securityLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                            {getActionIcon(log.action)}
                            <div>
                              <p className="font-medium">{log.action.replace(/_/g, ' ')}</p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">{log.userEmail}</span> • {log.resource}
                              </p>
                              <p className="text-xs text-gray-500">
                                {log.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-medium">{log.ipAddress}</p>
                              <p className="text-xs text-gray-500">{log.userAgent.substring(0, 50)}...</p>
                            </div>
                            <Badge className={getActionColor(log.action)}>
                              {log.success ? 'Success' : 'Failed'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Access Control Tab */}
              <TabsContent value="access" className="space-y-8">
                {/* IP Whitelist Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      IP Address Whitelist
                    </CardTitle>
                    <CardDescription>
                      Control which IP addresses can access the admin panel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter IP address (e.g., 192.168.1.100)"
                          value={newIp}
                          onChange={(e) => setNewIp(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={addIpToWhitelist}>
                          Add IP
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {ipWhitelist.map((ip) => (
                          <div key={ip} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-blue-500" />
                              <span className="font-mono">{ip}</span>
                              {ip === '127.0.0.1' || ip === '::1' ? (
                                <Badge className="bg-green-100 text-green-800">Localhost</Badge>
                              ) : (
                                <Badge className="bg-blue-100 text-blue-800">Whitelisted</Badge>
                              )}
                            </div>
                            {(ip !== '127.0.0.1' && ip !== '::1') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeIpFromWhitelist(ip)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Role and Permission Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      Role and Permission Overview
                    </CardTitle>
                    <CardDescription>
                      Current role hierarchy and permission structure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.values(AdminRole).map((role) => (
                        <div key={role} className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2 capitalize">{role.replace('_', ' ')}</h4>
                          <div className="space-y-1">
                            {adminSecurity.hasPermission(role, Permission.VIEW_USERS) && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">View Users</Badge>
                            )}
                            {adminSecurity.hasPermission(role, Permission.EDIT_SETTINGS) && (
                              <Badge className="bg-green-100 text-green-800 text-xs">Edit Settings</Badge>
                            )}
                            {adminSecurity.hasPermission(role, Permission.SECURITY_CONFIG) && (
                              <Badge className="bg-red-100 text-red-800 text-xs">Security Config</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings Tab */}
              <TabsContent value="settings" className="space-y-8">
                {/* Password Policy */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      Password Policy
                    </CardTitle>
                    <CardDescription>
                      Configure password strength requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Current Requirements</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Minimum {ADMIN_SECURITY_CONFIG.PASSWORD_REQUIREMENTS.minLength} characters
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Must contain uppercase letters
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Must contain lowercase letters
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Must contain numbers
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Must contain special characters
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Prevent common passwords
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold">Security Recommendations</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Enable 2FA:</strong> Consider implementing two-factor authentication for additional security.
                            </p>
                          </div>
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                              <strong>Regular Updates:</strong> Keep all systems and dependencies updated to patch security vulnerabilities.
                            </p>
                          </div>
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-sm text-orange-800">
                              <strong>Monitor Logs:</strong> Regularly review security logs for suspicious activity.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Session Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Session Management
                    </CardTitle>
                    <CardDescription>
                      Configure session timeout and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={ADMIN_SECURITY_CONFIG.SESSION_TIMEOUT}
                          disabled
                          className="mt-1"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Sessions automatically expire after this time
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                        <Input
                          id="maxAttempts"
                          type="number"
                          value={ADMIN_SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS}
                          disabled
                          className="mt-1"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Account locked after exceeding this limit
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                        <Input
                          id="lockoutDuration"
                          type="number"
                          value={ADMIN_SECURITY_CONFIG.LOCKOUT_DURATION}
                          disabled
                          className="mt-1"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          How long accounts remain locked
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SecurityDashboard;
