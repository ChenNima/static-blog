import React from "react"
import { graphql, Link } from "gatsby"
import styled from "styled-components"
import SEO from "../components/seo"
import withLayout from "../util/HOC/withLayout"
import Markdown from "../components/blog-post/markdown"

interface Props {
  data: {
    markdownRemark: Blog
  }
}

function ResumeSIV({ data, className }: Props & StyledComponentProps) {
  const { markdownRemark: post } = data
  const resumeLink = post.frontmatter.lang === "en" ?
  {
    text: "中文版版>>",
    path: "/resume"
  } :
  {
    text: "English version>>",
    path: "/resume-en"
  }
  return (
    <>
      <SEO title={post.frontmatter.title} description={post.excerpt}/>
      <div className={`blog-post-container ${className}`}>
        <div className="blog-post">
          <Link
            to={resumeLink.path}
            className="switch"
          >
            {resumeLink.text}
          </Link>
          <Markdown
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </div>
    </>
  )
}

const ResumeSIVwithLayout = withLayout(ResumeSIV);

export default styled(ResumeSIVwithLayout)`
  .title {
    text-align: center;
  }
  .switch {
    position: absolute;
    right: 1rem;
  }
`

export const pageQuery = graphql`
  query ResumeByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      excerpt(pruneLength: 250)
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        lang
      }
    }
  }
`