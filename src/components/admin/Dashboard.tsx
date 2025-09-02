import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, FileText, TrendingUp, Ship, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Customers",
      value: "156",
      change: "+12%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Active Shipments",
      value: "23",
      change: "+5%",
      icon: Package,
      trend: "up"
    },
    {
      title: "Documents",
      value: "342",
      change: "+18%",
      icon: FileText,
      trend: "up"
    },
    {
      title: "Revenue (Month)",
      value: "$45,230",
      change: "+8%",
      icon: TrendingUp,
      trend: "up"
    }
  ];

  const recentShipments = [
    {
      id: "SH-001",
      customer: "Tech Corp Ltd",
      origin: "Shanghai, CN",
      destination: "Los Angeles, US",
      status: "in-transit",
      eta: "2024-01-25"
    },
    {
      id: "SH-002",
      customer: "Global Corp",
      origin: "Hamburg, DE",
      destination: "New York, US",
      status: "customs",
      eta: "2024-01-23"
    },
    {
      id: "SH-003",
      customer: "Startup Inc",
      origin: "Rotterdam, NL",
      destination: "Miami, US",
      status: "delivered",
      eta: "2024-01-20"
    },
    {
      id: "SH-004",
      customer: "Manufacturing Co",
      origin: "Shenzhen, CN",
      destination: "Seattle, US",
      status: "pending",
      eta: "2024-01-28"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-transit": return <Ship className="h-4 w-4 text-blue-500" />;
      case "customs": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "pending": return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "in-transit": return "bg-blue-100 text-blue-800";
      case "customs": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover-scale">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Shipments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
          <CardDescription>Latest shipment activities and status updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentShipments.map((shipment) => (
              <div key={shipment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  {getStatusIcon(shipment.status)}
                  <div>
                    <div className="font-medium">{shipment.id}</div>
                    <div className="text-sm text-muted-foreground">{shipment.customer}</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{shipment.origin}</div>
                  <div className="text-xs text-muted-foreground">to</div>
                  <div className="text-sm font-medium">{shipment.destination}</div>
                </div>
                <div className="text-center">
                  <Badge className={getStatusColor(shipment.status)} variant="secondary">
                    {shipment.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    ETA: {shipment.eta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover-scale cursor-pointer">
          <CardHeader className="text-center">
            <Users className="h-8 w-8 mx-auto text-primary" />
            <CardTitle className="text-lg">Add New Customer</CardTitle>
            <CardDescription>Register a new freight customer</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="hover-scale cursor-pointer">
          <CardHeader className="text-center">
            <Package className="h-8 w-8 mx-auto text-primary" />
            <CardTitle className="text-lg">Create Shipment</CardTitle>
            <CardDescription>Start tracking a new shipment</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="hover-scale cursor-pointer">
          <CardHeader className="text-center">
            <FileText className="h-8 w-8 mx-auto text-primary" />
            <CardTitle className="text-lg">Upload Documents</CardTitle>
            <CardDescription>Add shipping documents</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;