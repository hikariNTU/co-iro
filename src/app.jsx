import { Logo } from "./logo"
import { useState } from "preact/hooks"

const links = Object.freeze({
  caniuse: "https://caniuse.com/mdn-api_eyedropper",
  mdnLink: "https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API",
})

const Link = ({ href, children }) => (
  <a class="link" href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
)

const Header = () => (
  <header class="🎩">
    <Logo className="🎩1" />
    <h1 class="🎩2">Co-Iro</h1>
    <div class="🎩3">
      <p>
        Retrieve color from your screen pixel with{" "}
        <Link href={links.mdnLink}>Eye Dropper API</Link>
      </p>
      <p>
        <Link href={links.caniuse}>Can I use it</Link>?
      </p>
    </div>
  </header>
)

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
      <div class="ed-btn-wrapper">
        <div class="color-src" aria-hidden></div>
        <button
          class="ed-btn"
          title="Get screen color by EyeDropper API"
          onClick={getRes}
        >
          GET
        </button>
      </div>
      <ColorTag result={res} />
    </>
  )
}

export function App(props) {
  return (
    <>
      <Header />
      <EyeDropper />
    </>
  )
}
