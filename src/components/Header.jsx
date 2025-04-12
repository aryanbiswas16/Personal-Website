import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import ArticleIcon from '@mui/icons-material/Article';
import "../styles/Header.css";
function Header() {
  return (
    <Navbar fixed="top" variant="dark" expand="lg" className="py-3">
      <Container>
        <Navbar.Brand href="#" className="fs-2">Aryan Biswas</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#experience">Experience</Nav.Link>
            <Nav.Link href="#projects">Projects</Nav.Link>
            <Nav.Link href="#skills">Skills</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link href="mailto:your.email@example.com">
              <EmailIcon style={{ fontSize: 20 }} />
            </Nav.Link>
            <Nav.Link href="https://github.com/yourusername" target="_blank">
              <GitHubIcon style={{ fontSize: 19 }} />
            </Nav.Link>
            <Nav.Link href="https://linkedin.com/in/yourusername" target="_blank">
              <LinkedInIcon style={{ fontSize: 21 }} />
            </Nav.Link>
            <Nav.Link href="https://your-blog-url.com" target="_blank">
              <ArticleIcon style={{ fontSize: 20 }} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;