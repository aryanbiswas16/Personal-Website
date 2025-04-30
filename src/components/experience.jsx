import React from "react";
import JobList from "./JobList";
import "../styles/Experience.css";

class Experience extends React.Component {
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
    return (
      <div id="experience">       
          <div className="section-header ">
            <span className="section-title">/ experience</span>
          </div>
          <JobList></JobList>
      </div>
    );
  }
}

export default Experience;