import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Search, Filter, Package } from 'lucide-react';

const ShipmentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with real API calls
  const shipments = [
    {
      id: 1,
      trackingNumber: 'TRK001',
      customerName: 'ABC Company',
      origin: 'New York, NY',
      destination: 'Los Angeles, CA',
      status: 'in-transit',
      weight: '25.5 kg',
      estimatedDelivery: '2025-09-05',
      createdAt: '2025-09-01'
    },
    {
      id: 2,
      trackingNumber: 'TRK002',
      customerName: 'XYZ Corp',
      origin: 'Chicago, IL',
      destination: 'Miami, FL',
      status: 'delivered',
      weight: '15.2 kg',
      estimatedDelivery: '2025-09-03',
      createdAt: '2025-08-30'
    }
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shipment Management</h2>
          <p className="text-gray-600">Track and manage all shipments</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Shipment</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Shipments</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by tracking number or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Status Filter</Label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipments List */}
      <Card>
        <CardHeader>
          <CardTitle>Shipments ({filteredShipments.length})</CardTitle>
          <CardDescription>Manage and track all shipments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tracking #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Route</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Weight</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Est. Delivery</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{shipment.trackingNumber}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{shipment.customerName}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="font-medium">{shipment.origin}</div>
                        <div className="text-gray-500">→</div>
                        <div className="font-medium">{shipment.destination}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusBadgeColor(shipment.status)}>
                        {shipment.status.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{shipment.weight}</td>
                    <td className="py-3 px-4">{shipment.estimatedDelivery}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentManagement;
