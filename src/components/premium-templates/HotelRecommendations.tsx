import { Hotel, ExternalLink } from "lucide-react";
import { useTranslation } from "@/i18n";

interface HotelItem {
  name: string;
  address?: string;
  url?: string;
  note?: string;
}

interface HotelRecommendationsProps {
  hotels: HotelItem[];
  accentColor?: string;
}

const HotelRecommendations = ({ hotels, accentColor }: HotelRecommendationsProps) => {
  const { t } = useTranslation();

  if (!hotels || hotels.length === 0) return null;

  return (
    <section className="py-16 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <Hotel className="w-6 h-6 mx-auto mb-3" style={{ color: accentColor }} />
          <h2 className="font-display text-2xl text-foreground">{t("event.hotels")}</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {hotels.map((hotel, i) => (
            <div key={i} className="border border-border rounded-lg p-4 bg-card">
              <h3 className="font-display text-base font-semibold text-foreground mb-1">{hotel.name}</h3>
              {hotel.address && (
                <p className="font-body text-sm text-muted-foreground">{hotel.address}</p>
              )}
              {hotel.note && (
                <p className="font-body text-xs text-muted-foreground mt-1 italic">{hotel.note}</p>
              )}
              {hotel.url && (
                <a
                  href={hotel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-body text-xs text-primary mt-2 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  {t("event.hotelWebsite")}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelRecommendations;
