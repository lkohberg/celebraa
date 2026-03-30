import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useTranslation } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Pencil, Trash2, Ticket } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { toast } from "sonner";

interface PromoCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses: number | null;
  current_uses: number;
  active: boolean;
  expires_at: string | null;
  created_at: string;
  created_by: string;
}

const PromoForm = ({ promo, onSave, onCancel }: { promo?: PromoCode; onSave: (data: any) => void; onCancel: () => void }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState(promo?.code || "");
  const [discountType, setDiscountType] = useState(promo?.discount_type || "percentage");
  const [discountValue, setDiscountValue] = useState(promo?.discount_value?.toString() || "");
  const [maxUses, setMaxUses] = useState(promo?.max_uses?.toString() || "");
  const [active, setActive] = useState(promo?.active ?? true);
  const [expiresAt, setExpiresAt] = useState(promo?.expires_at ? promo.expires_at.slice(0, 10) : "");

  const handleSubmit = () => {
    if (!code.trim() || !discountValue) {
      toast.error(t("promo.fillRequired"));
      return;
    }
    const val = parseFloat(discountValue);
    if (discountType === "percentage" && (val <= 0 || val > 100)) {
      toast.error(t("promo.percentRange"));
      return;
    }
    onSave({
      code: code.trim().toUpperCase(),
      discount_type: discountType,
      discount_value: val,
      max_uses: maxUses ? parseInt(maxUses) : null,
      active,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="font-body">{t("promo.code")} *</Label>
        <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="SUMMER50" className="font-body mt-1 uppercase" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="font-body">{t("promo.discountType")}</Label>
          <Select value={discountType} onValueChange={setDiscountType}>
            <SelectTrigger className="font-body mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">{t("promo.percentage")}</SelectItem>
              <SelectItem value="fixed">{t("promo.fixedAmount")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="font-body">{t("promo.value")} *</Label>
          <Input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder={discountType === "percentage" ? "50" : "10"} className="font-body mt-1" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="font-body">{t("promo.maxUses")}</Label>
          <Input type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder={t("promo.unlimited")} className="font-body mt-1" />
        </div>
        <div>
          <Label className="font-body">{t("promo.expiresAt")}</Label>
          <Input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="font-body mt-1" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label className="font-body">{t("promo.active")}</Label>
        <Switch checked={active} onCheckedChange={setActive} />
      </div>
      <div className="flex gap-2 pt-2">
        <Button onClick={handleSubmit} className="font-body flex-1">{promo ? t("promo.save") : t("promo.create")}</Button>
        <Button variant="outline" onClick={onCancel} className="font-body">{t("promo.cancel")}</Button>
      </div>
    </div>
  );
};

const AdminTools = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { t } = useTranslation();
  const { data: isAdminReady, isLoading: adminLoading } = useIsAdmin();
  const isAdmin = !!isAdminReady;
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);

  const { data: promoCodes, isLoading } = useQuery({
    queryKey: ["promo-codes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PromoCode[];
    },
    enabled: isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("promo_codes").insert({ ...data, created_by: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
      setCreateOpen(false);
      toast.success(t("promo.created"));
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase.from("promo_codes").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
      setEditingPromo(null);
      toast.success(t("promo.updated"));
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promo_codes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
      toast.success(t("promo.deleted"));
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (!authLoading && (!user || (!adminLoading && !isAdmin))) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-muted-foreground mb-4">{t("admin.loginRequired")}</p>
          <Button onClick={() => navigate("/")} className="font-body">{t("admin.backHome")}</Button>
        </div>
      </div>
    );
  }

  if (authLoading || adminLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">{t("dashboard.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 sm:mr-1" /><span className="hidden sm:inline">{t("nav.dashboard")}</span>
            </Button>
            <span className="font-display text-lg font-bold text-foreground">celebra<span className="text-primary">.at</span></span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Button variant="outline" size="sm" onClick={signOut} className="font-body">{t("nav.logout")}</Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">{t("adminTools.title")}</h1>
        </div>

        {/* Promo Codes Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" />
              {t("promo.title")}
            </CardTitle>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="font-body gap-1"><Plus className="w-4 h-4" /> {t("promo.new")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle className="font-display">{t("promo.createTitle")}</DialogTitle></DialogHeader>
                <PromoForm onSave={(data) => createMutation.mutate(data)} onCancel={() => setCreateOpen(false)} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {!promoCodes?.length ? (
              <p className="font-body text-muted-foreground text-center py-8">{t("promo.empty")}</p>
            ) : (
              <div className="space-y-3">
                {promoCodes.map((promo) => (
                  <div key={promo.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <code className="font-mono font-bold text-foreground bg-secondary px-3 py-1 rounded">{promo.code}</code>
                      <Badge variant={promo.active ? "default" : "outline"} className={promo.active ? "" : "text-muted-foreground"}>
                        {promo.active ? t("promo.active") : t("promo.inactive")}
                      </Badge>
                      <span className="font-body text-sm text-muted-foreground">
                        {promo.discount_type === "percentage" ? `${promo.discount_value}%` : `€${promo.discount_value}`} {t("promo.off")}
                      </span>
                      <span className="font-body text-xs text-muted-foreground">
                        {t("promo.uses")}: {promo.current_uses}{promo.max_uses ? `/${promo.max_uses}` : ""}
                      </span>
                      {promo.expires_at && (
                        <span className="font-body text-xs text-muted-foreground">
                          {t("promo.expires")}: {new Date(promo.expires_at).toLocaleDateString("de-AT")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog open={editingPromo?.id === promo.id} onOpenChange={(open) => !open && setEditingPromo(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setEditingPromo(promo)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle className="font-display">{t("promo.editTitle")}</DialogTitle></DialogHeader>
                          <PromoForm
                            promo={promo}
                            onSave={(data) => updateMutation.mutate({ id: promo.id, ...data })}
                            onCancel={() => setEditingPromo(null)}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => {
                        if (confirm(t("promo.confirmDelete"))) deleteMutation.mutate(promo.id);
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTools;
