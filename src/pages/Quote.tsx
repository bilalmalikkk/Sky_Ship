import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calculator, Package, Truck, Plane, Ship, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";

const QuotePage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    merchandiseType: '',
    weight: '',
    dimensions: '',
    origin: '',
    destination: '',
    transportMode: '',
    serviceType: '',
    urgency: '',
    description: '',
    specialRequirements: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Quote request submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        merchandiseType: '',
        weight: '',
        dimensions: '',
        origin: '',
        destination: '',
        transportMode: '',
        serviceType: '',
        urgency: '',
        description: '',
        specialRequirements: ''
      });
    }, 5000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Quote Request Submitted!</h1>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for your quote request. Our team will review your requirements and get back to you within 24 hours with a detailed quote.
              </p>
              <p className="text-sm text-gray-500">
                You'll also receive a confirmation email with your request details.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-freight mb-4">Get a Shipping Quote</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get competitive pricing for your shipping needs. Fill out the form below and we'll provide you with a detailed quote.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Quote Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Quote Request Form
                  </CardTitle>
                  <CardDescription>
                    Provide shipment details to receive an accurate quote
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Merchandise Type */}
                    <div className="space-y-2">
                      <Label htmlFor="merchandiseType">Merchandise Type *</Label>
                      <Select value={formData.merchandiseType} onValueChange={(value) => handleInputChange('merchandiseType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select merchandise type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics & Technology</SelectItem>
                          <SelectItem value="clothing">Clothing & Textiles</SelectItem>
                          <SelectItem value="automotive">Automotive Parts</SelectItem>
                          <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                          <SelectItem value="food">Food & Beverages</SelectItem>
                          <SelectItem value="machinery">Machinery & Equipment</SelectItem>
                          <SelectItem value="documents">Documents & Paperwork</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Shipment Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Package Weight (kg) *</Label>
                        <Input 
                          id="weight" 
                          type="number" 
                          placeholder="0.5" 
                          value={formData.weight}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dimensions">Dimensions (L x W x H cm) *</Label>
                        <Input 
                          id="dimensions" 
                          placeholder="30 x 20 x 15" 
                          value={formData.dimensions}
                          onChange={(e) => handleInputChange('dimensions', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Transport Mode */}
                    <div className="space-y-2">
                      <Label htmlFor="transportMode">Preferred Transport Mode *</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="air"
                            name="transportMode"
                            value="air"
                            checked={formData.transportMode === 'air'}
                            onChange={(e) => handleInputChange('transportMode', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <Label htmlFor="air" className="flex items-center gap-2 cursor-pointer">
                            <Plane className="w-4 h-4" />
                            Air Freight
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="sea"
                            name="transportMode"
                            value="sea"
                            checked={formData.transportMode === 'sea'}
                            onChange={(e) => handleInputChange('transportMode', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <Label htmlFor="sea" className="flex items-center gap-2 cursor-pointer">
                            <Ship className="w-4 h-4" />
                            Sea Freight
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="land"
                            name="transportMode"
                            value="land"
                            checked={formData.transportMode === 'land'}
                            onChange={(e) => handleInputChange('transportMode', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <Label htmlFor="land" className="flex items-center gap-2 cursor-pointer">
                            <Truck className="w-4 h-4" />
                            Land Freight
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="origin">Origin City *</Label>
                        <Input 
                          id="origin" 
                          placeholder="New York" 
                          value={formData.origin}
                          onChange={(e) => handleInputChange('origin', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destination">Destination City *</Label>
                        <Input 
                          id="destination" 
                          placeholder="London" 
                          value={formData.destination}
                          onChange={(e) => handleInputChange('destination', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="service">Service Type *</Label>
                        <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="express">Express Delivery</SelectItem>
                            <SelectItem value="standard">Standard Delivery</SelectItem>
                            <SelectItem value="economy">Economy Delivery</SelectItem>
                            <SelectItem value="premium">Premium VIP Service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="urgency">Urgency *</Label>
                        <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="same-day">Same Day</SelectItem>
                            <SelectItem value="next-day">Next Day</SelectItem>
                            <SelectItem value="2-3-days">2-3 Days</SelectItem>
                            <SelectItem value="standard">Standard (5-7 days)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Package Description *</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Describe what you're shipping (e.g., Electronics, Documents, Clothing)"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialRequirements">Special Requirements</Label>
                      <Textarea 
                        id="specialRequirements" 
                        placeholder="Any special handling, temperature requirements, or additional services needed"
                        rows={2}
                        value={formData.specialRequirements}
                        onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Submit Quote Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Service Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-freight-light rounded-lg flex items-center justify-center">
                      <Plane className="w-5 h-5 text-freight" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Air Freight</h4>
                      <p className="text-sm text-muted-foreground">Fastest delivery</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-freight-light rounded-lg flex items-center justify-center">
                      <Ship className="w-5 h-5 text-freight" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Sea Freight</h4>
                      <p className="text-sm text-muted-foreground">Most economical</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-freight-light rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-freight" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Ground Transport</h4>
                      <p className="text-sm text-muted-foreground">Reliable & cost-effective</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Why Choose Us */}
              <Card>
                <CardHeader>
                  <CardTitle>Why Choose Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm">24/7 Customer Support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm">Real-time Tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Truck className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm">Global Coverage</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuotePage;
