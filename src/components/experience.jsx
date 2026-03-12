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
      company: "QMind",
      position: "Project Lead",
      duration: "May 2025 — Present",
      location: "Kingston, ON",
      achievements: [
        "Led a 5-person team to build DeepfakeGuard, an open-source multi-modal deepfake detection toolkit (Python, PyTorch, Streamlit); authored research report and selected for spotlight presentation at CUCAI 2026.",
        "Trained a Vision Transformer detector using parameter-efficient fine-tuning, achieving 0.88 AUROC on cross-dataset evaluation and outperforming established baselines by 23 points.",
        "Architected an ensemble fusion system combining three specialized detection models (face-artifact, lip-sync audio-visual, temporal-motion) with weighted scoring and applicability gating to handle diverse deepfake types.",
        "Integrated an LLM-powered explainability layer that validates ensemble outputs by identifying when individual detection modalities are skewed or non-applicable, providing structured natural-language analysis grounded in per-detector scores and model-specific limitations."
      ]
    },
    {
      company: "Bank of Montreal (BMO)",
      position: "Software Developer (Staffed via TCS)",
      duration: "October 2024 — August 2025",
      location: "Toronto, ON",
      achievements: [
        "Built a GenAI Figma to Angular POC end-to-end; shipped core logic as an MCP server integrated with GitHub Copilot to accelerate UI scaffolding for internal teams.",
        "Automated ALM test-case drafting using LLM agents and reusable prompts/tools; reduced manual QA authoring effort and improved regression turnaround time by an estimated 40%.",
        "Developed an agentic system to assist with AngularJS to Angular migrations; automated safe upgrades and refactors across deprecated modules/components supporting active production sites used by BMO.",
        "Shipped production-grade systems impacting 100+ internal users and multiple active customer-facing applications, demonstrating end-to-end ownership from design through deployment."
      ]
    },
    {
      company: "Tata Consultancy Services (TCS)",
      position: "Software Developer Intern",
      duration: "May 2024 — September 2024",
      location: "Toronto, ON",
      achievements: [
        "Designed and deployed a churn-risk prediction model for business banking customers using XGBoost; provided actionable customer segments to support retention strategies.",
        "Delivered an OCR + machine-translation pipeline for RBC to localize English image-based documents to French with zero visible formatting drift; shipped to production and processed 1000+ documents.",
        "Built a resume screener using vector embeddings and cosine similarity; reduced manual screening time by 75% and processed 500+ applicant profiles."
      ]
    },
    {
      company: "Queen's University",
      position: "Undergraduate Teaching Assistant",
      duration: "September 2022 — April 2023",
      location: "Kingston, ON",
      achievements: [
        "Mentored 100+ students (CISC 101, CISC 121); built an autograder that reduced instructor grading time by 36%, enabling faster feedback cycles."
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