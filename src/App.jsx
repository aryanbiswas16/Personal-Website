import { useEffect } from 'react'
import { initScroll } from './lib/scroll.js'
import Grain from './components/Grain.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Work from './components/Work.jsx'
import Experience from './components/Experience.jsx'
import About from './components/About.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  useEffect(() => initScroll(), [])

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Grain />
      <Nav />
      <main id="main">
        <Hero />
        <Work />
        <Experience />
        <About />
      </main>
      <Footer />
    </>
  )
}
