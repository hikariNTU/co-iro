import { CopyIcon, SunIcon } from "@radix-ui/react-icons";
import { memo } from "react";
import { fromHEX, toRelativeLuminance } from "wcag-contrast-util";
import { RGBToHSL, copyText } from "./utils";

function RingValue({
  size = "48px",
  value = 0.23,
  color = "white",
  bgColor = "#1a1a1a",
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

export const ColorCard = memo(function ColorCard(props: { color: string }) {
  const rgb = fromHEX(props.color);
  const hsl = RGBToHSL(
    // @ts-expect-error
    ...rgb,
  );
  const luminance = toRelativeLuminance(...rgb);

  return (
    <div className="relative flex flex-col items-center justify-center rounded-xl bg-neutral-900/80 p-4 py-3 backdrop-blur">
      <div
        className="font-love mb-3 flex justify-center rounded-full px-4 py-1 text-4xl"
        style={
          luminance < 0.25
            ? {
                color: "white",
                backgroundColor: props.color,
                border: "solid 1px #666",
              }
            : {
                color: props.color,
              }
        }
      >
        {props.color}
      </div>

      <div className="flex gap-4 text-xs">
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

      <button
        className="absolute right-2 top-2 rounded p-2 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-50"
        onClick={() => {
          copyText(props.color);
        }}
      >
        <CopyIcon />
      </button>
    </div>
  );
});
