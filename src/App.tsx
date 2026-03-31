import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/hooks/useAuth";
import { I18nProvider } from "@/i18n";
import { CurrencyProvider } from "@/hooks/useCurrency";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index";

const TemplatesPage = lazy(() => import("./pages/TemplatesPage"));
const ConfigurePage = lazy(() => import("./pages/ConfigurePage"));
const OrderFlow = lazy(() => import("./pages/OrderFlow"));
const SuccessPage = lazy(() => import("./pages/SuccessPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const EventPage = lazy(() => import("./pages/EventPage"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const UnsubscribePage = lazy(() => import("./pages/UnsubscribePage"));
const AdminTools = lazy(() => import("./pages/AdminTools"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="font-display text-lg text-foreground">celebra<span className="text-primary">.at</span></span>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/configure/:templateId" element={<ConfigurePage />} />
                <Route path="/order/:templateId" element={<OrderFlow />} />
                <Route path="/success/:eventLink" element={<SuccessPage />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/unsubscribe" element={<UnsubscribePage />} />
                <Route path="/admin-tools" element={<AdminTools />} />
                <Route path="/:eventLink" element={<EventPage />} />
                <Route path="/:eventLink/:lang" element={<EventPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <CookieConsent />
        </TooltipProvider>
      </I18nProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
