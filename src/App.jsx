import './App.css';
import Header from './components/Header.jsx';
import Intro from './components/Intro.jsx';
import About from './components/about.jsx';
import Experience from './components/experience.jsx';
import Showcase from './components/Showcase.jsx';
import VantaBackground from './components/VantaBackground.jsx';

function App() {
  return (
    <div className="App">
      <VantaBackground />
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
