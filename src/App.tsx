import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/hooks/useAuth";
import { I18nProvider } from "@/i18n";
import Index from "./pages/Index";

const TemplatesPage = lazy(() => import("./pages/TemplatesPage"));
const ConfigurePage = lazy(() => import("./pages/ConfigurePage"));
const OrderFlow = lazy(() => import("./pages/OrderFlow"));
const SuccessPage = lazy(() => import("./pages/SuccessPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const EventPage = lazy(() => import("./pages/EventPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/configure/:templateId" element={<ConfigurePage />} />
                <Route path="/order/:templateId" element={<OrderFlow />} />
                <Route path="/success/:eventLink" element={<SuccessPage />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/:eventLink" element={<EventPage />} />
                <Route path="/:eventLink/:lang" element={<EventPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </I18nProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
