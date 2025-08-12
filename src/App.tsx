
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { SecurityHeaders } from "@/components/ui/security-headers";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CandidateDetails from "./pages/CandidateDetails";
import Profiles from "./pages/Profiles";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <SecurityHeaders />
        <Toaster />
        <Sonner position="top-center" closeButton theme="light" className="font-sans" duration={4000} />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:id/:type" element={<Profile />} />
          <Route path="/candidate/:id" element={<CandidateDetails />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/add-skill" element={<AddSkill />} />
          <Route path="/ranking-explanation" element={<RankingExplanationPage />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:id" element={<Job />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/resources" element={<Career />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/super-admin" element={<SuperAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
