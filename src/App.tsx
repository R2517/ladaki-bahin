import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Hamipatra from "./pages/Hamipatra";
import SelfDeclaration from "./pages/SelfDeclaration";
import Grievance from "./pages/Grievance";
import NewApplication from "./pages/NewApplication";
import CasteValidity from "./pages/CasteValidity";
import IncomeCert from "./pages/IncomeCert";
import Billing from "./pages/Billing";
import Management from "./pages/Management";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hamipatra" element={<Hamipatra />} />
          <Route path="/self-declaration" element={<SelfDeclaration />} />
          <Route path="/grievance" element={<Grievance />} />
          <Route path="/new-application" element={<NewApplication />} />
          <Route path="/caste-validity" element={<CasteValidity />} />
          <Route path="/income-cert" element={<IncomeCert />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/management" element={<Management />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
