/** Shared calendar helper utilities */

export const buildGoogleCalUrl = (title: string, date: string, time: string, location?: string) => {
  const [y, m, d] = date.split("-");
  const [h, min] = (time || "12:00").split(":");
  const start = `${y}${m}${d}T${h}${min}00`;
  const endH = String(Math.min(23, parseInt(h) + 4)).padStart(2, "0");
  const end = `${y}${m}${d}T${endH}${min}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    ...(location ? { location } : {}),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
};

export const buildIcsBlob = (title: string, date: string, time: string, location?: string) => {
  const [y, m, d] = date.split("-");
  const [h, min] = (time || "12:00").split(":");
  const start = `${y}${m}${d}T${h}${min}00`;
  const endH = String(Math.min(23, parseInt(h) + 4)).padStart(2, "0");
  const end = `${y}${m}${d}T${endH}${min}00`;
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
    `DTSTART:${start}`, `DTEND:${end}`, `SUMMARY:${title}`,
    location ? `LOCATION:${location}` : "",
    "END:VEVENT", "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
  return URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
};
