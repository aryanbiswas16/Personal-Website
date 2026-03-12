import React, { useState, useEffect } from 'react';
import '../styles/TypewriterHero.css';

const TypewriterHero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  
  const phrases = [
    'Software Engineer',
    'AI Researcher',
    'Deepfake Detection Expert',
    'Full Stack Developer',
    'Pro Gamer',
    'Chef in Training',
    'Dog Dad',
    'Coffee Enthusiast'
  ];
  
  const period = 2000;
  const typingSpeed = isDeleting ? 50 : 100;

  useEffect(() => {
    const ticker = setTimeout(() => {
      tick();
    }, typingSpeed);

    return () => clearTimeout(ticker);
  }, [displayText, isDeleting, currentIndex]);

  const tick = () => {
    const i = loopNum % phrases.length;
    const fullText = phrases[i];
    
    let updatedText = isDeleting 
      ? fullText.substring(0, displayText.length - 1)
      : fullText.substring(0, displayText.length + 1);
    
    setDisplayText(updatedText);
    
    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setTimeout(() => {}, period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setCurrentIndex(0);
    }
  };

  return (
    <div className="typewriter-hero">
      <div className="typewriter-container">
        <span className="typewriter-prefix">I am a </span>
        <span className="typewriter-text">{displayText}</span>
        <span className="typewriter-cursor">|</span>
      </div>
    </div>
  );
};

export default TypewriterHero;
