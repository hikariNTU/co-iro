import { Logo } from "./logo"
import { useState } from "preact/hooks"

const Header = () => (
  <header>
    <h1>Co-Iro</h1>
    <span>
      <a
        class="link"
        href="https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API"
        target="_blank"
        rel="noopener noreferrer"
      >
        Eye Dropper API
      </a>
      showcase.
    </span>
  </header>
)

const cLink = "https://caniuse.com/mdn-api_eyedropper"

const GetEyeDropper = async () => {
  if (typeof window > "u" || !window.EyeDropper) {
    console.log("not available")
    return
  }
  const eyeDropper = new window.EyeDropper()
  const result = await eyeDropper.open()
  return result
}

const ColorTag = ({ result }) => (
  <code class="🎨" style={{ "--c": result }}>
    {result}
  </code>
)

const EyeDropper = () => {
  const [res, setRes] = useState()
  const getRes = async () => {
    try {
      const res = await GetEyeDropper()
      setRes(res?.sRGBHex)
    } catch {}
  }

  return (
    <>
      <button class="ed-btn" onClick={getRes}>
        GET
      </button>
      <ColorTag result={res} />
    </>
  )
}

export function App(props) {
  return (
    <>
      <Logo />
      <Header />
      <EyeDropper />
    </>
  )
}
