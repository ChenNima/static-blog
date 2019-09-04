import { Link } from "gatsby"
import PropTypes from "prop-types"
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
      <Navbar.Brand href="/" className="d-flex align-items-center">
        <div className="image-container">
          <Image />
        </div>
        <Link
          to="/"
          className="site-title nav-link"
        >
          {siteTitle}
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link>
            <Link
              to="/blog"
              className="nav-link blog-link"
            >
              博客
            </Link>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default styled(Header)`
  padding-top: 18px !important;
  padding-bottom: 18px !important;
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
`
