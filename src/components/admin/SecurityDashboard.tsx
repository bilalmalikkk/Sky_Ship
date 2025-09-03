import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Download, 
  Trash2, 
  RefreshCw,
  User,
  Clock,
  MapPin,
  Activity
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { securityLogger, SecurityEvent, LoginAttempt } from "@/services/securityLogger";

const SecurityDashboard = () => {
  const { user } = useAuth();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<number>(24); // hours

  useEffect(() => {
    loadSecurityData();
  }, [selectedTimeRange]);

  const loadSecurityData = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const events = securityLogger.getSecurityEvents(100);
      const attempts = securityLogger.getLoginAttempts(100);
      
      // Filter by time range
      const cutoffTime = new Date(Date.now() - selectedTimeRange * 60 * 60 * 1000);
      const filteredEvents = events.filter(event => event.timestamp > cutoffTime);
      const filteredAttempts = attempts.filter(attempt => attempt.timestamp > cutoffTime);
      
      setSecurityEvents(filteredEvents);
      setLoginAttempts(filteredAttempts);
      setIsLoading(false);
    }, 500);
  };

  const exportLogs = () => {
    const logs = securityLogger.exportLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all security logs? This action cannot be undone.')) {
      securityLogger.clearLogs();
      loadSecurityData();
    }
  };

  const getSecurityStats = () => {
    const totalEvents = securityEvents.length;
    const failedLogins = loginAttempts.filter(attempt => !attempt.success).length;
    const successfulLogins = loginAttempts.filter(attempt => attempt.success).length;
    const suspiciousIPs = new Set(
      loginAttempts
        .filter(attempt => !attempt.success)
        .map(attempt => attempt.ipAddress)
    ).size;

    return { totalEvents, failedLogins, successfulLogins, suspiciousIPs };
  };

  const stats = getSecurityStats();

  const getEventIcon = (action: string) => {
    switch (action) {
      case 'login_attempt':
        return <User className="w-4 h-4" />;
      case 'user_action':
        return <Activity className="w-4 h-4" />;
      case 'admin_action':
        return <Shield className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getEventColor = (success: boolean) => {
    return success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
          <p className="text-gray-600">Monitor security events and user activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadSecurityData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline" onClick={clearLogs} className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Logs
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[1, 6, 24, 72].map((hours) => (
          <Button
            key={hours}
            variant={selectedTimeRange === hours ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTimeRange(hours)}
          >
            {hours}h
          </Button>
        ))}
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              Last {selectedTimeRange} hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failedLogins}</div>
            <p className="text-xs text-muted-foreground">
              Potential security threats
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Logins</CardTitle>
            <User className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.successfulLogins}</div>
            <p className="text-xs text-muted-foreground">
              Legitimate access
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious IPs</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.suspiciousIPs}</div>
            <p className="text-xs text-muted-foreground">
              IPs with failed attempts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {stats.failedLogins > 5 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Security Alert:</strong> Multiple failed login attempts detected. 
            Consider implementing additional security measures or blocking suspicious IP addresses.
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            Latest security events and user actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityEvents.slice(0, 10).map((event, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">
                    {event.timestamp.toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getEventIcon(event.action)}
                      <span className="font-medium">{event.userEmail}</span>
                      <Badge variant="outline">{event.userRole}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{event.action}</TableCell>
                  <TableCell>{event.resource}</TableCell>
                  <TableCell className="font-mono text-sm">{event.ipAddress}</TableCell>
                  <TableCell>
                    <Badge className={getEventColor(event.success)}>
                      {event.success ? 'Success' : 'Failed'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Login Attempts */}
      <Card>
        <CardHeader>
          <CardTitle>Login Attempts</CardTitle>
          <CardDescription>
            Recent login attempts and authentication events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginAttempts.slice(0, 10).map((attempt, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">
                    {attempt.timestamp.toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="font-medium">{attempt.email}</TableCell>
                  <TableCell className="font-mono text-sm">{attempt.ipAddress}</TableCell>
                  <TableCell>
                    <Badge className={getEventColor(attempt.success)}>
                      {attempt.success ? 'Success' : 'Failed'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {attempt.failureReason || 'Successful authentication'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
