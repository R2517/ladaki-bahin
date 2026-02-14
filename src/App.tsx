import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { cleanupStaleAuth } from "@/utils/authCleanup";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import RefundPolicy from "./pages/RefundPolicy";
import Contact from "./pages/Contact";
import Disclaimer from "./pages/Disclaimer";
import BandkamKamgarInfo from "./pages/BandkamKamgarInfo";
import ServicesPage from "./pages/Services";
import HowItWorksPage from "./pages/HowItWorksPage";
import BenefitsPage from "./pages/Benefits";
import FaqPage from "./pages/FaqPage";
import Dashboard from "./pages/Dashboard";
import Hamipatra from "./pages/Hamipatra";
import SelfDeclaration from "./pages/SelfDeclaration";
import Grievance from "./pages/Grievance";
import NewApplication from "./pages/NewApplication";
import CasteValidity from "./pages/CasteValidity";
import IncomeCert from "./pages/IncomeCert";
import Billing from "./pages/Billing";
import Management from "./pages/Management";
import PanCard from "./pages/PanCard";
import VoterIdCard from "./pages/VoterIdCard";
import BandkamKamgar from "./pages/BandkamKamgar";
import RajPatra from "./pages/RajPatra";
import RajpatraMarathi from "./pages/RajpatraMarathi";
import RajpatraEnglish from "./pages/RajpatraEnglish";
import RajpatraAffidavit712 from "./pages/RajpatraAffidavit712";
import FarmerIdCard from "./pages/FarmerIdCard";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVles from "./pages/admin/AdminVles";
import AdminPricing from "./pages/admin/AdminPricing";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Run cleanup once at module load — before React renders
cleanupStaleAuth();

const App = () => {
  useEffect(() => { cleanupStaleAuth(); }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/bandkam-kamgar-info" element={<BandkamKamgarInfo />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/benefits" element={<BenefitsPage />} />
            <Route path="/faq" element={<FaqPage />} />

            {/* Protected VLE routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/hamipatra" element={<ProtectedRoute><Hamipatra /></ProtectedRoute>} />
            <Route path="/self-declaration" element={<ProtectedRoute><SelfDeclaration /></ProtectedRoute>} />
            <Route path="/grievance" element={<ProtectedRoute><Grievance /></ProtectedRoute>} />
            <Route path="/new-application" element={<ProtectedRoute><NewApplication /></ProtectedRoute>} />
            <Route path="/caste-validity" element={<ProtectedRoute><CasteValidity /></ProtectedRoute>} />
            <Route path="/income-cert" element={<ProtectedRoute><IncomeCert /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
            <Route path="/management" element={<ProtectedRoute><Management /></ProtectedRoute>} />
            <Route path="/pan-card" element={<ProtectedRoute><PanCard /></ProtectedRoute>} />
            <Route path="/voter-id" element={<ProtectedRoute><VoterIdCard /></ProtectedRoute>} />
            <Route path="/bandkam-kamgar" element={<ProtectedRoute><BandkamKamgar /></ProtectedRoute>} />
            <Route path="/rajpatra" element={<ProtectedRoute><RajPatra /></ProtectedRoute>} />
            <Route path="/rajpatra-marathi" element={<ProtectedRoute><RajpatraMarathi /></ProtectedRoute>} />
            <Route path="/rajpatra-english" element={<ProtectedRoute><RajpatraEnglish /></ProtectedRoute>} />
            <Route path="/rajpatra-affidavit-712" element={<ProtectedRoute><RajpatraAffidavit712 /></ProtectedRoute>} />
            <Route path="/farmer-id-card" element={<ProtectedRoute><FarmerIdCard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/vles" element={<AdminRoute><AdminVles /></AdminRoute>} />
            <Route path="/admin/pricing" element={<AdminRoute><AdminPricing /></AdminRoute>} />
            <Route path="/admin/plans" element={<AdminRoute><AdminPlans /></AdminRoute>} />
            <Route path="/admin/transactions" element={<AdminRoute><AdminTransactions /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
