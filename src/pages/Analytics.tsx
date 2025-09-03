import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Package, 
  MessageSquare, 
  Eye, 
  MousePointer,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";
import { useState } from "react";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in production this would come from your analytics API
  const analyticsData = {
    overview: {
      totalRevenue: 125000,
      revenueChange: 12.5,
      totalShipments: 2847,
      shipmentsChange: 8.3,
      totalCustomers: 456,
      customersChange: 15.2,
      conversionRate: 3.8,
      conversionChange: -2.1
    },
    traffic: {
      totalVisitors: 45678,
      visitorsChange: 18.7,
      pageViews: 123456,
      pageViewsChange: 22.3,
      bounceRate: 34.2,
      bounceRateChange: -5.6,
      avgSessionDuration: 245,
      sessionDurationChange: 12.8
    },
    conversions: {
      quoteRequests: 1234,
      quoteRequestsChange: 25.6,
      premiumSignups: 89,
      premiumSignupsChange: 45.2,
      contactFormSubmissions: 567,
      contactSubmissionsChange: 18.9
    },
    topPages: [
      { page: '/', views: 15420, change: 12.3 },
      { page: '/services', views: 8920, change: 8.7 },
      { page: '/quote', views: 6540, change: 25.1 },
      { page: '/tracking', views: 5430, change: 15.6 },
      { page: '/loyalty', views: 3210, change: 45.2 }
    ],
    topSources: [
      { source: 'Organic Search', visitors: 23450, change: 22.1 },
      { source: 'Direct', visitors: 12340, change: 8.9 },
      { source: 'Social Media', visitors: 5670, change: 35.6 },
      { source: 'Referral', visitors: 2340, change: 12.3 },
      { source: 'Paid Ads', visitors: 1878, change: 45.2 }
    ]
  };

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const exportReport = () => {
    // In production, this would generate and download a report
    alert('Report export functionality would be implemented here');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Analytics Dashboard
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Track your website performance, monitor conversions, and analyze customer behavior to optimize your business.
            </p>
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={refreshData}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={exportReport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </section>

        {/* Key Metrics Overview */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Key Performance Indicators
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* Revenue */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <Badge className={`${getChangeColor(analyticsData.overview.revenueChange)} bg-white`}>
                      <span className="flex items-center gap-1">
                        {getChangeIcon(analyticsData.overview.revenueChange)}
                        {analyticsData.overview.revenueChange > 0 ? '+' : ''}{analyticsData.overview.revenueChange}%
                      </span>
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(analyticsData.overview.totalRevenue)}
                  </h3>
                  <p className="text-gray-600">Total Revenue</p>
                </CardContent>
              </Card>

              {/* Shipments */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge className={`${getChangeColor(analyticsData.overview.shipmentsChange)} bg-white`}>
                      <span className="flex items-center gap-1">
                        {getChangeIcon(analyticsData.overview.shipmentsChange)}
                        {analyticsData.overview.shipmentsChange > 0 ? '+' : ''}{analyticsData.overview.shipmentsChange}%
                      </span>
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {formatNumber(analyticsData.overview.totalShipments)}
                  </h3>
                  <p className="text-gray-600">Total Shipments</p>
                </CardContent>
              </Card>

              {/* Customers */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <Badge className={`${getChangeColor(analyticsData.overview.customersChange)} bg-white`}>
                      <span className="flex items-center gap-1">
                        {getChangeIcon(analyticsData.overview.customersChange)}
                        {analyticsData.overview.customersChange > 0 ? '+' : ''}{analyticsData.overview.customersChange}%
                      </span>
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {formatNumber(analyticsData.overview.totalCustomers)}
                  </h3>
                  <p className="text-gray-600">Total Customers</p>
                </CardContent>
              </Card>

              {/* Conversion Rate */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MousePointer className="w-6 h-6 text-orange-600" />
                    </div>
                    <Badge className={`${getChangeColor(analyticsData.overview.conversionChange)} bg-white`}>
                      <span className="flex items-center gap-1">
                        {getChangeIcon(analyticsData.overview.conversionChange)}
                        {analyticsData.overview.conversionChange > 0 ? '+' : ''}{analyticsData.overview.conversionChange}%
                      </span>
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {analyticsData.overview.conversionRate}%
                  </h3>
                  <p className="text-gray-600">Conversion Rate</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Traffic and Engagement */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Traffic & Engagement
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* Total Visitors */}
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {formatNumber(analyticsData.traffic.totalVisitors)}
                  </h3>
                  <p className="text-gray-600 mb-2">Total Visitors</p>
                  <Badge className={`${getChangeColor(analyticsData.traffic.visitorsChange)} bg-white`}>
                    {analyticsData.traffic.visitorsChange > 0 ? '+' : ''}{analyticsData.traffic.visitorsChange}%
                  </Badge>
                </CardContent>
              </Card>

              {/* Page Views */}
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MousePointer className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {formatNumber(analyticsData.traffic.pageViews)}
                  </h3>
                  <p className="text-gray-600 mb-2">Page Views</p>
                  <Badge className={`${getChangeColor(analyticsData.traffic.pageViewsChange)} bg-white`}>
                    {analyticsData.traffic.pageViewsChange > 0 ? '+' : ''}{analyticsData.traffic.pageViewsChange}%
                  </Badge>
                </CardContent>
              </Card>

              {/* Bounce Rate */}
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingDown className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {analyticsData.traffic.bounceRate}%
                  </h3>
                  <p className="text-gray-600 mb-2">Bounce Rate</p>
                  <Badge className={`${getChangeColor(analyticsData.traffic.bounceRateChange)} bg-white`}>
                    {analyticsData.traffic.bounceRateChange > 0 ? '+' : ''}{analyticsData.traffic.bounceRateChange}%
                  </Badge>
                </CardContent>
              </Card>

              {/* Session Duration */}
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {Math.floor(analyticsData.traffic.avgSessionDuration / 60)}m {analyticsData.traffic.avgSessionDuration % 60}s
                  </h3>
                  <p className="text-gray-600 mb-2">Avg Session</p>
                  <Badge className={`${getChangeColor(analyticsData.traffic.sessionDurationChange)} bg-white`}>
                    {analyticsData.traffic.sessionDurationChange > 0 ? '+' : ''}{analyticsData.traffic.sessionDurationChange}%
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Conversion Metrics */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Conversion Metrics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Quote Requests */}
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {formatNumber(analyticsData.conversions.quoteRequests)}
                  </h3>
                  <p className="text-gray-600 mb-2">Quote Requests</p>
                  <Badge className={`${getChangeColor(analyticsData.conversions.quoteRequestsChange)} bg-white`}>
                    {analyticsData.conversions.quoteRequestsChange > 0 ? '+' : ''}{analyticsData.conversions.quoteRequestsChange}%
                  </Badge>
                </CardContent>
              </Card>

              {/* Premium Signups */}
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {formatNumber(analyticsData.conversions.premiumSignups)}
                  </h3>
                  <p className="text-gray-600 mb-2">Premium Signups</p>
                  <Badge className={`${getChangeColor(analyticsData.conversions.premiumSignupsChange)} bg-white`}>
                    {analyticsData.conversions.premiumSignupsChange > 0 ? '+' : ''}{analyticsData.conversions.premiumSignupsChange}%
                  </Badge>
                </CardContent>
              </Card>

              {/* Contact Submissions */}
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {formatNumber(analyticsData.conversions.contactFormSubmissions)}
                  </h3>
                  <p className="text-gray-600 mb-2">Contact Forms</p>
                  <Badge className={`${getChangeColor(analyticsData.conversions.contactSubmissionsChange)} bg-white`}>
                    {analyticsData.conversions.contactSubmissionsChange > 0 ? '+' : ''}{analyticsData.conversions.contactSubmissionsChange}%
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Top Pages and Sources */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              
              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Pages</CardTitle>
                  <CardDescription>Pages with highest traffic and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium">{page.page}</p>
                            <p className="text-sm text-gray-600">{formatNumber(page.views)} views</p>
                          </div>
                        </div>
                        <Badge className={`${getChangeColor(page.change)} bg-white`}>
                          {page.change > 0 ? '+' : ''}{page.change}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Where your visitors come from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium">{source.source}</p>
                            <p className="text-sm text-gray-600">{formatNumber(source.visitors)} visitors</p>
                          </div>
                        </div>
                        <Badge className={`${getChangeColor(source.change)} bg-white`}>
                          {source.change > 0 ? '+' : ''}{source.change}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Take Action
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-5 h-5 mr-2" />
                Download Full Report
              </Button>
              <Button variant="outline" size="lg">
                <Filter className="w-5 h-5 mr-2" />
                Customize Dashboard
              </Button>
              <Button variant="outline" size="lg">
                <TrendingUp className="w-5 h-5 mr-2" />
                Set Up Alerts
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
