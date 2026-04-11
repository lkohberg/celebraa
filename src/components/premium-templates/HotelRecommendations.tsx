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
    <section className="py-10 md:py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-3">
          <Hotel className="w-5 h-5 md:w-7 md:h-7 mx-auto mb-2" style={{ color: accentColor }} />
          <h2 className="font-display text-lg md:text-3xl text-foreground">{t("event.hotels")}</h2>
        </div>
        <p className="font-body text-xs md:text-sm text-muted-foreground text-center max-w-md mx-auto mb-6 md:mb-12">
          {t("event.hotelsSubtitle")}
        </p>

        <div className="space-y-3">
          {hotels.map((hotel, i) => (
            <div
              key={i}
              className="border border-border rounded-xl p-4 md:p-6 bg-card text-center transition-shadow hover:shadow-md"
            >
              <h3 className="font-display text-base md:text-xl font-semibold text-foreground mb-1.5">{hotel.name}</h3>
              {hotel.address && (
                <p className="font-body text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {hotel.address}
                </p>
              )}
              {hotel.note && (
                <p className="font-body text-xs text-muted-foreground mt-1.5 italic">{hotel.note}</p>
              )}
              {hotel.url && (
                <a
                  href={hotel.url.startsWith("http") ? hotel.url : `https://${hotel.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-body text-xs mt-2 hover:underline"
                  style={{ color: accentColor }}
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
