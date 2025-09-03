import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Trash2, Download, Mail, Phone, Calendar } from "lucide-react";
import { useState } from "react";

const Privacy = () => {
  const [showConsentForm, setShowConsentForm] = useState(false);
  const [consentPreferences, setConsentPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  const handleConsentSubmit = () => {
    // Here you would typically save consent preferences to your backend
    localStorage.setItem('cookieConsent', JSON.stringify(consentPreferences));
    setShowConsentForm(false);
    // Show success message
    alert('Thank you! Your privacy preferences have been saved.');
  };

  const requestDataDeletion = () => {
    // Here you would implement the right to erasure functionality
    const email = prompt('Please enter your email address to request data deletion:');
    if (email) {
      // Send deletion request to backend
      console.log('Data deletion requested for:', email);
      alert('Your data deletion request has been submitted. We will process it within 30 days as required by law.');
    }
  };

  const downloadUserData = () => {
    // Here you would implement data export functionality
    const email = prompt('Please enter your email address to download your data:');
    if (email) {
      // Generate and send data export
      console.log('Data export requested for:', email);
      alert('Your data export has been generated and will be sent to your email address.');
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Privacy Policy & Data Protection
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              We are committed to protecting your privacy and ensuring compliance with data protection laws worldwide.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge className="bg-white/20 text-white px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                GDPR Compliant
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                CCPA Compliant
              </Badge>
              <Badge className="bg-white/20 text-white px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                ISO 27001 Certified
              </Badge>
            </div>
          </div>
        </section>

        {/* Cookie Consent Banner */}
        {!localStorage.getItem('cookieConsent') && (
          <section className="bg-yellow-50 border-b border-yellow-200 py-4">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-yellow-600" />
                  <p className="text-yellow-800">
                    We use cookies to enhance your experience. By continuing to use this site, you consent to our use of cookies.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowConsentForm(true)}
                  >
                    Customize
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      localStorage.setItem('cookieConsent', JSON.stringify({ necessary: true, analytics: true, marketing: true, preferences: true }));
                      setShowConsentForm(false);
                    }}
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Cookie Consent Modal */}
        {showConsentForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Cookie Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We use cookies to provide you with the best possible experience. You can customize your preferences below.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Necessary Cookies</h4>
                      <p className="text-sm text-gray-600">Required for basic site functionality</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={consentPreferences.necessary}
                      disabled
                      className="w-4 h-4 text-blue-600"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Analytics Cookies</h4>
                      <p className="text-sm text-gray-600">Help us understand how visitors use our site</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={consentPreferences.analytics}
                      onChange={(e) => setConsentPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="w-4 h-4 text-blue-600"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Marketing Cookies</h4>
                      <p className="text-sm text-gray-600">Used for personalized advertising</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={consentPreferences.marketing}
                      onChange={(e) => setConsentPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="w-4 h-4 text-blue-600"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Preference Cookies</h4>
                      <p className="text-sm text-gray-600">Remember your settings and preferences</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={consentPreferences.preferences}
                      onChange={(e) => setConsentPreferences(prev => ({ ...prev, preferences: e.target.checked }))}
                      className="w-4 h-4 text-blue-600"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowConsentForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConsentSubmit}
                    className="flex-1"
                  >
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Privacy Policy Content */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              
              {/* Data Collection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    We collect information you provide directly to us, such as when you create an account, request a quote, or contact our support team.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Personal identification information (name, email address, phone number)</li>
                    <li>Business information (company name, industry, shipping requirements)</li>
                    <li>Shipment details and tracking information</li>
                    <li>Communication history and support interactions</li>
                    <li>Website usage data and analytics</li>
                  </ul>
                </CardContent>
              </Card>

              {/* How We Use Data */}
              <Card>
                <CardHeader>
                  <CardTitle>How We Use Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    We use the information we collect to provide, maintain, and improve our services:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Process your shipping requests and provide quotes</li>
                    <li>Track shipments and provide real-time updates</li>
                    <li>Communicate with you about your account and services</li>
                    <li>Improve our website and customer experience</li>
                    <li>Comply with legal obligations and prevent fraud</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Data Sharing */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Sharing and Disclosure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>With your explicit consent</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights and prevent fraud</li>
                    <li>With service providers who assist in our operations</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Data Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Data Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    We implement appropriate technical and organizational security measures to protect your personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication measures</li>
                    <li>Employee training on data protection</li>
                    <li>Incident response and breach notification procedures</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Your Rights */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Rights and Choices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Depending on your location, you may have the following rights regarding your personal information:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Access and Portability</h4>
                      <p className="text-sm text-gray-600">Request access to your data and receive it in a portable format</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={downloadUserData}
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download My Data
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Right to Erasure</h4>
                      <p className="text-sm text-gray-600">Request deletion of your personal data</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={requestDataDeletion}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Request Deletion
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Data Protection Officer</h4>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        privacy@skyship.com
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        +1 (555) 123-4567
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Address</h4>
                      <p className="text-gray-600">
                        SkyShip Logistics<br />
                        123 Shipping Lane<br />
                        New York, NY 10001<br />
                        United States
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Policy Updates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Policy Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                  </p>
                  <p className="text-gray-600">
                    <strong>Last Updated:</strong> January 15, 2024
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
