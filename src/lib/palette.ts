// Deterministic gradient per slug so parks/rides without cover images
// still get distinct, stable "poster" art.
export function slugGradient(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  const hue = ((hash % 360) + 360) % 360;
  const hue2 = (hue + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue} 45% 22%), hsl(${hue2} 55% 34%))`;
}
