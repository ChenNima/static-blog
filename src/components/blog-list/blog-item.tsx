import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

const BlogItem = ({ blog, className }: { blog: Blog } & StyledComponentProps) => (
  <div className={`blog-post-preview ${className}`}>
    <h1 className="title-line">
      <span className="angle-brackets">&lt;</span>
      <Link to={blog.frontmatter.path} className="title">{blog.frontmatter.title}</Link>
      <span className="angle-brackets">/&gt;</span>
    </h1>
    <h4 className="date">
      <span className="oi oi-calendar"/>
      {blog.frontmatter.date}
    </h4>
    <div className="d-flex excerpt-container">
      <span className="oi oi-double-quote-serif-left"/>
      <p className="excerpt">{blog.excerpt}</p>
      <span className="oi oi-double-quote-serif-right align-self-end"/>
    </div>
  </div>
)

export default styled(BlogItem)`
  margin: 30px 0 70px;
  .title {
    text-decoration: none;
  }
  .date {
    text-transform: capitalize;
  }
  .angle-brackets {
    color: #e2e2e2;
    font-size: 1.5rem;
    transition: 0.3s;
  }
  .title-line:hover {
    .angle-brackets {
      color: #d38ce4;
    }
  }
  .oi-calendar {
    color: #e2e2e2;
    font-size: 1.3rem;
    transition: 0.3s;
  }
  .excerpt-container {
    .excerpt {
      transition: 0.3s;
      line-height: 2;
      padding-left: 1rem;
      margin: 0;
    }
    .oi {
      transition: 0.3s;
      color: #e2e2e2;
    }
  }
  &:hover {
    .oi-calendar {
      color: #ff8e8e
    }
    .excerpt-container {
      .excerpt {
        color: black;
      }
      .oi {
        color: #d38ce4;
      }
    }
  }
`;