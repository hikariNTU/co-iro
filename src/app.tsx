import {
  CopyIcon,
  CounterClockwiseClockIcon,
  SewingPinIcon,
} from "@radix-ui/react-icons"
import { useAtom, useSetAtom } from "jotai"
import { forwardRef, useEffect } from "react"
import { fromHEX } from "wcag-contrast-util"
import { Logo } from "./logo"
import { currentColorAtom, historyColorAtom, supportAtom } from "./state"
import { ColorCard } from "./color-card"
import {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card"

const MAX_HISTORY_LENGTH = 50
const links = Object.freeze({
  caniuse: "https://caniuse.com/mdn-api_eyedropper",
  mdnLink: "https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API",
})

async function GetEyeDropper() {
  if (typeof window > "u" || !window.EyeDropper) {
    alert("Oops!! Seems like your not using a chromium browser.")
    return
  }
  const eyeDropper = new window.EyeDropper()
  const result = await eyeDropper.open()
  return result.sRGBHex.toUpperCase()
}

async function copyText(text: string) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch (e) {
    console.warn("Navigator Clipboard unable to proceed:", e)
  }

  return false
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
  )
}

function Header() {
  return (
    <header className="h-8 shrink-0 w-full flex items-center justify-start bg-stone-900 border-stone-700 border-b [grid-area:header]">
      <h1 className="font-thin flex items-center gap-1 px-2 ml-1 bg-stone-800 shrink-0 select-none rounded-full ">
        <Logo className="w-4 h-4" />
        Co-Iro
      </h1>
      <p className="px-2 text-xs text-stone-400 overflow-auto min-w-0 text-nowrap">
        Retrieve the color from your screen pixel with{" "}
        <a
          className="text-sky-400 underline hover:bg-sky-400/20"
          href={links.mdnLink}
        >
          Eye Dropper API
        </a>
      </p>
    </header>
  )
}

function SupportBanner() {
  const [support, setSupport] = useAtom(supportAtom)

  useEffect(() => {
    if (typeof window === "undefined" || !("EyeDropper" in window)) {
      setSupport(false)
    }
  }, [])

  if (support) {
    return null
  }

  return (
    <div
      className="absolute top-0 inset-x-0 p-2 text-sm bg-red-800"
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
  )
}

const ColorTag = forwardRef<HTMLButtonElement, { color: string }>(
  function ColorTagCore(props, ref) {
    const setColor = useSetAtom(currentColorAtom)
    if (!props.color) {
      return null
    }

    return (
      <button
        className="flex items-center gap-2 text-neutral-300 hover:bg-stone-800 px-1 rounded"
        style={{ "--c": props.color }}
        ref={ref}
        onClick={() => {
          setColor(props.color)
        }}
        {...props}
      >
        <div className="w-4 h-4 rounded-full border border-neutral-700 bg-[--c]"></div>
        <code className="text-xs">{props.color}</code>
      </button>
    )
  }
)

function EyeDropper() {
  const [color, setColor] = useAtom(currentColorAtom)
  const setHistory = useSetAtom(historyColorAtom)
  const getRes = async () => {
    try {
      const res = await GetEyeDropper()
      if (res) {
        setColor(res)
        setHistory((h) => {
          const newH = [
            {
              id: Date.now().toString(),
              color: res,
            },
            ...h,
          ]
          if (newH.length > MAX_HISTORY_LENGTH) {
            newH.pop()
          }
          return newH
        })
      }
    } catch {}
  }

  return (
    <div className="relative flex flex-col gap-2 items-center justify-center bg-zinc-900">
      <SupportBanner />
      <button
        className="w-20 h-20 rounded-full flex items-center justify-center p-2 flex-col bg-neutral-700 text-white hover:bg-neutral-600 active:bg-neutral-500 text-4xl"
        onClick={getRes}
      >
        <ColorPickerIcon />
        <span className="sr-only">pick color</span>
      </button>
      <ColorCard color={color} />
    </div>
  )
}

function History() {
  const [history] = useAtom(historyColorAtom)

  return (
    <section className="w-[180px] border-l bg-stone-900 border-stone-700 grid grid-rows-[auto,1fr] min-h-0">
      <h3 className="px-2 py-1 text-sm text-stone-400 flex items-center gap-1 bg-stone-900 border-b border-stone-800">
        <CounterClockwiseClockIcon /> History
      </h3>
      <div className="flex flex-col overflow-auto px-2">
        {!history.length && (
          <p className="text-stone-400 text-xs p-2">
            No history color available.
            <br />
            Use the color picker from the left panel to start picking color from
            screen.
          </p>
        )}
        {history.map((data) => {
          return (
            <div
              key={data.id}
              className="border-b last:border-none py-2 border-stone-800 flex gap-1 group animate-expand origin-top"
            >
              <HistoryEntry color={data.color} />
              <button
                className="opacity-0 ml-auto group-hover:opacity-100 group-focus-within:opacity-100 hover:text-sky-500 p-2 rounded hover:bg-stone-800"
                onClick={() => {
                  copyText(data.color)
                }}
              >
                <CopyIcon />
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
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
  )
}

export function App() {
  return (
    <div className='h-full w-full grid grid-rows-[auto,1fr] grid-cols-[1fr,auto] [grid-template-areas:"header_header"_"left_right"] min-h-0'>
      <Header />
      <EyeDropper />
      <History />
    </div>
  )
}
