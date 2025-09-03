import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Package, Truck, Plane, Ship } from "lucide-react";

const TrackingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-freight mb-4">Track Your Shipment</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get real-time updates on your shipments with our advanced tracking system
            </p>
          </div>

          {/* Tracking Form */}
          <Card className="max-w-2xl mx-auto mb-12">
            <CardHeader>
              <CardTitle>Track Shipment</CardTitle>
              <CardDescription>
                Enter your tracking number to get the latest status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter tracking number" 
                  className="flex-1"
                />
                <Button className="btn-primary">
                  <Search className="w-4 h-4 mr-2" />
                  Track
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-freight-light rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-freight" />
                </div>
                <h3 className="font-semibold mb-2">Package Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Track packages and parcels with detailed delivery information
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-freight-light rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-freight" />
                </div>
                <h3 className="font-semibold mb-2">Ground Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor ground shipments with real-time location updates
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-freight-light rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plane className="w-6 h-6 text-freight" />
                </div>
                <h3 className="font-semibold mb-2">Air Freight</h3>
                <p className="text-sm text-muted-foreground">
                  Track air shipments with flight information and ETAs
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackingPage;
