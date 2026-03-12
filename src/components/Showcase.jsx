import React from 'react';
import '../styles/Showcase.css';
import FolderOpenRounded from "@mui/icons-material/FolderOpenRounded";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Carousel from 'react-bootstrap/Carousel';
import ExternalLinks from "./ExternalLinks.jsx";
import { motion } from "framer-motion";
import deepfakeImg from "../assets/horrorgame.png";
import beaconImg from "../assets/Screenshot_3.png";
import horrorgameImg from "../assets/horrorgame.png";
import skip from "../assets/Skip_the Dishes.png";
import leetcode from "../assets/Screenshot_3.png";

const Showcase = () => {
  const spotlightProjects = {
    "DeepFakeGuard": {
      title: "DeepFakeGuard",
      desc: "A multi-detector deepfake detection system with ensemble fusion. Combines DINOv3 (face-swap), D3 (temporal consistency), and LipFD (lip-sync) detectors with domain-aware trust weighting. Achieves 0.88 AUROC cross-dataset performance.",
      techStack: "Python, PyTorch, DINOv2, Streamlit, Computer Vision",
      link: "https://github.com/aryanbiswas16/DeepFakeGuard",
      open: "",
      image: deepfakeImg,
      featured: true
    },
    "Beacon CRM Assistant": {
      title: "Beacon CRM Assistant",
      desc: "AI-powered consulting assistant with FastAPI backend, Next.js frontend, and Chrome extension for live transcript capture. Context-aware AI that pulls business context from documents to drive intelligent responses.",
      techStack: "Python, FastAPI, Next.js, Chrome Extensions, AI/ML",
      link: "https://github.com/aryanbiswas16/KingHacks2026",
      open: "https://youtu.be/HUyS6nTOO0E",
      image: beaconImg,
      featured: true
    },
    "My Mom Needs Me Home For Dinner But There's Monsters In The Office!": {
      title: "My Mom Needs Me Home For Dinner But There's Monsters In The Office!",
      desc: "A third-person Comedy-Horror game where you play as a office worker trying to escape a monster invasion",
      techStack: "C# (UNITY)",
      link: "https://github.com/aryanbiswas16/HorrorGame",
      open: "https://kamisama165.itch.io/my-mom-needs-me-home-for-dinner-but-theres-monsters-in-the-office",
      image: horrorgameImg
    }
  };
  
  const projects = {
    "Skip the Dishes Coupon Scraper": {
      desc: "Created a chrome extension that scrapes Skip the Dishes for coupons and displays them in a user-friendly interface.",
      techStack: "JavaScript, React, Chrome Extensions", 
      link: "https://github.com/aryanbiswas16/Skip-The-Dishes-Promo-Scrapper",
      open: ""
    },
    "Leetcode Helper Extension": {
      desc: "Created a Leetcode assistant that actively helps you solve problems based on the code in the text editor. It also helps by creating notes for every problem and solution for future reference. Similar to new agentic offering from Leetcode before it existed",
      techStack: "JavaScript, React, Chrome Extensions",
      link: "https://github.com/aryanbiswas16/AI-leetcode-coach-extention/tree/main",
      open: ""
    },
    "American Sign Language Recognition Bot": {
      desc: "Real-time ASL recognition using computer vision and deep learning. Captures hand landmarks with MediaPipe, formats datasets for training, trains a Keras Sequential model (TensorFlow) with scikit-learn utilities, and performs live webcam inference via OpenCV.",
      techStack: "Python, OpenCV, MediaPipe, TensorFlow, Keras, scikit-learn",
      link: "https://github.com/aryanbiswas16/SignLanguageRecognition",
      open: ""
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div id="projects">
      <motion.div 
        className="section-header"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="section-title">
          <span className="title-icon">✦</span> featured projects
        </span>
        <p className="section-subtitle">A collection of my most impactful work</p>
      </motion.div>
      
      <motion.div
        className="featured-carousel"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Carousel interval={5000} indicators={true}>
          {Object.keys(spotlightProjects).map((key, i) => (
            <Carousel.Item key={i}>
              <div className="carousel-image-wrapper">
                <img
                  className="d-block w-100 carousel-image"
                  src={spotlightProjects[key]["image"]}
                  alt={key}
                />
                <div className="carousel-gradient-overlay"></div>
              </div>
              <div className="caption-bg">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Carousel.Caption>
                    {spotlightProjects[key]["featured"] && (
                      <span className="featured-badge">★ Featured</span>
                    )}
                    <h3>{spotlightProjects[key]["title"]}</h3>
                    <p>{spotlightProjects[key]["desc"]}</p>
                    <div className="tech-stack-container">
                      {spotlightProjects[key]["techStack"].split(", ").map((tech, idx) => (
                        <span key={idx} className="tech-pill">{tech}</span>
                      ))}
                    </div>
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
        className="section-header secondary"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="section-title">
          <span className="title-icon">◈</span> more projects
        </span>
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
              className="projects-card" 
              key={i}
              variants={cardVariants}
              whileHover={{ 
                y: -12,
                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
              }}
            >
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-header">
                  <motion.div 
                    className="folder-icon"
                    whileHover={{ 
                      rotate: 10,
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
                <div className="card-desc">{projects[key]["desc"]}</div>
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
