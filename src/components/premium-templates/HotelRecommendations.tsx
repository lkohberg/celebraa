import { Hotel, ExternalLink, MapPin } from "lucide-react";
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
    <section className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-4">
          <Hotel className="w-7 h-7 mx-auto mb-3" style={{ color: accentColor }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">{t("event.hotels")}</h2>
        </div>
        <p className="font-body text-sm text-muted-foreground text-center max-w-md mx-auto mb-12">
          {t("event.hotelsSubtitle")}
        </p>

        <div className="space-y-4">
          {hotels.map((hotel, i) => (
            <div
              key={i}
              className="border border-border rounded-xl p-6 bg-card text-center transition-shadow hover:shadow-md"
            >
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{hotel.name}</h3>
              {hotel.address && (
                <p className="font-body text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {hotel.address}
                </p>
              )}
              {hotel.note && (
                <p className="font-body text-sm text-muted-foreground mt-2 italic">{hotel.note}</p>
              )}
              {hotel.url && (
                <a
                  href={hotel.url.startsWith("http") ? hotel.url : `https://${hotel.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-body text-sm mt-3 hover:underline"
                  style={{ color: accentColor }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
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
