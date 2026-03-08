import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface BlockConfiguratorProps {
  selectedBlocks: string[];
  blockConfig: any;
  setBlockConfig: (fn: (prev: any) => any) => void;
  category: "wedding" | "birthday" | "corporate";
}

const BlockConfigurator = ({ selectedBlocks, blockConfig, setBlockConfig, category }: BlockConfiguratorProps) => {
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

  const Section = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <div className="border border-border rounded-lg p-5 space-y-4">
      <h4 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
        <span>{icon}</span> {title}
      </h4>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Story Text (wedding-story) */}
      {hasBlock("-story") && (
        <Section title="Our Story / Über uns" icon="💕">
          <Textarea
            placeholder="Eure Geschichte... Wie habt ihr euch kennengelernt?"
            value={blockConfig.story_text || ""}
            onChange={(e) => updateField("story_text", e.target.value)}
            className="font-body"
            rows={4}
          />
        </Section>
      )}

      {/* Timeline / Schedule */}
      {hasBlock("-timeline") && (
        <Section title="Tagesablauf / Timeline" icon="🕐">
          {(blockConfig.schedule || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input
                placeholder="15:00"
                value={item.time || ""}
                onChange={(e) => updateItem("schedule", i, "time", e.target.value)}
                className="font-body w-24"
              />
              <Input
                placeholder="Empfang / Zeremonie / ..."
                value={item.label || ""}
                onChange={(e) => updateItem("schedule", i, "label", e.target.value)}
                className="font-body flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removeItem("schedule", i)}>
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("schedule", { time: "", label: "" })}>
            <Plus className="w-4 h-4 mr-1" /> Zeitpunkt hinzufügen
          </Button>
        </Section>
      )}

      {/* Dresscode M/F */}
      {hasBlock("-dresscode") && (
        <Section title="Dresscode" icon="👔">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-sm">Herren</Label>
              <Input
                placeholder="z.B. Anzug / Hemd mit Sakko"
                value={blockConfig.dresscode_male || ""}
                onChange={(e) => updateField("dresscode_male", e.target.value)}
                className="font-body mt-1"
              />
            </div>
            <div>
              <Label className="font-body text-sm">Damen</Label>
              <Input
                placeholder="z.B. Cocktailkleid / Elegant"
                value={blockConfig.dresscode_female || ""}
                onChange={(e) => updateField("dresscode_female", e.target.value)}
                className="font-body mt-1"
              />
            </div>
          </div>
        </Section>
      )}

      {/* Food Menu */}
      {hasBlock("-menu") && (
        <Section title="Essensmenü" icon="🍽️">
          {(blockConfig.menu || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input
                placeholder="Gang (z.B. Vorspeise)"
                value={item.course || ""}
                onChange={(e) => updateItem("menu", i, "course", e.target.value)}
                className="font-body w-32"
              />
              <Input
                placeholder="Gericht"
                value={item.name || ""}
                onChange={(e) => updateItem("menu", i, "name", e.target.value)}
                className="font-body flex-1"
              />
              <Input
                placeholder="Beschreibung (optional)"
                value={item.description || ""}
                onChange={(e) => updateItem("menu", i, "description", e.target.value)}
                className="font-body flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removeItem("menu", i)}>
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("menu", { course: "", name: "", description: "" })}>
            <Plus className="w-4 h-4 mr-1" /> Gang hinzufügen
          </Button>
        </Section>
      )}

      {/* Hotels */}
      {hasBlock("-hotels") && (
        <Section title="Hotelempfehlungen" icon="🏨">
          {(blockConfig.hotels || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input
                placeholder="Hotelname"
                value={item.name || ""}
                onChange={(e) => updateItem("hotels", i, "name", e.target.value)}
                className="font-body flex-1"
              />
              <Input
                placeholder="Adresse"
                value={item.address || ""}
                onChange={(e) => updateItem("hotels", i, "address", e.target.value)}
                className="font-body flex-1"
              />
              <Input
                placeholder="Website-URL"
                value={item.url || ""}
                onChange={(e) => updateItem("hotels", i, "url", e.target.value)}
                className="font-body flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removeItem("hotels", i)}>
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("hotels", { name: "", address: "", url: "" })}>
            <Plus className="w-4 h-4 mr-1" /> Hotel hinzufügen
          </Button>
        </Section>
      )}

      {/* Shuttle */}
      {hasBlock("-shuttle") && (
        <Section title="Bus & Shuttle" icon="🚌">
          {(blockConfig.shuttle || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input
                placeholder="14:30"
                value={item.time || ""}
                onChange={(e) => updateItem("shuttle", i, "time", e.target.value)}
                className="font-body w-20"
              />
              <Input
                placeholder="Von"
                value={item.from || ""}
                onChange={(e) => updateItem("shuttle", i, "from", e.target.value)}
                className="font-body flex-1"
              />
              <Input
                placeholder="Nach"
                value={item.to || ""}
                onChange={(e) => updateItem("shuttle", i, "to", e.target.value)}
                className="font-body flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removeItem("shuttle", i)}>
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("shuttle", { time: "", from: "", to: "" })}>
            <Plus className="w-4 h-4 mr-1" /> Route hinzufügen
          </Button>
        </Section>
      )}

      {/* Wishlist */}
      {hasBlock("-wishlist") && (
        <Section title="Wunschliste / Geschenke" icon="🎁">
          {(blockConfig.wishlist || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input
                placeholder="Wunsch (z.B. Reisegutschein)"
                value={item.name || ""}
                onChange={(e) => updateItem("wishlist", i, "name", e.target.value)}
                className="font-body flex-1"
              />
              <Input
                placeholder="Link (optional)"
                value={item.url || ""}
                onChange={(e) => updateItem("wishlist", i, "url", e.target.value)}
                className="font-body flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removeItem("wishlist", i)}>
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("wishlist", { name: "", url: "", note: "" })}>
            <Plus className="w-4 h-4 mr-1" /> Wunsch hinzufügen
          </Button>
        </Section>
      )}

      {/* Potluck */}
      {hasBlock("-potluck") && (
        <Section title="Mitbringliste" icon="🧺">
          {(blockConfig.potluck || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input
                placeholder="z.B. Kartoffelsalat, Brownies..."
                value={item.name || ""}
                onChange={(e) => updateItem("potluck", i, "name", e.target.value)}
                className="font-body flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removeItem("potluck", i)}>
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("potluck", { name: "" })}>
            <Plus className="w-4 h-4 mr-1" /> Item hinzufügen
          </Button>
        </Section>
      )}

      {/* Quiz */}
      {hasBlock("-quiz") && (
        <Section title="Quiz über das Geburtstagskind" icon="❓">
          {(blockConfig.quiz || []).map((q: any, i: number) => (
            <div key={i} className="bg-secondary/50 rounded-lg p-3 space-y-2">
              <div className="flex gap-2 items-center">
                <span className="font-body text-xs text-muted-foreground font-semibold">Frage {i + 1}</span>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => removeItem("quiz", i)}>
                  <Trash2 className="w-3 h-3 text-muted-foreground" />
                </Button>
              </div>
              <Input
                placeholder="Frage..."
                value={q.question || ""}
                onChange={(e) => updateItem("quiz", i, "question", e.target.value)}
                className="font-body"
              />
              <div className="grid grid-cols-2 gap-2">
                {(q.options || ["", "", "", ""]).map((opt: string, oi: number) => (
                  <div key={oi} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`quiz-correct-${i}`}
                      checked={(q.correctIndex || 0) === oi}
                      onChange={() => updateItem("quiz", i, "correctIndex", oi)}
                      className="w-3 h-3"
                    />
                    <Input
                      placeholder={`Option ${oi + 1}`}
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
            <Plus className="w-4 h-4 mr-1" /> Frage hinzufügen
          </Button>
        </Section>
      )}

      {/* Games */}
      {hasBlock("-games") && (
        <Section title="Spiele zur Abstimmung" icon="🎮">
          {(blockConfig.games || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input
                placeholder="z.B. Beer Pong 🍺"
                value={item.name || ""}
                onChange={(e) => updateItem("games", i, "name", e.target.value)}
                className="font-body flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removeItem("games", i)}>
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("games", { name: "", votes: 0 })}>
            <Plus className="w-4 h-4 mr-1" /> Spiel hinzufügen
          </Button>
        </Section>
      )}

      {/* Agenda (corporate) */}
      {hasBlock("-agenda") && (
        <Section title="Agenda" icon="📋">
          {(blockConfig.agenda || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start flex-wrap">
              <Input
                placeholder="09:00 – 10:00"
                value={item.time || ""}
                onChange={(e) => updateItem("agenda", i, "time", e.target.value)}
                className="font-body w-32"
              />
              <Input
                placeholder="Titel"
                value={item.title || ""}
                onChange={(e) => updateItem("agenda", i, "title", e.target.value)}
                className="font-body flex-1"
              />
              <Input
                placeholder="Speaker (optional)"
                value={item.speaker || ""}
                onChange={(e) => updateItem("agenda", i, "speaker", e.target.value)}
                className="font-body w-40"
              />
              <Button variant="ghost" size="sm" onClick={() => removeItem("agenda", i)}>
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("agenda", { time: "", title: "", speaker: "" })}>
            <Plus className="w-4 h-4 mr-1" /> Programmpunkt hinzufügen
          </Button>
        </Section>
      )}

      {/* Sponsors (corporate) */}
      {hasBlock("-sponsors") && (
        <Section title="Sponsoren" icon="🤝">
          {(blockConfig.sponsors || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input
                placeholder="Firmenname"
                value={item.name || ""}
                onChange={(e) => updateItem("sponsors", i, "name", e.target.value)}
                className="font-body flex-1"
              />
              <Input
                placeholder="Website-URL"
                value={item.url || ""}
                onChange={(e) => updateItem("sponsors", i, "url", e.target.value)}
                className="font-body flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removeItem("sponsors", i)}>
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("sponsors", { name: "", url: "" })}>
            <Plus className="w-4 h-4 mr-1" /> Sponsor hinzufügen
          </Button>
        </Section>
      )}

      {/* Products (corporate) */}
      {hasBlock("-products") && (
        <Section title="Produkte" icon="📦">
          {(blockConfig.products || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2 items-start">
              <Input
                placeholder="Produktname"
                value={item.name || ""}
                onChange={(e) => updateItem("products", i, "name", e.target.value)}
                className="font-body flex-1"
              />
              <Input
                placeholder="Beschreibung"
                value={item.description || ""}
                onChange={(e) => updateItem("products", i, "description", e.target.value)}
                className="font-body flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removeItem("products", i)}>
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="font-body" onClick={() => addItem("products", { name: "", description: "" })}>
            <Plus className="w-4 h-4 mr-1" /> Produkt hinzufügen
          </Button>
        </Section>
      )}
    </div>
  );
};

export default BlockConfigurator;
