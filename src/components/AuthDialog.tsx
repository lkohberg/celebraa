import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fn = mode === "login" ? signIn : signUp;
    const { error } = await fn(email, password);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(mode === "login" ? "Erfolgreich angemeldet!" : "Registrierung erfolgreich! Bitte bestätige deine E-Mail.");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {mode === "login" ? "Anmelden" : "Registrieren"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="font-body">E-Mail</Label>
            <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required className="font-body mt-1" placeholder="E-Mail oder Benutzername" />
          </div>
          <div>
            <Label className="font-body">Passwort</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="font-body mt-1" />
          </div>
          <Button type="submit" className="w-full font-body" disabled={loading}>
            {loading ? "Wird geladen..." : mode === "login" ? "Anmelden" : "Registrieren"}
          </Button>
          <p className="text-center text-sm text-muted-foreground font-body">
            {mode === "login" ? "Noch kein Konto?" : "Bereits registriert?"}{" "}
            <button type="button" className="text-primary underline" onClick={() => setMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Registrieren" : "Anmelden"}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
