import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Search, Play, MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: "Shipping & Delivery",
      icon: "🚚",
      questions: [
        {
          question: "How long does shipping take?",
          answer: "Shipping times vary by service type and destination. Express delivery takes 1-3 business days, Standard delivery takes 5-7 business days, and Economy delivery takes 7-14 business days. Premium customers get priority handling and faster delivery times."
        },
        {
          question: "What shipping methods do you offer?",
          answer: "We offer Air Freight (fastest), Sea Freight (most economical), and Land Freight (domestic and cross-border). Each method has different pricing and delivery times to suit your needs and budget."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to over 200 countries worldwide. Our global network ensures reliable delivery with proper customs handling and documentation for international shipments."
        },
        {
          question: "What are your shipping rates?",
          answer: "Rates depend on package weight, dimensions, destination, and service type. Use our quote calculator for instant pricing, or contact our sales team for bulk shipping discounts and premium customer rates."
        }
      ]
    },
    {
      title: "Tracking & Updates",
      icon: "📱",
      questions: [
        {
          question: "How can I track my shipment?",
          answer: "Track your shipment using the tracking number provided in your confirmation email. Premium customers get real-time GPS tracking, while basic users receive status updates at key checkpoints."
        },
        {
          question: "How often do you update tracking information?",
          answer: "Basic tracking updates every 6-12 hours. Premium customers get real-time updates with GPS location, estimated arrival times, and instant notifications for any delays or issues."
        },
        {
          question: "What if my package is delayed?",
          answer: "We proactively monitor all shipments and will notify you immediately of any delays. Premium customers get priority re-routing and dedicated support to resolve issues quickly."
        }
      ]
    },
    {
      title: "Pricing & Billing",
      icon: "💰",
      questions: [
        {
          question: "Are there hidden fees?",
          answer: "No hidden fees. Our quotes include all standard charges. Additional services like insurance, special handling, or customs clearance are clearly listed and optional."
        },
        {
          question: "Do you offer volume discounts?",
          answer: "Yes, we offer volume discounts for regular shippers. Premium and Enterprise customers get additional savings and exclusive rates on all services."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, bank transfers, and corporate accounts. Premium customers can set up monthly billing with net 30 payment terms."
        }
      ]
    },
    {
      title: "Premium Services",
      icon: "⭐",
      questions: [
        {
          question: "What are the benefits of Premium membership?",
          answer: "Premium members get priority support, real-time tracking, dedicated account managers, VIP shipping rates, advanced analytics, and exclusive access to premium services."
        },
        {
          question: "How much does Premium cost?",
          answer: "Premium plans start at $10/month or $100/year. Enterprise plans are $25/month or $250/year. All plans include a 14-day free trial."
        },
        {
          question: "Can I cancel my Premium subscription?",
          answer: "Yes, you can cancel anytime. Your premium features remain active until the end of your billing period, and you can reactivate at any time."
        }
      ]
    },
    {
      title: "Customer Support",
      icon: "🎧",
      questions: [
        {
          question: "How can I contact customer support?",
          answer: "Contact us via phone, email, live chat, or WhatsApp. Premium customers get priority support with response times under 2 hours, while standard customers get support within 24 hours."
        },
        {
          question: "What are your support hours?",
          answer: "Standard support is available 9 AM - 6 PM EST. Premium customers get 24/7 support with dedicated account managers and emergency hotlines for urgent shipments."
        },
        {
          question: "Do you offer multilingual support?",
          answer: "Yes, we offer support in English, Spanish, French, German, and Mandarin. Premium customers can request dedicated support in their preferred language."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.filter(category =>
    category.questions.some(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const contactInfo = [
    { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", link: "tel:+15551234567" },
    { icon: Mail, label: "Email", value: "support@skyship.com", link: "mailto:support@skyship.com" },
    { icon: MessageCircle, label: "Live Chat", value: "Available 24/7", link: "#" },
    { icon: MapPin, label: "Address", value: "123 Shipping Lane, NY 10001", link: "#" },
    { icon: Clock, label: "Hours", value: "9 AM - 6 PM EST", link: "#" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              How Can We Help?
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Find answers to common questions, learn about our services, and get the support you need.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {category.icon} {category.title}
                  </h2>
                  <p className="text-gray-600">
                    Common questions about {category.title.toLowerCase()}
                  </p>
                </div>
                
                <div className="max-w-4xl mx-auto">
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((item, questionIndex) => (
                      <AccordionItem 
                        key={questionIndex} 
                        value={`item-${categoryIndex}-${questionIndex}`}
                        className="border rounded-lg"
                      >
                        <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 rounded-lg">
                          <span className="font-semibold text-gray-900">{item.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Video Tutorials Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Video Tutorials
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Watch step-by-step guides to get the most out of our services
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "Getting Started with SkyShip",
                  description: "Learn the basics of creating an account and placing your first order",
                  duration: "5:32",
                  thumbnail: "bg-blue-100"
                },
                {
                  title: "Understanding Shipping Options",
                  description: "Compare different shipping methods and choose the best for your needs",
                  duration: "8:15",
                  thumbnail: "bg-green-100"
                },
                {
                  title: "Premium Features Walkthrough",
                  description: "Explore all the benefits and features available to premium members",
                  duration: "12:45",
                  thumbnail: "bg-purple-100"
                }
              ].map((video, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className={`${video.thumbnail} p-8 text-center relative`}>
                      <Play className="w-16 h-16 text-gray-600 mx-auto" />
                      <Badge className="absolute top-4 right-4 bg-black/50 text-white">
                        {video.duration}
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                      <p className="text-gray-600 text-sm">{video.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Still Need Help?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our support team is here to help. Get in touch with us through any of these channels.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {contact.label}
                      </h3>
                      <a 
                        href={contact.link}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {contact.value}
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Live Chat
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
