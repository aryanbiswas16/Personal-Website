import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";

const isHorizontal = window.innerWidth < 600;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  if (isHorizontal) {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  } else {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  if (isHorizontal) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`
    };
  } else {
    return {
      id: `vertical-tab-${index}`
    };
  }
}

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: 'transparent',
  display: 'flex',
  height: 300,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(26, 26, 46, 0.4)',
    backdropFilter: 'blur(5px)',
    borderRadius: '10px',
    zIndex: -1
  }
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderRight: `1px solid rgba(64, 224, 208, 0.3)`,
  '& .MuiTab-root': {
    color: '#f9f9f9 !important',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#40E0D0 !important',
      backgroundColor: 'rgba(64, 224, 208, 0.1)'
    }
  },
  '& .Mui-selected': {
    color: '#40E0D0 !important'
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#40E0D0'
  }
}));

const JobList = () => {
  const [value, setValue] = React.useState(0);

  const experienceItems = {
    "TATA Consultancy Services": {
      jobTitle: "Software Developer Intern @",
      duration: "Jan 2024 - PRESENT",
      desc: [
        "Co-developed Figma-to-Angular converter plugin for BMO, scaling from POC to $10M production investment; built component mapping system using AWS Bedrock and Gen AI, reducing UI development time by 70-80%",
        "Implemented automated document translation system for BMO using OCR and image processing to seamlessly translate text in documents and images",
        "Developed data transfer tools for Enbridge's SharePoint migration project, implementing new PowerTools features for end-of-life website upgrade",
        "Built predictive model to identify business banking customer churn risk using XGBoost; developed resume screening tool using semantic vectorization reducing workload by 75%",
        "Led wheelchair automation project using ROS 2, A*/RRT* algorithms and YOLO object detection; created Gen AI powered calorie estimation app with computer vision"
      ]
    },
    "Queen's University": {
      jobTitle: "Teaching Assistant @",
      duration: "Sept 2023 - Dec 2023",
      desc: [
        "Assisted in teaching programming concepts to undergraduate students",
        "Conducted tutorial sessions and provided code review feedback",
        "Helped students debug their code and understand complex programming concepts"
      ]
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Root>
      <StyledTabs
        orientation={!isHorizontal ? "vertical" : null}
        variant={isHorizontal ? "fullWidth" : "scrollable"}
        value={value}
        onChange={handleChange}
      >
        {Object.keys(experienceItems).map((key, i) => (
          <Tab 
            key={i} 
            label={isHorizontal ? `0${i}.` : key} 
            {...a11yProps(i)}
            component={motion.div}
            whileHover={{ x: isHorizontal ? 0 : 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        ))}
      </StyledTabs>
      {Object.keys(experienceItems).map((key, i) => (
        <TabPanel key={i} value={value} index={i}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: value === i ? 1 : 0, y: value === i ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            <span className="joblist-job-title">
              {experienceItems[key]["jobTitle"] + " "}
            </span>
            <span className="joblist-job-company">{key}</span>
            <div className="joblist-duration">
              {experienceItems[key]["duration"]}
            </div>
            <ul className="job-description">
              {experienceItems[key]["desc"].map((descItem, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  {descItem}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </TabPanel>
      ))}
    </Root>
  );
};

export default JobList;