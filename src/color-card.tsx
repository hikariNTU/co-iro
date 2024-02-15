import { DotFilledIcon, DotIcon, SunIcon } from "@radix-ui/react-icons";
import { memo } from "react";
import { fromHEX, toRelativeLuminance } from "wcag-contrast-util";

function RGBToHSL(r: number, g: number, b: number) {
  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  // Calculate hue
  // No difference
  if (delta === 0) h = 0;
  // Red is max
  else if (cmax === r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax === g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return [h, s, l];
}

function RingValue({
  size = "48px",
  value = 0.23,
  color = "white",
  bgColor = "#171717",
  trackColor = "#333",
  children,
}: React.PropsWithChildren<{
  size?: string;
  value: number;
  color: string;
  bgColor?: string;
  trackColor?: string;
}>) {
  return (
    <div
      className="relative h-[--size] w-[--size] rounded-full [contain:content]"
      style={{
        "--color": color,
        "--size": size,
        "--turn": `${value}turn`,
        "--bg-color": bgColor,
        "--track-color": trackColor,
        background:
          "conic-gradient(var(--color), var(--turn), var(--color), var(--turn), var(--track-color))",
      }}
    >
      <div className="absolute left-1/2 top-1/2 flex h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full bg-[--bg-color]">
        {children}
      </div>
    </div>
  );
}

export const ColorCard = memo(function ColorCard(props: {
  color: string | undefined;
}) {
  const rgb = fromHEX(props.color || "#000");
  const hsl = RGBToHSL(
    // @ts-expect-error
    ...rgb,
  );
  const luminance = toRelativeLuminance(...rgb);

  return (
    <div className="relative rounded-xl border border-neutral-700 bg-neutral-900 p-4 text-xs">
      <div className="flex gap-4">
        <RingValue size="80px" color="white" value={luminance}>
          <SunIcon />
          {luminance.toFixed(3)}
        </RingValue>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <RingValue color="#BA1C1B" value={rgb[0]}>
              <span className="text-red-500">{Math.round(rgb[0] * 255)}</span>
            </RingValue>
            <RingValue color="#16813D" value={rgb[1]}>
              <span className="text-green-500">{Math.round(rgb[1] * 255)}</span>
            </RingValue>
            <RingValue color="#1C4FD8" value={rgb[2]}>
              <span className="text-blue-500">{Math.round(rgb[2] * 255)}</span>
            </RingValue>
          </div>

          <ul className="text-neutral-300">
            <li className="flex justify-between">
              HEX:
              <code>{props.color}</code>
            </li>
            <li className="flex justify-between">
              RGB:
              <code>
                {rgb[0] * 255}, {rgb[1] * 255}, {rgb[2] * 255}
              </code>
            </li>
            <li className="flex justify-between">
              HSL:
              <code>
                {hsl[0]}, {(hsl[1] * 100).toFixed(0)},{" "}
                {(hsl[2] * 100).toFixed(0)}
              </code>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="absolute left-2 top-2 h-4 w-4 rounded-full border border-neutral-700 bg-[--c]"
        style={{ "--c": props.color || "transparent" }}
      ></div>
    </div>
  );
});
