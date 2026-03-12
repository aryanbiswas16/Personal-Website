import './App.css';
import { useState } from 'react';
import Header from './components/Header.jsx';
import Intro from './components/Intro.jsx';
import About from './components/about.jsx';
import Experience from './components/experience.jsx';
import Showcase from './components/Showcase.jsx';
import VantaBackground from './components/VantaBackground.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import TypewriterHero from './components/TypewriterHero.jsx';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="App">
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <CustomCursor />
      <VantaBackground />
      <Header />
      <div id="content">
        <Intro />
        <TypewriterHero />
        <About />
        <Experience />
        <Showcase />
      </div>
    </div>
  );
}

export default App;
