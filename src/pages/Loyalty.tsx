import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Zap, Shield, Headphones, BarChart3, Clock } from "lucide-react";
import { useState } from "react";

const Loyalty = () => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from your auth context

  const plans = [
    {
      name: "Basic",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for occasional shipping needs",
      features: [
        "Basic shipment tracking",
        "Standard customer support",
        "Email notifications",
        "Basic reporting"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: { monthly: 10, yearly: 100 },
      description: "Ideal for regular shippers",
      features: [
        "Real-time tracking",
        "Priority customer support",
        "Advanced notifications",
        "Detailed analytics",
        "VIP shipping rates",
        "Dedicated account manager"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: { monthly: 25, yearly: 250 },
      description: "For high-volume businesses",
      features: [
        "All Premium features",
        "Custom integrations",
        "White-label solutions",
        "24/7 phone support",
        "Custom reporting",
        "API access",
        "Volume discounts"
      ],
      popular: false
    }
  ];

  const premiumFeatures = [
    {
      icon: Zap,
      title: "Priority Support",
      description: "Get help within 2 hours instead of 24 hours"
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Live updates on your shipments with GPS location"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Detailed performance reports and insights"
    },
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Advanced encryption and fraud protection"
    },
    {
      icon: Headphones,
      title: "Dedicated Manager",
      description: "Personal account manager for VIP customers"
    },
    {
      icon: Crown,
      title: "Exclusive Rates",
      description: "Special pricing on premium services"
    }
  ];

  const handleSubscribe = (planName: string) => {
    if (!isLoggedIn) {
      // Redirect to login/signup
      window.location.href = '/signup';
      return;
    }
    
    // Handle subscription logic
    console.log(`Subscribing to ${planName} plan`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Unlock Premium Benefits
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of businesses that trust SkyShip Premium for their shipping needs. 
              Get exclusive access to advanced features, priority support, and VIP rates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-white/90 text-lg px-8 py-6"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Plans
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Premium Features */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Premium?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the difference with our premium features designed to streamline your shipping operations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {premiumFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section id="pricing" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Plan
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Flexible plans that grow with your business
              </p>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={`text-sm ${selectedPlan === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setSelectedPlan(selectedPlan === 'monthly' ? 'yearly' : 'monthly')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    selectedPlan === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      selectedPlan === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm ${selectedPlan === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Yearly
                  <Badge className="ml-2 bg-green-100 text-green-800">Save 17%</Badge>
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">
                        ${plan.price[selectedPlan]}
                      </span>
                      {plan.price[selectedPlan] > 0 && (
                        <span className="text-gray-500 ml-2">
                          /{selectedPlan === 'monthly' ? 'month' : 'year'}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                      onClick={() => handleSubscribe(plan.name)}
                    >
                      {plan.price[selectedPlan] === 0 ? 'Get Started' : 'Subscribe Now'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I cancel my subscription anytime?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your current billing period.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-gray-600">
                    We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely through Stripe.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Is there a free trial available?
                  </h3>
                  <p className="text-gray-600">
                    Yes! We offer a 14-day free trial for all premium plans. No credit card required to start your trial.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust SkyShip Premium for their shipping needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-white/90 text-lg px-8 py-6"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Loyalty;
