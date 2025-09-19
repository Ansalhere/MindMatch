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
import Packages from "./pages/Packages";
import PostJob from "./pages/PostJob";
import AddSkill from "./pages/AddSkill";
import RankingExplanationPage from "./pages/RankingExplanation";
import Jobs from "./pages/Jobs";
import Companies from "./pages/Companies";
import CompanyProfile from "./pages/CompanyProfile";
import Skills from "./pages/Skills";
import SkillAssessmentPage from "./pages/SkillAssessmentPage";
import Community from "./pages/Community";
import Rankings from "./pages/Rankings";
import Career from "./pages/Career";
import SuccessStories from "./pages/SuccessStories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Job from "./pages/Job";
import Admin from "./pages/Admin";
import SuperAdmin from "./pages/SuperAdmin";
import AdminLogin from "./pages/AdminLogin";
import EmployerLogin from "./pages/EmployerLogin";
import EditProfile from "./pages/EditProfile";
import LoginSelector from "./components/navigation/LoginSelector";
import AdminSetup from "./components/AdminSetup";
import { AuthProvider } from "./hooks/useUser";

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
          <Route path="/auth-selector" element={<LoginSelector />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/employer-login" element={<EmployerLogin />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/profile/:id/:type" element={<Profile />} />
          <Route path="/candidate/:id" element={<CandidateDetails />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/add-skill" element={<AddSkill />} />
          <Route path="/ranking-explanation" element={<RankingExplanationPage />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:id" element={<Job />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/company/:id" element={<CompanyProfile />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/skill-assessment/:categoryId" element={<SkillAssessmentPage />} />
          <Route path="/community" element={<Community />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/resources" element={<Career />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
          <Route path="/super-admin" element={<SuperAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;