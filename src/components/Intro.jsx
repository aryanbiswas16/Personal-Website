import React from "react";
import "../styles/Intro.css";
import Animation from "./Animation";

class Intro extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: true,
      activeKey: "1",
      visible: true
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(eventKey) {
    this.setState({
      activeKey: eventKey
    });
  }

  render() {
    return (
      <div id="intro">
        <Animation>
          <div className="intro-title">
            Hi, I'm <span className="intro-name">Your Name</span>
          </div>
          <div className="intro-subtitle">I create stuff sometimes.</div>
          <div className="intro-desc">
            I'm a software engineer based in Your Location. I'm passionate about
            building software that makes a difference. I focus on creating
            efficient, scalable, and user-friendly solutions.
          </div>
          <a
            href="mailto:your.email@example.com"
            className="intro-contact"
          >
            Contact Me
          </a>
        </Animation>
      </div>
    );
  }
}

export default Intro;