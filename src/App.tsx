import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/hooks/useAuth";
import { I18nProvider } from "@/i18n";
import Index from "./pages/Index";
import TemplatesPage from "./pages/TemplatesPage";
import ConfigurePage from "./pages/ConfigurePage";
import SuccessPage from "./pages/SuccessPage";
import AdminDashboard from "./pages/AdminDashboard";
import EventPage from "./pages/EventPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/configure/:templateId" element={<ConfigurePage />} />
              <Route path="/success/:eventLink" element={<SuccessPage />} />
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/:eventLink" element={<EventPage />} />
              <Route path="/:eventLink/:lang" element={<EventPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </I18nProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
