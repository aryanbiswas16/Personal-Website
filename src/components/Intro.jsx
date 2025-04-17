import React from "react";
import "../styles/Intro.css";
import avatarImage from "../assets/avatar.png"; // Update this path to where your image is stored

const Intro = () => {
  return (
    <div className="page-container">
      <div id="intro">
        <img src={avatarImage} alt="Avatar" className="intro-avatar" />
        <div className="intro-text-content">
          <div className="intro-title-container">
            <span>hi,</span>
            <span className="intro-name">Aryan</span>
            <span>here.</span>
          </div>
          <div className="intro-subtitle">I create stuff sometimes.</div>
          <div className="intro-desc">
            I'm a software engineer based in Toronto. I'm passionate about
            building software that makes a difference. I focus on creating
            efficient, scalable, and user-friendly solutions.
          </div>
          <a href="mailto:aryanbiswas16@gmail.com" className="intro-contact">
            Say hi!
          </a>
        </div>
      </div>
    </div>
  );
};

export default Intro;