import {
  CopyIcon,
  CounterClockwiseClockIcon,
  GitHubLogoIcon,
} from "@radix-ui/react-icons";
import { useAtom, useSetAtom } from "jotai";
import { forwardRef, useEffect } from "react";
import { Logo } from "./logo";
import { currentColorAtom, historyColorAtom, supportAtom } from "./state";
import { ColorCard } from "./color-card";
import {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";

const MAX_HISTORY_LENGTH = 50;
const links = Object.freeze({
  caniuse: "https://caniuse.com/mdn-api_eyedropper",
  mdnLink: "https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API",
});

async function GetEyeDropper() {
  if (typeof window > "u" || !window.EyeDropper) {
    alert("Oops!! Seems like your not using a chromium browser.");
    return;
  }
  const eyeDropper = new window.EyeDropper();
  const result = await eyeDropper.open();
  return result.sRGBHex.toUpperCase();
}

async function copyText(text: string) {
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

function ColorPickerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      width="1em"
      fill="currentColor"
      viewBox="0 -960 960 960"
      {...props}
    >
      <path d="M120-120v-190l358-358-58-56 58-56 76 76 124-124q5-5 12.5-8t15.5-3q8 0 15 3t13 8l94 94q5 6 8 13t3 15q0 8-3 15.5t-8 12.5L705-555l76 78-57 57-56-58-358 358H120Zm80-80h78l332-334-76-76-334 332v78Zm447-410 96-96-37-37-96 96 37 37Zm0 0-37-37 37 37Z" />
    </svg>
  );
}

function Header() {
  return (
    <header className="flex h-12 w-full shrink-0 items-center justify-start border-b border-stone-700 bg-stone-900 [grid-area:header]">
      <h1 className="ml-1 flex shrink-0 select-none items-center gap-1 rounded-full bg-stone-800 px-2 text-lg font-thin ">
        <Logo className="h-6 w-6" />
        Co-Iro
      </h1>
      <p className="mx-2 min-w-0 flex-shrink overflow-auto text-nowrap text-xs text-stone-400">
        Retrieve colors from screens with{" "}
        <a
          className="rounded px-1 text-sky-400 underline hover:bg-sky-400/20"
          href={links.mdnLink}
        >
          Eye Dropper API
        </a>
      </p>
      <a
        className="ml-auto mr-2 rounded p-1 hover:bg-neutral-700 hover:text-neutral-50"
        href="https://github.com/hikariNTU/co-iro"
        title="Github link"
      >
        <GitHubLogoIcon />
        <span className="sr-only">Github link</span>
      </a>
    </header>
  );
}

function SupportBanner() {
  const [support, setSupport] = useAtom(supportAtom);

  useEffect(() => {
    if (typeof window === "undefined" || !("EyeDropper" in window)) {
      setSupport(false);
    }
  }, []);

  if (support) {
    return null;
  }

  return (
    <div
      className="absolute inset-x-0 top-0 bg-red-800 p-2 text-sm"
      role="alert"
    >
      <p>
        Your browser doesn't support the Eye Dropper API. Use a chromium-based
        browser if you want to use this website.
      </p>
      <a
        href={links.caniuse}
        className="text-sky-300 underline underline-offset-2"
        title="Can I Use - Eye Dropper API"
      >
        See supported browsers
      </a>
    </div>
  );
}

const ColorTag = forwardRef<HTMLButtonElement, { color: string }>(
  function ColorTagCore(props, ref) {
    const setColor = useSetAtom(currentColorAtom);
    if (!props.color) {
      return null;
    }

    return (
      <button
        className="flex items-center gap-2 rounded px-1 text-neutral-300 hover:bg-stone-800"
        style={{ "--c": props.color }}
        ref={ref}
        onClick={() => {
          setColor(props.color);
        }}
        {...props}
      >
        <div className="h-4 w-4 rounded-full border border-neutral-700 bg-[--c]"></div>
        <code className="text-xs">{props.color}</code>
      </button>
    );
  },
);

function EyeDropper() {
  const [color, setColor] = useAtom(currentColorAtom);
  const setHistory = useSetAtom(historyColorAtom);
  const getRes = async () => {
    try {
      const res = await GetEyeDropper();
      if (res) {
        setColor(res);
        setHistory((h) => {
          const newH = [
            {
              id: Date.now().toString(),
              color: res,
            },
            ...h,
          ];
          if (newH.length > MAX_HISTORY_LENGTH) {
            newH.pop();
          }
          return newH;
        });
      }
    } catch {}
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center gap-2 bg-zinc-900"
      style={{
        "--color": color || "#000",
        background:
          "radial-gradient(circle, var(--color) 0%, rgba(24 24 27) 70%, rgba(0 0 0) 100%)",
      }}
    >
      <SupportBanner />
      <button
        className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-neutral-700/80 p-2 text-4xl text-white hover:bg-neutral-800/90 active:bg-neutral-950"
        onClick={getRes}
      >
        <ColorPickerIcon />
        <span className="sr-only">pick color</span>
      </button>
      <ColorCard color={color} />
    </div>
  );
}

function History() {
  const [history] = useAtom(historyColorAtom);

  return (
    <section className="grid min-h-0 w-[180px] grid-rows-[auto,1fr] border-l border-stone-700 bg-stone-900">
      <h3 className="flex items-center gap-1 border-b border-stone-800 bg-stone-900 px-2 py-1 text-stone-400">
        <CounterClockwiseClockIcon /> History
      </h3>
      <div className="flex flex-col overflow-auto px-2">
        {!history.length && (
          <section className="p-2 text-sm text-stone-400">
            <p className="mb-1">No history color available.</p>
            <p>
              Use the color picker from the left panel to start picking color
              from the screen.
            </p>
          </section>
        )}
        {history.map((data) => {
          return (
            <div
              key={data.id}
              className="group flex origin-top animate-expand gap-1 border-b border-stone-800 py-2 last:border-none"
            >
              <HistoryEntry color={data.color} />
              <button
                className="ml-auto rounded p-2 opacity-0 hover:bg-stone-800 hover:text-sky-500 group-focus-within:opacity-100 group-hover:opacity-100"
                onClick={() => {
                  copyText(data.color);
                }}
              >
                <CopyIcon />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function HistoryEntry(props: { color: string }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <ColorTag color={props.color} />
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent
          side="left"
          className="shadow data-[state=open]:transition-all"
        >
          <ColorCard color={props.color} />
          <HoverCardArrow className="fill-neutral-700" />
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  );
}

export function App() {
  return (
    <div className='grid h-full min-h-0 w-full grid-cols-[1fr,auto] grid-rows-[auto,1fr] [grid-template-areas:"header_header"_"left_right"]'>
      <Header />
      <EyeDropper />
      <History />
    </div>
  );
}
