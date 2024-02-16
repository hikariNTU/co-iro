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

export function RGBToHSL(r: number, g: number, b: number) {
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
