/**
 * Adds alpha transparency to a color string.
 * Works with both hex (#1E3A5F) and hsl(220, 50%, 35%) formats.
 * @param color - CSS color string (hex or hsl)
 * @param alpha - Alpha value 0-1
 */
export function colorWithAlpha(color: string, alpha: number): string {
  // HSL format: hsl(220, 50%, 35%) → hsla(220, 50%, 35%, 0.15)
  if (color.startsWith("hsl(")) {
    return color.replace("hsl(", "hsla(").replace(")", `, ${alpha})`);
  }
  // HSLA format: already has alpha, replace it
  if (color.startsWith("hsla(")) {
    return color.replace(/,\s*[\d.]+\)$/, `, ${alpha})`);
  }
  // Hex format: #1E3A5F → #1E3A5F26 (convert alpha to hex)
  if (color.startsWith("#")) {
    const hexAlpha = Math.round(alpha * 255).toString(16).padStart(2, "0");
    // Strip existing alpha if 8-digit hex
    const baseHex = color.length === 9 ? color.slice(0, 7) : color;
    return `${baseHex}${hexAlpha}`;
  }
  // Fallback: wrap with color-mix
  return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
}
