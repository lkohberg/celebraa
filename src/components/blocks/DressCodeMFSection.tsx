import { Shirt } from "lucide-react";

interface DressCodeMF {
  male: string;
  female: string;
}

const DressCodeMFSection = ({ dressCode, accentColor }: { dressCode?: DressCodeMF; accentColor?: string }) => {
  const male = dressCode?.male || "Anzug / Hemd mit Sakko";
  const female = dressCode?.female || "Cocktailkleid / Elegantes Kleid";
  const color = accentColor || "hsl(38, 65%, 50%)";

  return (
    <section className="py-16 bg-background">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <Shirt className="w-6 h-6 mx-auto mb-3" style={{ color }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Dresscode</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <span className="text-3xl mb-3 block">🤵</span>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">Herren</h3>
            <p className="font-body text-sm text-muted-foreground">{male}</p>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <span className="text-3xl mb-3 block">👗</span>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">Damen</h3>
            <p className="font-body text-sm text-muted-foreground">{female}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DressCodeMFSection;
