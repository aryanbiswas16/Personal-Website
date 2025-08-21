import React, { useEffect } from "react";
import "../styles/experience.css";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Experience = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const experiences = [
    {
      company: "Bank of Montreal (BMO)",
      position: "Software Developer — Contract via TCS (Full-Time)",
      duration: "Oct 2024 — Present",
      location: "Toronto, ON",
      achievements: [
        "Co-developed a generative-AI Figma→Angular converter (responsive, accessible); backed by a $10M production investment and later exposed as an MCP server for GitHub Copilot integration.",
        "Automated QA test-case authoring and execution in ALM using GenAI, accelerating regression coverage and reducing manual effort.",
        "Created a GitHub Copilot extension fine-tuned for AngularJS→Angular upgrading to automate safe API migrations and modernize legacy components."
      ]
    },
    {
      company: "Tata Consultancy Services (TCS)",
      position: "Software Developer Intern",
      duration: "May 2024 — Present",
      location: "Toronto, ON",
      achievements: [
        "Built a churn risk prediction model with XGBoost for BMO business banking while at TCS, enabling proactive outreach to at-risk clients.",
        "Implemented OCR-based translation pipelines for RBC to support multilingual document workflows across enterprise systems.",
        "Automated Enbridge’s SharePoint migration by creating custom tools that eliminated manual data transfer.",
        "Developed a resume-screening tool using semantic vectorization, reducing manual review time by 75%.",
        "Led development of a ROS 2–based autonomous wheelchair using A*/RRT* planning and YOLO for obstacle detection.",
        "Prototyped a food calorie estimation tool using photogrammetry and 3D computer vision."
      ]
    },
    {
      company: "QMind (Queen’s AI Club)",
      position: "Project Manager — AI Research",
      duration: "May 2025 — Present",
      location: "Kingston, ON",
      achievements: [
        "Will present our research paper and live demo at CUCAI, Canada’s largest university AI conference.",
        "Project: deepfake/AI-video detection combining spatial artifact analysis with temporal consistency; manage a 6-person team, milestones, and weekly sprints."
      ]
    },
    {
      company: "Queen’s University",
      position: "Undergraduate Teaching Assistant",
      duration: "Sept 2022 — Apr 2023",
      location: "Kingston, ON",
      achievements: [
        "Taught tutorials and held office hours for CISC 101 and 121, supporting 100+ students with assignments and exams.",
        "Built an autograder system to streamline marking, reducing grading time by 36%."
      ]
    }
  ];

  return (
    <div id="experience">
      <div className="section-header" data-aos="fade-right">
        <span className="section-title">/ experience</span>
      </div>
      <div className="experience-content">
        {experiences.map((exp, i) => (
          <div className="experience-item" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
            <div className="experience-item-header">
              <h3>{exp.position}</h3>
              <a href="#" className="company-link">@ {exp.company}</a>
              <p className="duration">{exp.duration}</p>
              <p className="location">{exp.location}</p>
            </div>
            <ul className="achievements-list">
              {exp.achievements.map((achievement, j) => (
                <li key={j} data-aos="fade-up" data-aos-delay={j * 50}>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;