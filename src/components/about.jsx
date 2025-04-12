import React from "react";
import "../styles/about.css";

class About extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: true,
      activeKey: "1"
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(eventKey) {
    this.setState({
      activeKey: eventKey
    });
  }

  render() {
    const one = (
      <p>
        I am currently a <b>Software Developer Intern</b> at
        <a href="https://www.tcs.com/"> TATA Consultancy Services (TCS)</a> in Toronto, 
        while completing my <b>Bachelor of Computing Honours</b> with a specialization in 
        <b> Software Design</b> at{" "}
        <a href="https://www.queensu.ca/">Queen's University</a>, graduating in April 2025.
      </p>
    );

    const two = (
      <p>
        Outside of work, I'm passionate about developing innovative solutions using AI and 
        machine learning. I've worked on projects ranging from ASL recognition to autonomous 
        wheelchairs using ROS 2. I also enjoy creating tools that solve real-world problems, 
        like my on-demand services app and Angular upgrade assistant.
      </p>
    );

    const tech_stack = [
      "Python",
      "Java",
      "TypeScript",
      "React.js",
      "Angular.js",
      "TensorFlow",
      "AWS",
      "Firebase"
    ];

    return (
      <div id="about">
        <div className="section-header">
          <span className="section-title">/ about me</span>
        </div>
        <div className="about-content">
          <div className="about-description">
            {one}
            {"Here are some technologies I have been working with:"}
            <ul className="tech-stack">
              {tech_stack.map((tech_item, i) => (
                <li key={i}>{tech_item}</li>
              ))}
            </ul>
            {two}
          </div>
          <div className="about-image">
            <img alt="Profile" src={"../assets/profile.png"} />
          </div>
        </div>
      </div>
    );
  }
}

export default About;