import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/guards/ProtectedRoute";
import Index from "./pages/Index";
import ServicesPage from "./pages/Services";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import TrackingPage from "./pages/Tracking";
import QuotePage from "./pages/Quote";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Privacy from "./pages/Privacy";
import Feedback from "./pages/Feedback";
import Blog from "./pages/Blog";
import Loyalty from "./pages/Loyalty";
import FAQ from "./pages/FAQ";
import Analytics from "./pages/Analytics";
import LoyaltyProgram from "./pages/LoyaltyProgram";

import ComprehensiveAdminDashboard from "./pages/Admin";
import Test from "./pages/Test";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/loyalty" element={<Loyalty />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/loyalty-program" element={<LoyaltyProgram />} />
            
            {/* Protected Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredPermission="canAccessAdmin">
                  <ComprehensiveAdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/test" element={<Test />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
