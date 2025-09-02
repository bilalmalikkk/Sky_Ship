
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship, Plane, Truck, Package, Globe, Clock } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Ship,
      title: "Ocean Freight",
      description: "Cost-effective sea shipping solutions for large volume cargo with full container and LCL options.",
      features: ["FCL & LCL Options", "Door-to-Door Service", "Customs Clearance"]
    },
    {
      icon: Plane,
      title: "Air Freight", 
      description: "Fast and reliable air cargo services for time-sensitive shipments worldwide.",
      features: ["Express Delivery", "Temperature Control", "Dangerous Goods"]
    },
    {
      icon: Truck,
      title: "Land Transport",
      description: "Comprehensive ground transportation covering trucking, rail, and intermodal services.",
      features: ["Cross-Border", "Last Mile Delivery", "Warehousing"]
    },
    {
      icon: Package,
      title: "Warehousing",
      description: "Modern storage facilities with inventory management and distribution services.",
      features: ["Climate Control", "Security Systems", "Inventory Tracking"]
    },
    {
      icon: Globe,
      title: "Customs Clearance",
      description: "Expert customs brokerage services to ensure smooth import/export processes.",
      features: ["Document Prep", "Duty Calculation", "Compliance Check"]
    },
    {
      icon: Clock,
      title: "Supply Chain",
      description: "End-to-end supply chain management with real-time visibility and optimization.",
      features: ["Route Planning", "Cost Analysis", "Risk Management"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-freight-light">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="section-title text-freight mb-4">
            Comprehensive Freight Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From air to sea, we provide complete logistics solutions tailored to your business needs. 
            Our global network ensures your cargo reaches its destination safely and on time.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className="card-hover bg-white border-0 shadow-lg group animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-ocean rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-freight">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto animate-slide-up">
            <h3 className="text-2xl font-bold text-freight mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our logistics experts are ready to design a freight solution that fits your unique requirements.
            </p>
            <button className="btn-primary px-8 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Contact Our Experts
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
