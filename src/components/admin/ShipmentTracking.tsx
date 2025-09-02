import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, Ship, MapPin, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Shipment {
  id: string;
  customer: string;
  origin: string;
  destination: string;
  status: "pending" | "in-transit" | "customs" | "delivered";
  trackingNumber: string;
  vessel: string;
  eta: string;
  created: string;
  weight: string;
  value: string;
}

const ShipmentTracking = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: "SH-001",
      customer: "Tech Corp Ltd",
      origin: "Shanghai, CN",
      destination: "Los Angeles, US",
      status: "in-transit",
      trackingNumber: "TCNK123456789",
      vessel: "MSC OSCAR",
      eta: "2024-01-25",
      created: "2024-01-10",
      weight: "2,500 kg",
      value: "$15,000"
    },
    {
      id: "SH-002",
      customer: "Global Corp",
      origin: "Hamburg, DE",
      destination: "New York, US",
      status: "customs",
      trackingNumber: "GCNK987654321",
      vessel: "MAERSK ALABAMA",
      eta: "2024-01-23",
      created: "2024-01-08",
      weight: "1,800 kg",
      value: "$12,500"
    },
    {
      id: "SH-003",
      customer: "Startup Inc",
      origin: "Rotterdam, NL",
      destination: "Miami, US",
      status: "delivered",
      trackingNumber: "SINK456789123",
      vessel: "CMA CGM MARCO POLO",
      eta: "2024-01-20",
      created: "2024-01-05",
      weight: "900 kg",
      value: "$8,200"
    },
    {
      id: "SH-004",
      customer: "Manufacturing Co",
      origin: "Shenzhen, CN",
      destination: "Seattle, US",
      status: "pending",
      trackingNumber: "MCNK789123456",
      vessel: "EVERGREEN EVER ACE",
      eta: "2024-01-28",
      created: "2024-01-12",
      weight: "3,200 kg",
      value: "$22,000"
    }
  ]);

  const [newShipment, setNewShipment] = useState({
    customer: "",
    origin: "",
    destination: "",
    trackingNumber: "",
    vessel: "",
    eta: "",
    weight: "",
    value: ""
  });

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.vessel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || shipment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddShipment = () => {
    if (!newShipment.customer || !newShipment.origin || !newShipment.destination) {
      toast({
        title: "Error",
        description: "Customer, origin, and destination are required",
        variant: "destructive"
      });
      return;
    }

    const shipment: Shipment = {
      id: `SH-${String(shipments.length + 1).padStart(3, '0')}`,
      ...newShipment,
      status: "pending",
      created: new Date().toISOString().split('T')[0],
      trackingNumber: newShipment.trackingNumber || `TN${Date.now().toString().slice(-9)}`
    };

    setShipments([...shipments, shipment]);
    setNewShipment({
      customer: "",
      origin: "",
      destination: "",
      trackingNumber: "",
      vessel: "",
      eta: "",
      weight: "",
      value: ""
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Shipment created successfully"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-transit": return <Ship className="h-4 w-4 text-blue-500" />;
      case "customs": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "pending": return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default: return <Ship className="h-4 w-4" />;
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Shipment Tracking</CardTitle>
              <CardDescription>Monitor and manage freight shipments</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Shipment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Shipment</DialogTitle>
                  <DialogDescription>Add a new shipment to track</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer *</Label>
                    <Input
                      id="customer"
                      value={newShipment.customer}
                      onChange={(e) => setNewShipment({...newShipment, customer: e.target.value})}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trackingNumber">Tracking Number</Label>
                    <Input
                      id="trackingNumber"
                      value={newShipment.trackingNumber}
                      onChange={(e) => setNewShipment({...newShipment, trackingNumber: e.target.value})}
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin *</Label>
                    <Input
                      id="origin"
                      value={newShipment.origin}
                      onChange={(e) => setNewShipment({...newShipment, origin: e.target.value})}
                      placeholder="e.g., Shanghai, CN"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination *</Label>
                    <Input
                      id="destination"
                      value={newShipment.destination}
                      onChange={(e) => setNewShipment({...newShipment, destination: e.target.value})}
                      placeholder="e.g., Los Angeles, US"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vessel">Vessel</Label>
                    <Input
                      id="vessel"
                      value={newShipment.vessel}
                      onChange={(e) => setNewShipment({...newShipment, vessel: e.target.value})}
                      placeholder="Vessel name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eta">ETA</Label>
                    <Input
                      id="eta"
                      type="date"
                      value={newShipment.eta}
                      onChange={(e) => setNewShipment({...newShipment, eta: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={newShipment.weight}
                      onChange={(e) => setNewShipment({...newShipment, weight: e.target.value})}
                      placeholder="e.g., 2,500 kg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      value={newShipment.value}
                      onChange={(e) => setNewShipment({...newShipment, value: e.target.value})}
                      placeholder="e.g., $15,000"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button onClick={handleAddShipment} className="w-full">
                      Create Shipment
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="customs">Customs</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vessel</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{shipment.id}</div>
                        <div className="text-sm text-muted-foreground">{shipment.trackingNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>{shipment.customer}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {shipment.origin} → {shipment.destination}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(shipment.status)}
                        <Badge className={getStatusColor(shipment.status)} variant="secondary">
                          {shipment.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{shipment.vessel || "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {shipment.eta}
                      </div>
                    </TableCell>
                    <TableCell>{shipment.value || "—"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentTracking;