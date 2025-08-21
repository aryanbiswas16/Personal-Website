import React from "react";
import "../styles/Showcase.css";
import FolderOpenRounded from "@mui/icons-material/FolderOpenRounded";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Carousel from "react-bootstrap/Carousel";
import ExternalLinks from "./ExternalLinks.jsx";
import { motion } from "framer-motion";
import horrorgameImg from "../assets/horrorgame.png";
import skip from "../assets/Skip_the Dishes.png";

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
    }
  };
  const projects = {
    "TDSB Homework Management Interface": {
      desc:
        "An application created for Toronto District School Board, with a Flask back-end and a Vue front-end.",
      techStack: "Python (Flask), Vue.js, Bootstrap, SQL",
      link: "https://github.com/gazijarin/TDSBHomeworkManagement",
      open: "https://tdsb-app.herokuapp.com/"
    },
    "Adam A.I.": {
      desc:
        "A self-learning A.I. that learns to traverse through a complex maze using the genetic algorithm.",
      techStack: "Javascript, HTML / CSS",
      link: "https://github.com/gazijarin/adamai",
      open: "https://gazijarin.github.io/AdamAI/"
    },
    "Distributed Logging and Monitoring System": {
      desc:
        "A system that establishes an ORM connection to a Prisma client in order to communicate logs from microservices.",
      techStack: "Node.js (Express.js), React.js, PostgreSQL",
      link:
        "https://github.com/gazijarin/Distributed-Logging-and-Monitoring-System"
    },
    "Odin Bot": {
      desc:
        "A Telegram bot that helps you excel on your daily tasks through Node NLP.",
      techStack: "Javascript, Node.js, Natural NLP, Telegram API",
      link: "https://github.com/gazijarin/OdinBot",
      open: ""
    },
    "Game Centre": {
      desc:
        "An Android app consisting of three board games, including multiplayer, autosave, user authentication, etc.",
      techStack: "Java, Android Studio",
      link: "https://github.com/gazijarin/gamecentre",
      open: ""
    },
    "Minimax Stonehenge": {
      desc:
        "Two-player, zero-sum game with a strategic Minimax artificial intelligence.",
      techStack: "Python",
      link: "https://github.com/gazijarin/stonehenge",
      open: ""
    }
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
              className="projects-card" 
              key={i}
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
              }}
            >
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
              <div className="card-desc">{projects[key]["desc"]}</div>
              <div className="card-tech">{projects[key]["techStack"]}</div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default Showcase;