import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected VLE routes */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
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
  </QueryClientProvider>
);

export default App;
