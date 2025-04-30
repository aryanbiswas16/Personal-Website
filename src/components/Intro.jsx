import React, { useEffect, useState } from "react";
import "../styles/Intro.css";
import avatarImage from "../assets/avatar.png";
import { motion } from "framer-motion";

const Intro = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
    },
    text: {
      height: 150,
      width: 150,
      x: mousePosition.x - 75,
      y: mousePosition.y - 75,
      backgroundColor: "rgba(64, 224, 208, 0.1)",
      mixBlendMode: "difference"
    }
  };

  const textEnter = () => setCursorVariant("text");
  const textLeave = () => setCursorVariant("default");

  return (
    <div className="page-container">
      <motion.div 
        className="cursor"
        variants={variants}
        animate={cursorVariant}
      />
      <div id="intro">
        <motion.div 
          className="intro-text-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onMouseEnter={textEnter}
          onMouseLeave={textLeave}
        >
          <div className="intro-title-container">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              hi,
            </motion.span>
            <motion.span 
              className="intro-name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Aryan
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              here.
            </motion.span>
          </div>
          <motion.div 
            className="intro-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            I create stuff sometimes.
          </motion.div>
          <motion.div 
            className="intro-desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            I'm a software engineer based in Toronto. I'm passionate about
            building software that makes a difference. I focus on creating
            efficient, scalable, and user-friendly solutions.
          </motion.div>
          <motion.a 
            href="mailto:aryanbiswas16@gmail.com" 
            className="intro-contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(64, 224, 208, 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Say hi!
          </motion.a>
        </motion.div>
        <motion.img 
          src={avatarImage} 
          alt="Avatar" 
          className="intro-avatar"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
        />
      </div>
    </div>
  );
};

export default Intro;