import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, MailCheck, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const { signIn, signUp } = useAuth();
  const { t } = useTranslation();
  const [mode, setMode] = useState<"choose" | "login" | "register" | "forgot" | "verify">("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetAndClose = (newOpen: boolean) => {
    if (!newOpen) {
      setMode("choose");
      setEmail("");
      setPassword("");
      setShowPassword(false);
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "forgot") {
      const resetEmail = email.includes("@") ? email : `${email}@celebra.at`;
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t("auth.resetSent"));
        setMode("login");
      }
      return;
    }

    const loginEmail = email.includes("@") ? email : `${email}@celebra.at`;

    if (mode === "register") {
      const { error } = await signUp(loginEmail, password);
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        // Send welcome email (fire-and-forget)
        supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "welcome",
            recipientEmail: loginEmail,
            idempotencyKey: `welcome-${loginEmail}`,
          },
        }).catch(() => {});
        setMode("verify");
      }
      return;
    }

    const { error } = await signIn(loginEmail, password);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("auth.loginSuccess"));
      resetAndClose(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {mode === "choose"
              ? t("auth.welcome")
              : mode === "verify"
              ? t("auth.verifyTitle")
              : mode === "forgot"
              ? t("auth.resetPassword")
              : mode === "login"
              ? t("auth.login")
              : t("auth.register")}
          </DialogTitle>
        </DialogHeader>

        {mode === "choose" ? (
          <div className="space-y-4 py-2">
            <p className="font-body text-sm text-muted-foreground">{t("auth.chooseMethod")}</p>
            <Button className="w-full font-body gap-2 py-5" onClick={() => setMode("login")}>
              <LogIn className="w-4 h-4" /> {t("auth.login")}
            </Button>
            <Button variant="outline" className="w-full font-body gap-2 py-5" onClick={() => setMode("register")}>
              <UserPlus className="w-4 h-4" /> {t("auth.register")}
            </Button>
          </div>
        ) : mode === "verify" ? (
          <div className="space-y-4 text-center py-4">
            <MailCheck className="w-12 h-12 text-primary mx-auto" />
            <p className="font-body text-sm text-muted-foreground">
              {t("auth.verifyDesc")}
            </p>
            <Button variant="outline" className="font-body" onClick={() => setMode("login")}>
              {t("auth.backToLogin")}
            </Button>
          </div>
        ) : mode === "forgot" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="font-body text-sm text-muted-foreground">{t("auth.resetPasswordDesc")}</p>
            <div>
              <Label className="font-body">{t("auth.email")}</Label>
              <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required className="font-body mt-1" placeholder={t("auth.emailPlaceholder")} />
            </div>
            <Button type="submit" className="w-full font-body" disabled={loading}>
              {loading ? t("auth.loading") : t("auth.sendResetLink")}
            </Button>
            <button type="button" className="flex items-center gap-1 text-sm text-primary font-body mx-auto" onClick={() => setMode("login")}>
              <ArrowLeft className="w-3 h-3" /> {t("auth.backToLogin")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="font-body">{t("auth.email")}</Label>
              <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required className="font-body mt-1" placeholder={t("auth.emailPlaceholder")} />
            </div>
            <div>
              <Label className="font-body">{t("auth.password")}</Label>
              <div className="relative mt-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="font-body pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {mode === "login" && (
              <button type="button" className="text-xs text-primary underline font-body" onClick={() => setMode("forgot")}>
                {t("auth.forgotPassword")}
              </button>
            )}
            <Button type="submit" className="w-full font-body" disabled={loading}>
              {loading ? t("auth.loading") : mode === "login" ? t("auth.login") : t("auth.register")}
            </Button>
            <p className="text-center text-sm text-muted-foreground font-body">
              {mode === "login" ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
              <button type="button" className="text-primary underline" onClick={() => setMode(mode === "login" ? "register" : "login")}>
                {mode === "login" ? t("auth.register") : t("auth.login")}
              </button>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
