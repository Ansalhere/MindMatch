
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CandidateDetails from "./pages/CandidateDetails";
import Profiles from "./pages/Profiles";
import NotFound from "./pages/NotFound";
import AuthForm from "./components/AuthForm";
import Packages from "./pages/Packages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" closeButton theme="light" className="font-sans" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<AuthForm />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/profile/:id/:type" element={<Profile />} />
          <Route path="/candidate/:id" element={<CandidateDetails />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/packages" element={<Packages />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
