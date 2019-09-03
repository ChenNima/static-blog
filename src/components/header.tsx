import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { Navbar, Container } from "react-bootstrap"
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
          className="site-title"
        >
          {siteTitle}
        </Link>
      </Navbar.Brand>
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
  .image-container {
    width: 60px;
    margin-right: 10px;
  }
  .site-title {
    color: white;
    font-size: 1.2rem;
    margin-bottom: -0.3rem;
    text-decoration: none;
  }
`
