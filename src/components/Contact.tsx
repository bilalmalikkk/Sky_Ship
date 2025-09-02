
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Head Office",
      details: ["123 Logistics Avenue", "Port City, PC 12345", "United States"]
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: ["+1 (555) 123-4567", "+1 (800) SKYSHIP", "24/7 Emergency Line"]
    },
    {
      icon: Mail,
      title: "Email Address",
      details: ["info@skyshiplogistics.com", "quotes@skyshiplogistics.com", "support@skyshiplogistics.com"]
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 8AM - 6PM", "Saturday: 9AM - 2PM", "24/7 Tracking Support"]
    }
  ];

  return (
    <section id="contact" className="py-20 bg-freight-light">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="section-title text-freight mb-4">
            Get Your Freight Quote Today
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to ship? Contact our logistics experts for a customized quote and 
            discover how we can optimize your supply chain.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="animate-slide-up">
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-freight">Request a Quote</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        required
                        className="border-2 border-freight-light focus:border-freight"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@company.com"
                        required
                        className="border-2 border-freight-light focus:border-freight"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Company Name
                      </label>
                      <Input 
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder="Your Company Inc."
                        className="border-2 border-freight-light focus:border-freight"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                        className="border-2 border-freight-light focus:border-freight"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Service Needed
                    </label>
                    <select 
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-freight-light rounded-md focus:border-freight focus:outline-none"
                    >
                      <option value="">Select a service</option>
                      <option value="ocean">Ocean Freight</option>
                      <option value="air">Air Freight</option>
                      <option value="land">Land Transport</option>
                      <option value="warehousing">Warehousing</option>
                      <option value="customs">Customs Clearance</option>
                      <option value="supply-chain">Supply Chain Management</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us about your shipping requirements, cargo details, origin/destination, timeline, etc."
                      rows={5}
                      required
                      className="border-2 border-freight-light focus:border-freight resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-primary py-3 text-lg font-semibold"
                  >
                    Send Quote Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8 animate-slide-up" style={{animationDelay: '0.3s'}}>
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="bg-white shadow-lg border-0 card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-ocean rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-freight mb-2">{info.title}</h3>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-muted-foreground">{detail}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Emergency Contact */}
            <Card className="bg-gradient-ocean text-white shadow-xl border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">24/7 Emergency Support</h3>
                <p className="text-white/90 mb-4">
                  Need immediate assistance with your shipment? Our emergency hotline is available around the clock.
                </p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-freight">
                  Call Emergency Line
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
