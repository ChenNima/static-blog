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
    <h3>
      <span className="oi oi-calendar"/>
      {blog.frontmatter.date}
    </h3>
    <p className="excerpt">{blog.excerpt}</p>
  </div>
)

export default styled(BlogItem)`
  margin: 30px 0 40px;
  .title {
    text-decoration: none;
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
  .excerpt {
    line-height: 2;
    transition: 0.3s;
  }
  &:hover {
    .oi-calendar {
      color: #ff8e8e
    }
    .excerpt {
      color: black;
    }
  }
`;