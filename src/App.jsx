import './App.css';
import Header from './components/Header.jsx';
import Intro from './components/Intro.jsx';
import About from './components/about.jsx';
import Experience from './components/experience.jsx';
import Showcase from './components/Showcase.jsx';
import { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function App() {
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  return (
    <div className="App">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: {
            enable: true,
            zIndex: -1
          },
          particles: {
            number: {
              value: 50,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: "#40E0D0"
            },
            links: {
              enable: true,
              color: "#40E0D0",
              opacity: 0.2
            },
            move: {
              enable: true,
              speed: 1
            },
            size: {
              value: 2
            },
            opacity: {
              value: 0.4
            }
          },
          backgroundMode: {
            enable: true
          },
          detectRetina: true
        }}
      />
      <Header />
      <div id="content">
        <Intro />
        <About />
        <Experience />
        <Showcase />
      </div>
    </div>
  );
}

export default App;
