import React from "react";
import "../styles/Intro.css";
import avatarImage from "../assets/avatar.png"; // Update this path to where your image is stored

class Intro extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: true,
      activeKey: "1",
      visible: true,
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(eventKey) {
    this.setState({
      activeKey: eventKey,
    });
  }

  render() {
    return (
      <div id="intro">
        <img src={avatarImage} alt="Avatar" className="intro-avatar" />
        <span className="intro-title">
          hi, <span className="intro-name">Aryan</span> here.
        </span>
        <div className="intro-subtitle">I create stuff sometimes.</div>
        <div className="intro-desc">
          I'm a software engineer based in Toronto. I'm passionate about
          building software that makes a difference. I focus on creating
          efficient, scalable, and user-friendly solutions.
        </div>
        <a
          href="mailto:aryanbiswas16@gmail.com"
          className="intro-contact"
        >
          Say hi!
        </a>
      </div>
    );
  }
}

export default Intro;