import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/i18n";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { KeyRound, Loader2 } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event which fires when user clicks the reset link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
        setHasSession(true);
        setChecking(false);
      } else if (event === "SIGNED_IN" && session) {
        // Supabase may also fire SIGNED_IN after recovery token exchange
        setHasSession(true);
        setChecking(false);
      }
    });

    // Also check if there's already a session (user may have already exchanged the token)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasSession(true);
        // Check if this came from a recovery flow by looking at URL hash
        const hash = window.location.hash;
        if (hash.includes("type=recovery") || hash.includes("type=magiclink")) {
          setSessionReady(true);
        }
      }
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t("auth.passwordMismatch"));
      return;
    }
    if (password.length < 6) {
      toast.error(t("auth.passwordTooShort") || "Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("auth.passwordUpdated"));
      navigate("/dashboard");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // No valid recovery session — show helpful message
  if (!hasSession || !sessionReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm mx-auto px-6"
        >
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7 text-muted-foreground" />
          </div>
          <h1 className="font-display text-xl font-bold text-foreground mb-2">
            {t("auth.resetPassword")}
          </h1>
          <p className="font-body text-sm text-muted-foreground mb-6">
            {t("auth.resetLinkExpired") || "Dieser Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Link an."}
          </p>
          <Button onClick={() => navigate("/")} className="font-body">
            {t("nav.home")}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm mx-auto px-6"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">{t("auth.resetPassword")}</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">
            {t("auth.enterNewPassword") || "Gib dein neues Passwort ein."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="font-body">{t("auth.newPassword")}</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="font-body mt-1" />
          </div>
          <div>
            <Label className="font-body">{t("auth.confirmPassword")}</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className="font-body mt-1" />
          </div>
          <Button type="submit" className="w-full font-body" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? t("auth.loading") : t("auth.updatePassword")}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
