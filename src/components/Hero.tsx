
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Clock, Shield, MessageCircle } from "lucide-react";

const Hero = () => {
  const features = [
    { icon: Globe, text: "Global Network" },
    { icon: Clock, text: "24/7 Tracking" },
    { icon: Shield, text: "Secure Transport" }
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = "221704802645"; // WhatsApp number without + and spaces
    const message = "Hi! I'm interested in your freight services. Can you help me get a quote?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8 animate-slide-up">
            <div className="space-y-4">
              <h1 className="hero-text leading-tight">
                Your Trusted
                <span className="text-accent block">Freight Partner</span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                Connecting businesses worldwide with reliable, efficient, and secure freight forwarding solutions. 
                From sea to sky, we deliver your cargo with precision and care.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-3 text-white/90">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6 group shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Request a Quote Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  className="bg-white text-freight hover:bg-white/90 text-lg px-8 py-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Track Shipment
                </Button>
              </div>
              
              {/* WhatsApp Quick Contact Button */}
              <Button 
                onClick={handleWhatsAppClick}
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat on WhatsApp
              </Button>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="relative w-full max-w-lg mx-auto">
              {/* Ship Container */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="space-y-6">
                  {/* Mock Dashboard */}
                  <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white/90 text-sm font-medium">Live Tracking</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-accent rounded-full"></div>
                      </div>
                      <p className="text-white/80 text-sm">Shanghai → Los Angeles</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm text-center">
                      <div className="text-2xl font-bold text-white mb-1">15K+</div>
                      <div className="text-white/80 text-sm">Shipments</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm text-center">
                      <div className="text-2xl font-bold text-white mb-1">99.8%</div>
                      <div className="text-white/80 text-sm">On Time</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent rounded-full flex items-center justify-center animate-float">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full flex items-center justify-center animate-float" style={{animationDelay: '2s'}}>
                <Shield className="w-6 h-6 text-freight" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
