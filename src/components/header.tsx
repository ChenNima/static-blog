import { Link } from "gatsby"
import React from "react"
import { Navbar, Container, Nav } from "react-bootstrap"
import Image from "./image";
import styled from "styled-components"

interface Props {
  siteTitle: string;
  className?: string;
}
const Header = ({ siteTitle, className }: Props) => (
  <Navbar bg="dark" variant="dark" className={className} fixed="top">
    <Container>
      <Link to="/" className="d-flex align-items-center navbar-brand">
        <div className="image-container">
          <Image />
        </div>
        <span
          className="site-title nav-link"
        >
          {siteTitle}
        </span>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link
            to="/blog"
            className="nav-link blog-link nav-link"
          >
            博客
          </Link>
        </Nav>
        <Nav className="mr-auto">
          <Link
            to="/resume"
            className="nav-link blog-link nav-link"
          >
            简历
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
)

export default styled(Header)`
  padding-top: .5rem !important;
  padding-bottom: .5rem !important;
  .navbar-brand {
    margin-right: 0;
  }
  .image-container {
    margin-top: -5px;
    width: 60px;
    margin-right: 5px;
  }
  .site-title {
    font-size: 1.2rem;
  }
  .blog-link {
    font-size: 1rem;
  }
  .nav-link {
    color: white;
    text-decoration: none;
  }
  .navbar-nav {
    margin: 0 !important;
  }
`
