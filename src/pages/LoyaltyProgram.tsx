import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, 
  Star, 
  Trophy, 
  Crown, 
  Zap, 
  Shield, 
  Users, 
  Package,
  TrendingUp,
  Award,
  Target,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

const LoyaltyProgram = () => {
  const [userPoints, setUserPoints] = useState(1250);
  const [userTier, setUserTier] = useState('silver');

  const loyaltyTiers = [
    {
      name: 'Bronze',
      icon: '🥉',
      minPoints: 0,
      maxPoints: 999,
      color: 'bg-amber-100 text-amber-800',
      benefits: [
        'Basic shipping discounts',
        'Email support',
        'Standard tracking',
        'Monthly newsletter'
      ]
    },
    {
      name: 'Silver',
      icon: '🥈',
      minPoints: 1000,
      maxPoints: 2499,
      color: 'bg-gray-100 text-gray-800',
      benefits: [
        '5% shipping discount',
        'Priority email support',
        'Enhanced tracking',
        'Exclusive promotions',
        'Birthday rewards'
      ]
    },
    {
      name: 'Gold',
      icon: '🥇',
      minPoints: 2500,
      maxPoints: 4999,
      color: 'bg-yellow-100 text-yellow-800',
      benefits: [
        '10% shipping discount',
        'Phone support',
        'Real-time tracking',
        'VIP promotions',
        'Free insurance upgrade',
        'Dedicated account manager'
      ]
    },
    {
      name: 'Platinum',
      icon: '💎',
      minPoints: 5000,
      maxPoints: 9999,
      color: 'bg-blue-100 text-blue-800',
      benefits: [
        '15% shipping discount',
        '24/7 priority support',
        'GPS tracking',
        'Exclusive VIP events',
        'Custom shipping solutions',
        'Personal logistics consultant'
      ]
    },
    {
      name: 'Diamond',
      icon: '👑',
      minPoints: 10000,
      maxPoints: Infinity,
      color: 'bg-purple-100 text-purple-800',
      benefits: [
        '20% shipping discount',
        'Concierge service',
        'White-glove delivery',
        'Private jet charter options',
        'Board-level support',
        'Custom loyalty program'
      ]
    }
  ];

  const currentTier = loyaltyTiers.find(tier => 
    userPoints >= tier.minPoints && userPoints <= tier.maxPoints
  ) || loyaltyTiers[0];

  const nextTier = loyaltyTiers.find(tier => tier.minPoints > userPoints);
  const pointsToNextTier = nextTier ? nextTier.minPoints - userPoints : 0;
  const progressToNextTier = nextTier ? 
    ((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100 : 100;

  const waysToEarnPoints = [
    {
      action: 'Ship a package',
      points: 100,
      description: 'Earn points for every shipment',
      icon: Package
    },
    {
      action: 'Refer a friend',
      points: 500,
      description: 'Get points when they sign up',
      icon: Users
    },
    {
      action: 'Leave a review',
      points: 50,
      description: 'Share your experience',
      icon: Star
    },
    {
      action: 'Premium subscription',
      points: 1000,
      description: 'Monthly bonus for premium members',
      icon: Crown
    },
    {
      action: 'Social media share',
      points: 25,
      description: 'Share our content',
      icon: TrendingUp
    },
    {
      action: 'Birthday bonus',
      points: 200,
      description: 'Annual birthday reward',
      icon: Gift
    }
  ];

  const availableRewards = [
    {
      name: 'Free Shipping',
      points: 500,
      description: 'Get free shipping on your next order',
      icon: Package,
      available: userPoints >= 500
    },
    {
      name: 'Insurance Upgrade',
      points: 300,
      description: 'Upgrade to premium insurance coverage',
      icon: Shield,
      available: userPoints >= 300
    },
    {
      name: 'Priority Support',
      points: 200,
      description: 'Skip the queue with priority support',
      icon: Zap,
      available: userPoints >= 200
    },
    {
      name: 'Custom Packaging',
      points: 400,
      description: 'Get custom branded packaging',
      icon: Gift,
      available: userPoints >= 400
    },
    {
      name: 'VIP Event Access',
      points: 1000,
      description: 'Access to exclusive VIP events',
      icon: Trophy,
      available: userPoints >= 1000
    },
    {
      name: 'Dedicated Manager',
      points: 2000,
      description: 'Personal account manager for 1 month',
      icon: Users,
      available: userPoints >= 2000
    }
  ];

  const redeemReward = (reward: any) => {
    if (userPoints >= reward.points) {
      setUserPoints(prev => prev - reward.points);
      alert(`Congratulations! You've redeemed ${reward.name}. Your points have been deducted.`);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              SkyShip Loyalty Program
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Earn points with every shipment, unlock exclusive benefits, and enjoy VIP treatment as you climb the loyalty ladder.
            </p>
            
            {/* Current Status */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-6xl">{currentTier.icon}</span>
                <div className="text-left">
                  <h2 className="text-3xl font-bold">{currentTier.name} Member</h2>
                  <p className="text-white/80">Current Tier</p>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold mb-2">{userPoints.toLocaleString()}</div>
                <p className="text-white/80">Total Points</p>
              </div>
              
              {nextTier && (
                <div className="text-center">
                  <p className="text-white/80 mb-2">
                    {pointsToNextTier} points to {nextTier.name}
                  </p>
                  <Progress value={progressToNextTier} className="w-full h-3" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How to Earn Points */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How to Earn Points
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                There are many ways to earn points and climb the loyalty ladder. Start earning today!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {waysToEarnPoints.map((way, index) => {
                const Icon = way.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {way.action}
                      </h3>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        +{way.points}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {way.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Loyalty Tiers */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Loyalty Tiers & Benefits
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Unlock more benefits and exclusive perks as you earn more points
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {loyaltyTiers.map((tier, index) => (
                <Card 
                  key={index} 
                  className={`relative ${
                    tier.name === currentTier.name 
                      ? 'ring-2 ring-blue-500 scale-105' 
                      : ''
                  }`}
                >
                  {tier.name === currentTier.name && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                      Current Tier
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="text-4xl mb-2">{tier.icon}</div>
                    <CardTitle className={tier.color}>
                      {tier.name}
                    </CardTitle>
                    <CardDescription>
                      {tier.minPoints.toLocaleString()} - {tier.maxPoints === Infinity ? '∞' : tier.maxPoints.toLocaleString()} points
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {tier.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Available Rewards */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Redeem Your Points
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Use your hard-earned points to unlock exclusive rewards and services
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {availableRewards.map((reward, index) => {
                const Icon = reward.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {reward.name}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        {reward.description}
                      </p>
                      
                      <div className="text-2xl font-bold text-purple-600 mb-4">
                        {reward.points} points
                      </div>
                      
                      <Button 
                        onClick={() => redeemReward(reward)}
                        disabled={!reward.available}
                        className={`w-full ${
                          reward.available 
                            ? 'bg-purple-600 hover:bg-purple-700' 
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {reward.available ? 'Redeem Now' : 'Not Enough Points'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Special Offers */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              Special Member Offers
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Welcome Bonus</h3>
                <p className="text-white/80 mb-4">
                  New members get 500 bonus points on their first shipment
                </p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Get Started
                </Button>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Double Points Week</h3>
                <p className="text-white/80 mb-4">
                  Earn double points on all shipments this week
                </p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Learn More
                </Button>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Referral Program</h3>
                <p className="text-white/80 mb-4">
                  Refer friends and earn 500 points for each successful referral
                </p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Refer Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who are already earning points and enjoying exclusive benefits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Shipping Now
              </Button>
              <Button variant="outline" size="lg">
                View Full Benefits
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LoyaltyProgram;
