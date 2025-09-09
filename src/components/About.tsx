
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, MapPin, TrendingUp } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Award, number: "25+", label: "Years Experience" },
    { icon: Users, number: "500+", label: "Happy Clients" },
    { icon: MapPin, number: "50+", label: "Countries Served" },
    { icon: TrendingUp, number: "99.8%", label: "On-Time Delivery" }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            <div>
              <h2 className="section-title text-freight mb-6">
                Meet the Founder
                <span className="text-gradient block">and Skyship's Mission</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Skyship was founded by <span className="font-semibold text-foreground">Ousmane Mboup</span>, CEO and Founder, in Dakar, Senegal. 
                  We exist to make shipping simple, transparent, and reliable for businesses and individuals across Africa and beyond.
                </p>
                <p>
                  From Dakar to the world, our mission is to bridge distances, remove friction, and provide 
                  dependable logistics solutions that help our customers grow with confidence.
                </p>
                <p>
                  Grounded in local expertise and supported by a global partner network, Skyship delivers 
                  end-to-end freight services with clear communication, fair pricing, and on-time delivery.
                </p>
              </div>
            </div>

            {/* Mission & Values */}
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="bg-freight-light border-0 p-6">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-freight mb-3">Our Mission</h3>
                  <p className="text-muted-foreground">
                    Empower commerce across Africa and beyond by delivering trustworthy, transparent shipping from Dakar to the world.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-freight-light border-0 p-6">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-freight mb-3">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To be the world's most trusted freight forwarding partner, driving global commerce forward.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="space-y-8 animate-slide-up" style={{animationDelay: '0.3s'}}>
            {/* Company Image Placeholder */}
            <div className="relative bg-gradient-ocean rounded-2xl p-8 text-white overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent rounded-full blur-xl"></div>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Why Choose SkyShip?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Advanced tracking technology</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Dedicated account management</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Competitive pricing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="text-center p-6 card-hover bg-white border-2 border-freight-light">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-gradient-ocean rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-freight mb-1">{stat.number}</div>
                      <div className="text-muted-foreground font-medium">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
