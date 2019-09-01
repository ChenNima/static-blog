import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
// import '../css/blog-post.css'; // make it pretty!
function Template({ data, className }) {
  const { markdownRemark: post } = data // data.markdownRemark holds our post data
  return (
    <Layout>
      <SEO title={post.frontmatter.title}/>
      <div className={`blog-post-container ${className}`}>
        <Helmet title={`Your Blog Name - ${post.frontmatter.title}`} />
        <div className="blog-post">
          <h1 className="title">{post.frontmatter.title}</h1>
          <hr />
          <p className="date">{post.frontmatter.date}</p>
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </div>
    </Layout>
  )
}

export default styled(Template)`
  .title {
    text-align: center;
  }
  .date {
    text-align: center;
    color: #8c8c8c
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