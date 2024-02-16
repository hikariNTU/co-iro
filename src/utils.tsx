export async function getEyeDropper() {
  if (typeof window > "u" || !window.EyeDropper) {
    alert("Oops!! Seems like your not using a chromium browser.");
    return;
  }
  const eyeDropper = new window.EyeDropper();
  const result = await eyeDropper.open();
  return result.sRGBHex.toUpperCase();
}

export async function copyText(text: string) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    console.warn("Navigator Clipboard unable to proceed:", e);
  }

  return false;
}

export function RGBToHSL(rgb: number[]) {
  const r = rgb[0],
    g = rgb[1],
    b = rgb[2];
  // Find greatest and smallest channel values
  let cMin = Math.min(r, g, b),
    cMax = Math.max(r, g, b),
    delta = cMax - cMin,
    h = 0,
    s = 0,
    l = 0;

  // Calculate hue
  // No difference
  if (delta === 0) h = 0;
  // Red is max
  else if (cMax === r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cMax === g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cMax + cMin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return [h, s, l];
}

export function getRandomColor() {
  const colors = [
    Math.random() * 200 + 55,
    Math.random() * 200 + 55,
    Math.random() * 200 + 55,
  ];

  return (
    "#" + colors.map((v) => Math.round(v).toString(16).toUpperCase()).join("")
  );
}

export function RGBtoLab(rgb: number[]): [number, number, number] {
  let r = rgb[0],
    g = rgb[1],
    b = rgb[2],
    x: number,
    y: number,
    z: number;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

export function RGBtoCMYK(rgb: number[]): [number, number, number, number] {
  const r = rgb[0];
  const g = rgb[1];
  const b = rgb[2];

  const k = Math.min(1 - r, 1 - g, 1 - b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;

  return [c, m, y, k];
}
