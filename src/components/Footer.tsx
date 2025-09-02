
import { Ship, MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      "Ocean Freight",
      "Air Freight", 
      "Land Transport",
      "Warehousing",
      "Customs Clearance",
      "Supply Chain"
    ],
    company: [
      "About Us",
      "Our Team",
      "Careers",
      "News & Updates",
      "Sustainability",
      "Partnerships"
    ],
    support: [
      "Track Shipment",
      "Customer Portal",
      "Documentation",
      "Help Center",
      "Contact Support",
      "Emergency Line"
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ];

  return (
    <footer className="bg-freight text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SkyShip Logistics</h1>
                <p className="text-sm text-white/80">Global Freight Solutions</p>
              </div>
            </div>
            
            <p className="text-white/90 leading-relaxed">
              Your trusted partner for worldwide freight forwarding solutions. 
              Connecting businesses across continents with reliable, efficient logistics services.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-sm text-white/90">123 Logistics Ave, Port City, PC 12345</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-sm text-white/90">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-sm text-white/90">info@skyshiplogistics.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-colors duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Our Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/80 hover:text-accent transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/80 hover:text-accent transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/80 hover:text-accent transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="font-semibold mb-3">Stay Updated</h4>
              <p className="text-sm text-white/80 mb-4">
                Get the latest shipping news and industry insights.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-accent"
                />
                <button className="px-4 py-2 bg-accent hover:bg-accent/90 rounded-lg font-medium transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/80 text-sm">
              © {currentYear} SkyShip Logistics. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/80 hover:text-accent text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-white/80 hover:text-accent text-sm transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-white/80 hover:text-accent text-sm transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
