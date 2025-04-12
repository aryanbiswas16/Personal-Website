import Header from './components/Header.jsx'
import Intro from './components/Intro.jsx';
import About from './components/about.jsx';


function App() {
  return (
    <div className="App">
      <Header />
      <div id = "content">
      <Intro />
      <About />
      </div>
    </div>
  );
}

export default App
