import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { useTranslation } from "@/i18n";

interface BlockConfiguratorProps {
  selectedBlocks: string[];
  blockConfig: any;
  setBlockConfig: (fn: (prev: any) => any) => void;
  category: "wedding" | "birthday" | "corporate";
}

const Section = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
  <div className="border border-border rounded-lg p-5 space-y-4">
    <h4 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
      <span>{icon}</span> {title}
    </h4>
    {children}
  </div>
);

const ImageUploadButton = ({ value, onChange, onRemove, label }: { value?: string; onChange: (base64: string) => void; onRemove: () => void; label: string }) => {
  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => onChange(ev.target?.result as string);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  if (value) {
    return (
      <div className="relative w-16 h-16 rounded-md overflow-hidden border border-border">
        <img src={value} alt="" className="w-full h-full object-cover" />
        <button type="button" className="absolute top-0 right-0 bg-background/80 rounded-bl p-0.5" onClick={onRemove}>
          <X className="w-3 h-3 text-foreground" />
        </button>
      </div>
    );
  }

  return (
    <Button type="button" variant="outline" size="sm" className="font-body h-16 w-16 flex-col gap-1" onClick={handleClick}>
      <Upload className="w-4 h-4 text-muted-foreground" />
      <span className="text-[9px] text-muted-foreground">Logo</span>
    </Button>
  );
};

const BlockConfigurator = ({ selectedBlocks, blockConfig, setBlockConfig, category }: BlockConfiguratorProps) => {
  const { t } = useTranslation();
  const hasBlock = (suffix: string) => selectedBlocks.some(id => id.endsWith(suffix));

  const updateField = (key: string, value: any) =>
    setBlockConfig((prev: any) => ({ ...prev, [key]: value }));

  const addItem = (key: string, template: any) =>
    setBlockConfig((prev: any) => ({ ...prev, [key]: [...(prev[key] || []), template] }));

  const removeItem = (key: string, index: number) =>
    setBlockConfig((prev: any) => ({ ...prev, [key]: (prev[key] || []).filter((_: any, i: number) => i !== index) }));

  const updateItem = (key: string, index: number, field: string, value: any) =>
    setBlockConfig((prev: any) => {
      const arr = [...(prev[key] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [key]: arr };
    });

  const handleProductImageUpload = (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;
      const currentImages = blockConfig.products?.[index]?.images || [];
      Array.from(files).forEach(file => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const newImg = ev.target?.result as string;
            setBlockConfig((prev: any) => {
              const arr = [...(prev.products || [])];
              arr[index] = { ...arr[index], images: [...(arr[index].images || []), newImg] };
              return { ...prev, products: arr };
            });
          };
          reader.readAsDataURL(file);
        }
      });
    };
    input.click();
  };

  const removeProductImage = (productIndex: number, imageIndex: number) => {
    setBlockConfig((prev: any) => {
      const arr = [...(prev.products || [])];
      arr[productIndex] = { ...arr[productIndex], images: (arr[productIndex].images || []).filter((_: any, i: number) => i !== imageIndex) };
      return { ...prev, products: arr };
    });
  };

  return (
    <div className="space-y-6">
      {hasBlock("-story") && (
        <Section title={t("blockConfig.story")} icon="💕">
          <Textarea
            placeholder={t("blockConfig.storyPlaceholder")}
            value={blockConfig.story_text || ""}
            onChange={(e) => updateField("story_text", e.target.value)}
            className="font-body"
            rows={4}
          />
        </Section>
      )}

      {hasBlock("-timeline") && (
        <Section title={t("blockConfig.timeline")} icon="🕐">
          {(blockConfig.schedule || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input placeholder="15:00" value={item.time || ""} onChange={(e) => updateItem("schedule", i, "time", e.target.value)} className="font-body w-24" />
              <Input placeholder={t("blockConfig.timelinePlaceholder")} value={item.label || ""} onChange={(e) => updateItem("schedule", i, "label", e.target.value)} className="font-body flex-1" />
              <Button variant="ghost" size="sm" onClick={() => removeItem("schedule", i)}><Trash2 className="w-4 h-4 text-muted-foreground" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("schedule", { time: "", label: "" })}>
            <Plus className="w-4 h-4 mr-1" /> {t("blockConfig.addTime")}
          </Button>
        </Section>
      )}

      {hasBlock("-dresscode") && (
        <Section title={t("blockConfig.dresscode")} icon="👔">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-sm">{t("blockConfig.men")}</Label>
              <Input placeholder={t("blockConfig.menPlaceholder")} value={blockConfig.dresscode_male || ""} onChange={(e) => updateField("dresscode_male", e.target.value)} className="font-body mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm">{t("blockConfig.women")}</Label>
              <Input placeholder={t("blockConfig.womenPlaceholder")} value={blockConfig.dresscode_female || ""} onChange={(e) => updateField("dresscode_female", e.target.value)} className="font-body mt-1" />
            </div>
          </div>
        </Section>
      )}

      {hasBlock("-menu") && (
        <Section title={t("blockConfig.menu")} icon="🍽️">
          {(blockConfig.menu || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input placeholder={t("blockConfig.coursePlaceholder")} value={item.course || ""} onChange={(e) => updateItem("menu", i, "course", e.target.value)} className="font-body w-32" />
              <Input placeholder={t("blockConfig.dishPlaceholder")} value={item.name || ""} onChange={(e) => updateItem("menu", i, "name", e.target.value)} className="font-body flex-1" />
              <Input placeholder={t("blockConfig.descriptionPlaceholder")} value={item.description || ""} onChange={(e) => updateItem("menu", i, "description", e.target.value)} className="font-body flex-1" />
              <Button variant="ghost" size="sm" onClick={() => removeItem("menu", i)}><Trash2 className="w-4 h-4 text-muted-foreground" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("menu", { course: "", name: "", description: "" })}>
            <Plus className="w-4 h-4 mr-1" /> {t("blockConfig.addCourse")}
          </Button>
        </Section>
      )}

      {hasBlock("-hotels") && (
        <Section title={t("blockConfig.hotels")} icon="🏨">
          {(blockConfig.hotels || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input placeholder={t("blockConfig.hotelNamePlaceholder")} value={item.name || ""} onChange={(e) => updateItem("hotels", i, "name", e.target.value)} className="font-body flex-1" />
              <Input placeholder={t("blockConfig.addressPlaceholder")} value={item.address || ""} onChange={(e) => updateItem("hotels", i, "address", e.target.value)} className="font-body flex-1" />
              <Input placeholder={t("blockConfig.websitePlaceholder")} value={item.url || ""} onChange={(e) => updateItem("hotels", i, "url", e.target.value)} className="font-body flex-1" />
              <Button variant="ghost" size="sm" onClick={() => removeItem("hotels", i)}><Trash2 className="w-4 h-4 text-muted-foreground" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("hotels", { name: "", address: "", url: "" })}>
            <Plus className="w-4 h-4 mr-1" /> {t("blockConfig.addHotel")}
          </Button>
        </Section>
      )}

      {hasBlock("-shuttle") && (
        <Section title={t("blockConfig.shuttle")} icon="🚌">
          {(blockConfig.shuttle || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input placeholder="14:30" value={item.time || ""} onChange={(e) => updateItem("shuttle", i, "time", e.target.value)} className="font-body w-20" />
              <Input placeholder={t("blockConfig.fromPlaceholder")} value={item.from || ""} onChange={(e) => updateItem("shuttle", i, "from", e.target.value)} className="font-body flex-1" />
              <Input placeholder={t("blockConfig.toPlaceholder")} value={item.to || ""} onChange={(e) => updateItem("shuttle", i, "to", e.target.value)} className="font-body flex-1" />
              <Button variant="ghost" size="sm" onClick={() => removeItem("shuttle", i)}><Trash2 className="w-4 h-4 text-muted-foreground" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("shuttle", { time: "", from: "", to: "" })}>
            <Plus className="w-4 h-4 mr-1" /> {t("blockConfig.addRoute")}
          </Button>
        </Section>
      )}

      {hasBlock("-wishlist") && (
        <Section title={t("blockConfig.wishlist")} icon="🎁">
          {(blockConfig.wishlist || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input placeholder={t("blockConfig.wishPlaceholder")} value={item.name || ""} onChange={(e) => updateItem("wishlist", i, "name", e.target.value)} className="font-body flex-1" />
              <Input placeholder={t("blockConfig.linkPlaceholder")} value={item.url || ""} onChange={(e) => updateItem("wishlist", i, "url", e.target.value)} className="font-body flex-1" />
              <Button variant="ghost" size="sm" onClick={() => removeItem("wishlist", i)}><Trash2 className="w-4 h-4 text-muted-foreground" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("wishlist", { name: "", url: "", note: "" })}>
            <Plus className="w-4 h-4 mr-1" /> {t("blockConfig.addWish")}
          </Button>
        </Section>
      )}

      {hasBlock("-potluck") && (
        <Section title={t("blockConfig.potluck")} icon="🧺">
          {(blockConfig.potluck || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input placeholder={t("blockConfig.potluckPlaceholder")} value={item.name || ""} onChange={(e) => updateItem("potluck", i, "name", e.target.value)} className="font-body flex-1" />
              <Button variant="ghost" size="sm" onClick={() => removeItem("potluck", i)}><Trash2 className="w-4 h-4 text-muted-foreground" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("potluck", { name: "" })}>
            <Plus className="w-4 h-4 mr-1" /> {t("blockConfig.addItem")}
          </Button>
        </Section>
      )}

      {hasBlock("-quiz") && (
        <Section title={t("blockConfig.quiz")} icon="❓">
          {(blockConfig.quiz || []).map((q: any, i: number) => (
            <div key={i} className="bg-secondary/50 rounded-lg p-3 space-y-2">
              <div className="flex gap-2 items-center">
                <span className="font-body text-xs text-muted-foreground font-semibold">{t("blockConfig.question")} {i + 1}</span>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => removeItem("quiz", i)}>
                  <Trash2 className="w-3 h-3 text-muted-foreground" />
                </Button>
              </div>
              <Input placeholder={t("blockConfig.questionPlaceholder")} value={q.question || ""} onChange={(e) => updateItem("quiz", i, "question", e.target.value)} className="font-body" />
              <div className="grid grid-cols-2 gap-2">
                {(q.options || ["", "", "", ""]).map((opt: string, oi: number) => (
                  <div key={oi} className="flex items-center gap-1">
                    <input type="radio" name={`quiz-correct-${i}`} checked={(q.correctIndex || 0) === oi} onChange={() => updateItem("quiz", i, "correctIndex", oi)} className="w-3 h-3" />
                    <Input
                      placeholder={`${t("blockConfig.option")} ${oi + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const opts = [...(q.options || ["", "", "", ""])];
                        opts[oi] = e.target.value;
                        updateItem("quiz", i, "options", opts);
                      }}
                      className="font-body text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("quiz", { question: "", options: ["", "", "", ""], correctIndex: 0 })}>
            <Plus className="w-4 h-4 mr-1" /> {t("blockConfig.addQuestion")}
          </Button>
        </Section>
      )}

      {hasBlock("-games") && (
        <Section title={t("blockConfig.games")} icon="🎮">
          {(blockConfig.games || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input placeholder={t("blockConfig.gamePlaceholder")} value={item.name || ""} onChange={(e) => updateItem("games", i, "name", e.target.value)} className="font-body flex-1" />
              <Button variant="ghost" size="sm" onClick={() => removeItem("games", i)}><Trash2 className="w-4 h-4 text-muted-foreground" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("games", { name: "", votes: 0 })}>
            <Plus className="w-4 h-4 mr-1" /> {t("blockConfig.addGame")}
          </Button>
        </Section>
      )}

      {hasBlock("-agenda") && (
        <Section title={t("blockConfig.agenda")} icon="📋">
          {(blockConfig.agenda || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start flex-wrap">
              <Input placeholder="09:00 – 10:00" value={item.time || ""} onChange={(e) => updateItem("agenda", i, "time", e.target.value)} className="font-body w-32" />
              <Input placeholder={t("blockConfig.titlePlaceholder")} value={item.title || ""} onChange={(e) => updateItem("agenda", i, "title", e.target.value)} className="font-body flex-1" />
              <Input placeholder={t("blockConfig.speakerPlaceholder")} value={item.speaker || ""} onChange={(e) => updateItem("agenda", i, "speaker", e.target.value)} className="font-body w-40" />
              <Button variant="ghost" size="sm" onClick={() => removeItem("agenda", i)}><Trash2 className="w-4 h-4 text-muted-foreground" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("agenda", { time: "", title: "", speaker: "" })}>
            <Plus className="w-4 h-4 mr-1" /> {t("blockConfig.addAgendaItem")}
          </Button>
        </Section>
      )}

      {hasBlock("-sponsors") && (
        <Section title={t("blockConfig.sponsors")} icon="🤝">
          {(blockConfig.sponsors || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-center">
              <ImageUploadButton
                value={item.logoUrl}
                onChange={(base64) => updateItem("sponsors", i, "logoUrl", base64)}
                onRemove={() => updateItem("sponsors", i, "logoUrl", "")}
                label="Logo"
              />
              <div className="flex-1 flex gap-2">
                <Input placeholder={t("blockConfig.companyPlaceholder")} value={item.name || ""} onChange={(e) => updateItem("sponsors", i, "name", e.target.value)} className="font-body flex-1" />
                <Input placeholder={t("blockConfig.websitePlaceholder")} value={item.url || ""} onChange={(e) => updateItem("sponsors", i, "url", e.target.value)} className="font-body flex-1" />
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeItem("sponsors", i)}><Trash2 className="w-4 h-4 text-muted-foreground" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("sponsors", { name: "", url: "", logoUrl: "" })}>
            <Plus className="w-4 h-4 mr-1" /> {t("blockConfig.addSponsor")}
          </Button>
        </Section>
      )}

      {hasBlock("-products") && (
        <Section title={t("blockConfig.products")} icon="📦">
          {(blockConfig.products || []).map((item: any, i: number) => (
            <div key={i} className="border border-border/50 rounded-lg p-3 space-y-3">
              <div className="flex gap-2 items-start">
                <Input placeholder={t("blockConfig.productNamePlaceholder")} value={item.name || ""} onChange={(e) => updateItem("products", i, "name", e.target.value)} className="font-body flex-1" />
                <Button variant="ghost" size="sm" onClick={() => removeItem("products", i)}><Trash2 className="w-4 h-4 text-muted-foreground" /></Button>
              </div>
              <Textarea
                placeholder={t("blockConfig.productDescPlaceholder")}
                value={item.description || ""}
                onChange={(e) => updateItem("products", i, "description", e.target.value)}
                className="font-body"
                rows={2}
              />
              {/* Product images */}
              <div>
                <Label className="font-body text-xs text-muted-foreground">{t("blockConfig.productImages")}</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(item.images || []).map((img: string, imgIdx: number) => (
                    <div key={imgIdx} className="relative w-16 h-16 rounded-md overflow-hidden border border-border">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button type="button" className="absolute top-0 right-0 bg-background/80 rounded-bl p-0.5" onClick={() => removeProductImage(i, imgIdx)}>
                        <X className="w-3 h-3 text-foreground" />
                      </button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="font-body h-16 w-16 flex-col gap-1" onClick={() => handleProductImageUpload(i)}>
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[9px] text-muted-foreground">{t("blockConfig.addPhoto")}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("products", { name: "", description: "", images: [] })}>
            <Plus className="w-4 h-4 mr-1" /> {t("blockConfig.addProduct")}
          </Button>
        </Section>
      )}
    </div>
  );
};

export default BlockConfigurator;
