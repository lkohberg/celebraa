interface GoogleMapsEmbedProps {
  address: string;
}

const GoogleMapsEmbed = ({ address }: GoogleMapsEmbedProps) => {
  if (!address) return null;

  const encodedAddress = encodeURIComponent(address);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-sm border border-border">
      <iframe
        title="Google Maps"
        width="100%"
        height="250"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/maps?q=${encodedAddress}&output=embed`}
      />
    </div>
  );
};

export default GoogleMapsEmbed;
