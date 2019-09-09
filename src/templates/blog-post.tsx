import React from "react"
import { graphql } from "gatsby"
import styled, { keyframes } from "styled-components"
import SEO from "../components/seo"
import withLayout from "../util/HOC/withLayout"
import Markdown from "../components/blog-post/markdown"

interface Props {
  data: {
    markdownRemark: Blog
  }
}

function BlogSIV({ data, className }: Props & StyledComponentProps) {
  const { markdownRemark: post } = data // data.markdownRemark holds our post data
  return (
    <>
      <SEO title={post.frontmatter.title}/>
      <div className={`blog-post-container ${className}`}>
        <div className="blog-post">
          <h1 className="title">{post.frontmatter.title}</h1>
          <hr className="divider"/>
          <p className="date">{post.frontmatter.date}</p>
          <Markdown
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </div>
    </>
  )
}

const BlogSIVwithLayout = withLayout(BlogSIV);

const expend = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const fade = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export default styled(BlogSIVwithLayout)`
  .title {
    text-align: center;
  }
  .date {
    text-align: center;
    color: #8c8c8c;
    animation: ${fade} 1s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .divider {
    animation: ${expend} 1s cubic-bezier(0.4, 0, 0.2, 1);
  }
`

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`