import {
  CopyIcon,
  CounterClockwiseClockIcon,
  SewingPinIcon,
} from "@radix-ui/react-icons"
import { useAtom, useSetAtom } from "jotai"
import { useEffect } from "react"
import { fromHEX } from "wcag-contrast-util"
import { Logo } from "./logo"
import { currentColorAtom, historyColorAtom, supportAtom } from "./state"

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
  return result
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

function Header() {
  return (
    <header className="h-8 shrink-0 w-full flex items-center justify-start bg-stone-900 border-stone-700 border-b [grid-area:header]">
      <h1 className="font-thin flex items-center gap-1 px-2 ml-1 bg-stone-800 shrink-0 select-none rounded-full ">
        <Logo className="w-4 h-4" />
        Co-Iro
      </h1>
      <p className="px-2 text-xs text-stone-400 overflow-auto min-w-0 text-nowrap">
        Retrieve color from your screen pixel with{" "}
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
        Your browser doesn't support Eye Dropper API. Using a chromium-based
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

function ColorTag({ result }: { result: string | undefined }) {
  if (!result) {
    return null
  }

  const [r, g, b] = fromHEX(result)

  return (
    <div
      className="flex items-center gap-2 text-neutral-300"
      style={{ "--c": result }}
    >
      <div className="w-4 h-4 rounded-full border border-neutral-700 bg-[--c]"></div>
      <div>
        <code className="text-xs">{result.toUpperCase()}</code>
        <div className="flex gap-1 text-[10px]">
          <span className="text-red-700">{Math.round(r * 255)}</span>
          <span className="text-green-700">{Math.round(g * 255)}</span>
          <span className="text-blue-700">{Math.round(b * 255)}</span>
        </div>
      </div>
    </div>
  )
}

function EyeDropper() {
  const setColor = useSetAtom(currentColorAtom)
  const setHistory = useSetAtom(historyColorAtom)
  const getRes = async () => {
    try {
      const res = (await GetEyeDropper())?.sRGBHex
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
    <div className="relative flex items-center justify-center bg-zinc-900">
      <SupportBanner />
      <button
        className="w-20 h-20 rounded-full flex items-center justify-center p-2 flex-col bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 font-thin tracking-widest"
        onClick={getRes}
      >
        <SewingPinIcon />
        PICK
      </button>
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
          </p>
        )}
        {history.map((data) => {
          return (
            <div
              key={data.id}
              className="border-b last:border-none py-2 border-stone-800 flex gap-1 group animate-expand origin-top"
            >
              <ColorTag result={data.color} />
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

export function App() {
  return (
    <div className='h-full w-full grid grid-rows-[auto,1fr] grid-cols-[1fr,auto] [grid-template-areas:"header_header"_"left_right"] min-h-0'>
      <Header />
      <EyeDropper />
      <History />
    </div>
  )
}
