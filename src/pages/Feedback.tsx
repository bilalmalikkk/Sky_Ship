import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Send,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Package,
  Clock
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Feedback {
  id: string;
  customerName: string;
  email: string;
  category: string;
  rating: number;
  comment: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  response?: string;
  respondedAt?: Date;
}

const Feedback = () => {
  const [activeTab, setActiveTab] = useState("submit");
  const [feedback, setFeedback] = useState({
    customerName: "",
    email: "",
    category: "",
    rating: 0,
    comment: "",
    trackingNumber: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [allFeedback, setAllFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    document.title = "Customer Feedback - SkyShip Logistics";
    
    // Load existing feedback from localStorage
    const savedFeedback = JSON.parse(localStorage.getItem("customerFeedback") || "[]");
    setAllFeedback(savedFeedback);
  }, []);

  const handleRatingChange = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (feedback.rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    const newFeedback: Feedback = {
      id: Date.now().toString(),
      customerName: feedback.customerName,
      email: feedback.email,
      category: feedback.category,
      rating: feedback.rating,
      comment: feedback.comment,
      status: 'pending',
      createdAt: new Date()
    };

    const updatedFeedback = [newFeedback, ...allFeedback];
    setAllFeedback(updatedFeedback);
    localStorage.setItem("customerFeedback", JSON.stringify(updatedFeedback));
    
    setSubmitted(true);
    setFeedback({
      customerName: "",
      email: "",
      category: "",
      rating: 0,
      comment: "",
      trackingNumber: ""
    });
  };

  const handleResponse = (feedbackId: string, response: string) => {
    const updatedFeedback = allFeedback.map(f => 
      f.id === feedbackId 
        ? { ...f, response, status: 'resolved' as const, respondedAt: new Date() }
        : f
    );
    setAllFeedback(updatedFeedback);
    localStorage.setItem("customerFeedback", JSON.stringify(updatedFeedback));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'reviewed': return <Badge variant="outline">Reviewed</Badge>;
      case 'resolved': return <Badge variant="default">Resolved</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const averageRating = allFeedback.length > 0 
    ? (allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length).toFixed(1)
    : "0.0";

  const totalFeedback = allFeedback.length;
  const pendingFeedback = allFeedback.filter(f => f.status === 'pending').length;
  const resolvedFeedback = allFeedback.filter(f => f.status === 'resolved').length;

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 pb-32">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Customer Feedback & Reviews
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your feedback helps us improve our services. Share your experience and help us serve you better.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{averageRating}</div>
                <div className="flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${star <= Math.round(Number(averageRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{totalFeedback}</div>
                <p className="text-sm text-gray-600">Total Reviews</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {submitted && (
            <Alert className="border-green-200 bg-green-50 mb-6">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Thank you for your feedback! We've received your submission and will review it shortly.
              </AlertDescription>
            </Alert>
          )}

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
              <TabsTrigger value="reviews">View Reviews</TabsTrigger>
              <TabsTrigger value="dashboard">Feedback Dashboard</TabsTrigger>
            </TabsList>

            {/* Submit Feedback Tab */}
            <TabsContent value="submit" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Share Your Experience
                  </CardTitle>
                  <CardDescription>
                    Tell us about your experience with our services. Your feedback is valuable to us.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customerName">Full Name *</Label>
                        <Input
                          id="customerName"
                          value={feedback.customerName}
                          onChange={(e) => setFeedback(prev => ({ ...prev, customerName: e.target.value }))}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={feedback.email}
                          onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
                          required
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Service Category *</Label>
                        <Select 
                          value={feedback.category} 
                          onValueChange={(value) => setFeedback(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ocean-freight">Ocean Freight</SelectItem>
                            <SelectItem value="air-freight">Air Freight</SelectItem>
                            <SelectItem value="land-transport">Land Transport</SelectItem>
                            <SelectItem value="warehousing">Warehousing</SelectItem>
                            <SelectItem value="customs-clearance">Customs Clearance</SelectItem>
                            <SelectItem value="customer-service">Customer Service</SelectItem>
                            <SelectItem value="website-experience">Website Experience</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="trackingNumber">Tracking Number (Optional)</Label>
                        <Input
                          id="trackingNumber"
                          value={feedback.trackingNumber}
                          onChange={(e) => setFeedback(prev => ({ ...prev, trackingNumber: e.target.value }))}
                          placeholder="Enter tracking number if applicable"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Overall Rating *</Label>
                      <div className="flex items-center gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            className="focus:outline-none"
                          >
                            <Star 
                              className={`w-8 h-8 transition-colors ${
                                star <= feedback.rating 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300 hover:text-yellow-300'
                              }`} 
                            />
                          </button>
                        ))}
                        <span className="ml-3 text-sm text-gray-600">
                          {feedback.rating > 0 && (
                            <span className={getRatingColor(feedback.rating)}>
                              {feedback.rating === 1 && "Poor"}
                              {feedback.rating === 2 && "Fair"}
                              {feedback.rating === 3 && "Good"}
                              {feedback.rating === 4 && "Very Good"}
                              {feedback.rating === 5 && "Excellent"}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="comment">Additional Comments</Label>
                      <Textarea
                        id="comment"
                        value={feedback.comment}
                        onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Share your detailed experience, suggestions, or concerns..."
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* View Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5" />
                    Customer Reviews
                  </CardTitle>
                  <CardDescription>
                    See what other customers are saying about our services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {allFeedback.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No reviews yet</p>
                      <p className="text-sm">Be the first to share your experience!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {allFeedback.map((item) => (
                        <div key={item.id} className="border rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{item.customerName}</h3>
                              <p className="text-sm text-gray-500">{item.email}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`w-4 h-4 ${
                                      star <= item.rating 
                                        ? 'fill-yellow-400 text-yellow-400' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                              {getStatusBadge(item.status)}
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <Badge variant="outline" className="mb-2">
                              {item.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                            {item.trackingNumber && (
                              <Badge variant="secondary" className="ml-2">
                                #{item.trackingNumber}
                              </Badge>
                            )}
                          </div>

                          <p className="text-gray-700 mb-4">{item.comment}</p>

                          {item.response && (
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                              <p className="text-sm font-medium text-blue-800 mb-1">Our Response:</p>
                              <p className="text-sm text-blue-700">{item.response}</p>
                              <p className="text-xs text-blue-600 mt-2">
                                Responded on {new Date(item.respondedAt!).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Feedback Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Feedback Analytics
                  </CardTitle>
                  <CardDescription>
                    Overview of customer feedback and satisfaction metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{totalFeedback}</div>
                      <p className="text-sm text-gray-600">Total Reviews</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{averageRating}</div>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{pendingFeedback}</div>
                      <p className="text-sm text-gray-600">Pending Review</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{resolvedFeedback}</div>
                      <p className="text-sm text-gray-600">Resolved</p>
                    </div>
                  </div>

                  {/* Rating Distribution */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = allFeedback.filter(f => f.rating === rating).length;
                        const percentage = totalFeedback > 0 ? (count / totalFeedback) * 100 : 0;
                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-16">
                              <span className="text-sm font-medium">{rating}</span>
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-12 text-right">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Analysis */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Feedback by Category</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(
                        allFeedback.reduce((acc, f) => {
                          acc[f.category] = (acc[f.category] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium">
                            {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <Badge variant="outline">{count} reviews</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Feedback;
