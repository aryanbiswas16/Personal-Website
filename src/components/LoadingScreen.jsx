import React, { useState, useEffect } from 'react';
import '../styles/LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [phase, setPhase] = useState(0);
  
  const messages = [
    { text: '> initializing portfolio...', delay: 100 },
    { text: '> loading projects...', delay: 80 },
    { text: '> DeepFakeGuard: loaded ✓', delay: 60 },
    { text: '> Beacon CRM: loaded ✓', delay: 60 },
    { text: '> experience: 3+ years ✓', delay: 60 },
    { text: '> skills: AI/ML, Full Stack ✓', delay: 60 },
    { text: '> ready.', delay: 100 },
  ];

  const [displayedLines, setDisplayedLines] = useState([]);

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let timeout;

    const typeLine = () => {
      if (currentLine >= messages.length) {
        setTimeout(() => {
          onComplete();
        }, 500);
        return;
      }

      const line = messages[currentLine];
      
      if (currentChar < line.text.length) {
        setText(line.text.substring(0, currentChar + 1));
        currentChar++;
        timeout = setTimeout(typeLine, line.delay);
      } else {
        setDisplayedLines(prev => [...prev, line.text]);
        setText('');
        currentChar = 0;
        currentLine++;
        timeout = setTimeout(typeLine, 200);
      }
    };

    typeLine();

    // Blinking cursor
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => {
      clearTimeout(timeout);
      clearInterval(cursorInterval);
    };
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="terminal">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="btn-close"></span>
            <span className="btn-minimize"></span>
            <span className="btn-maximize"></span>
          </div>
          <span className="terminal-title">aryan@portfolio ~ zsh</span>
        </div>
        <div className="terminal-body">
          {displayedLines.map((line, i) => (
            <div key={i} className="terminal-line">
              <span className="terminal-prompt">$</span>
              <span className="terminal-text">{line}</span>
            </div>
          ))}
          <div className="terminal-line current">
            <span className="terminal-prompt">$</span>
            <span className="terminal-text">{text}</span>
            <span className={`cursor ${showCursor ? 'visible' : ''}`}>▋</span>
          </div>
        </div>
      </div>
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
