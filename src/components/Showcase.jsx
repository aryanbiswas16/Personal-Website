import React from "react";
import "../styles/Showcase.css";
import FolderOpenRounded from "@mui/icons-material/FolderOpenRounded";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Carousel from "react-bootstrap/Carousel";
import ExternalLinks from "./ExternalLinks.jsx";
import { motion } from "framer-motion";
import horrorgameImg from "../assets/horrorgame.png";
import skip from "../assets/Skip_the Dishes.png";
import leetcode from "../assets/Screenshot_3.png";

const Showcase = () => {
  const spotlightProjects = {
    "My Mom Needs Me Home For Dinner But There’s Monsters In The Office!": {
      title: "My Mom Needs Me Home For Dinner But There’s Monsters In The Office!",
      desc:
        "A third-person Comedy-Horror game where you play as a office worker trying to escape a monster invasion",
      techStack: "C# (UNITY)",
      link: "https://github.com/aryanbiswas16/HorrorGame",
      open: "https://kamisama165.itch.io/my-mom-needs-me-home-for-dinner-but-theres-monsters-in-the-office",
      image: horrorgameImg
    },
    "Skip the Dishes Coupon Scraper": {
      title: "Skip the Dishes Coupon Scraper",
      desc:
        "Created a chrome extension that scrapes Skip the Dishes for coupons and displays them in a user-friendly interface.",
      techStack: "JavaScript, React, Chrome Extensions", 
      link: "https://github.com/aryanbiswas16/Skip-The-Dishes-Promo-Scrapper",
      image: skip
    },
    "Leetcode Helper Extension": {
      title: "Leetcode Helper Extension",
      desc:
        "Created a Leetcode assistant that actively helps you solve problems based on the code in the text editor. It also helps by creating notes for every problem and solution for future reference. similar to new agentic offering form Leetcode before it existed",
      techStack: "JavaScript, React, Chrome Extensions",
      link: "https://github.com/aryanbiswas16/AI-leetcode-coach-extention/tree/main",
      image: leetcode
    }
  };
  const projects = {
    "DeepFakeGuard": {
      desc:
        "A multi-detector deepfake detection system with ensemble fusion. Combines DINOv3 (face-swap), D3 (temporal consistency), and LipFD (lip-sync) detectors with domain-aware trust weighting. Achieves 0.88 AUROC cross-dataset performance on FaceForensics++ to Celeb-DF.",
      techStack: "Python, PyTorch, DINOv2, Streamlit, Computer Vision",
      link: "https://github.com/aryanbiswas16/DeepFakeGuard",
      open: "",
      featured: true,
      highlight: "0.88 AUROC • CUCAI 2026"
    },
    "Beacon CRM Assistant": {
      desc:
        "AI-powered consulting assistant with FastAPI backend, Next.js frontend, and Chrome extension for live transcript capture. Context-aware AI that pulls business context from documents to drive intelligent responses. Built for KingHacks 2026.",
      techStack: "Python, FastAPI, Next.js, Chrome Extensions, AI/ML",
      link: "https://github.com/aryanbiswas16/KingHacks2026",
      open: "https://youtu.be/HUyS6nTOO0E",
      featured: true,
      highlight: "KingHacks 2026 • Top 10"
    },
    "American Sign Language Recognition Bot": {
      desc:
        "Real-time ASL recognition using computer vision and deep learning. Captures hand landmarks with MediaPipe, formats datasets for training, trains a Keras Sequential model (TensorFlow) with scikit-learn utilities, and performs live webcam inference via OpenCV.",
      techStack: "Python, OpenCV, MediaPipe, TensorFlow, Keras, scikit-learn",
      link: "https://github.com/aryanbiswas16/SignLanguageRecognition",
      open: ""
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  console.log('Spotlight Projects:', spotlightProjects);

  return (
    <div id="projects">
      <motion.div 
        className="section-header"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="section-title">/ pet projects</span>
      </motion.div>
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Carousel>
          {Object.keys(spotlightProjects).map((key, i) => (
            <Carousel.Item key={i}>
              <img
                className="d-block w-100"
                src={spotlightProjects[key]["image"]}
                alt={key}
              />
              <div className="caption-bg">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Carousel.Caption>
                    <h3>{spotlightProjects[key]["title"]}</h3>
                    <p>{spotlightProjects[key]["desc"]}</p>
                    <span className="techStack">{spotlightProjects[key]["techStack"]}</span>
                    <ExternalLinks
                      githubLink={spotlightProjects[key]["link"]}
                      openLink={spotlightProjects[key]["open"]}
                    />
                  </Carousel.Caption>
                </motion.div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </motion.div>

      <motion.div 
        className="project-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ul className="projects-grid">
          {Object.keys(projects).map((key, i) => (
            <motion.li
              className={`projects-card ${projects[key]["featured"] ? 'featured-card' : ''}`}
              key={i}
              variants={cardVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.2 }
              }}
            >
              <div className="card-top">
                {projects[key]["featured"] && (
                  <div className="featured-badge-card">★ Featured</div>
                )}
                <div className="card-header">
                  <motion.div
                    className="folder-icon"
                    whileHover={{
                      rotate: 15,
                      scale: 1.1,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <FolderOpenRounded style={{ fontSize: 35 }} />
                  </motion.div>
                  <ExternalLinks
                    githubLink={projects[key]["link"]}
                    openLink={projects[key]["open"]}
                  />
                </div>

                <div className="card-title">{key}</div>
                {projects[key]["highlight"] && (
                  <div className="highlight-text">{projects[key]["highlight"]}</div>
                )}
                <div className="card-desc">{projects[key]["desc"]}</div>
              </div>

              <div className="card-bottom">
                <div className="card-tech">
                  {projects[key]["techStack"].split(", ").map((tech, idx) => (
                    <span key={idx} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default Showcase;