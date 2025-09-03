import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Users, 
  Package, 
  BarChart3, 
  MessageSquare,
  Edit,
  Trash2,
  Plus,
  Eye
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ModeratorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("content");

  // Mock data for demonstration
  const mockContent = [
    { id: 1, title: "Shipping Services Overview", type: "Page", status: "Published", lastModified: "2024-12-15" },
    { id: 2, title: "About Our Company", type: "Page", status: "Draft", lastModified: "2024-12-14" },
    { id: 3, title: "Contact Information", type: "Page", status: "Published", lastModified: "2024-12-13" },
  ];

  const mockCustomers = [
    { id: 1, name: "John Smith", email: "john@example.com", status: "Active", lastOrder: "2024-12-10" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", status: "Active", lastOrder: "2024-12-08" },
    { id: 3, name: "Mike Wilson", email: "mike@example.com", status: "Inactive", lastOrder: "2024-11-25" },
  ];

  const mockShipments = [
    { id: 1, trackingNumber: "SKY001234", customer: "John Smith", status: "In Transit", destination: "New York" },
    { id: 2, trackingNumber: "SKY001235", customer: "Sarah Johnson", status: "Delivered", destination: "Los Angeles" },
    { id: 3, trackingNumber: "SKY001236", customer: "Mike Wilson", status: "Processing", destination: "Chicago" },
  ];

  const mockAnalytics = {
    totalCustomers: 1250,
    activeShipments: 89,
    monthlyRevenue: "$45,230",
    customerSatisfaction: "4.8/5"
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Moderator Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}. Manage content, customers, and view analytics.
            </p>
            <div className="mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Role: {user?.role}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">Active customers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.activeShipments}</div>
                <p className="text-xs text-muted-foreground">Currently in transit</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.monthlyRevenue}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.customerSatisfaction}</div>
                <p className="text-xs text-muted-foreground">Customer rating</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content Management</TabsTrigger>
              <TabsTrigger value="customers">Customer Management</TabsTrigger>
              <TabsTrigger value="shipments">Shipment Tracking</TabsTrigger>
            </TabsList>

            {/* Content Management Tab */}
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Website Content</CardTitle>
                      <CardDescription>Manage pages and content</CardDescription>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Content
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockContent.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-gray-500">{item.type} • {item.lastModified}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={item.status === "Published" ? "default" : "secondary"}>
                            {item.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customer Management Tab */}
            <TabsContent value="customers" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Customer Database</CardTitle>
                      <CardDescription>View and manage customer information</CardDescription>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Customer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCustomers.map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{customer.name}</h3>
                          <p className="text-sm text-gray-500">{customer.email} • Last order: {customer.lastOrder}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                            {customer.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shipment Tracking Tab */}
            <TabsContent value="shipments" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Shipment Management</CardTitle>
                      <CardDescription>Track and manage shipments</CardDescription>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Shipment
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockShipments.map((shipment) => (
                      <div key={shipment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">#{shipment.trackingNumber}</h3>
                          <p className="text-sm text-gray-500">{shipment.customer} → {shipment.destination}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            shipment.status === "Delivered" ? "default" : 
                            shipment.status === "In Transit" ? "secondary" : "outline"
                          }>
                            {shipment.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Track
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Update
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ModeratorDashboard;
