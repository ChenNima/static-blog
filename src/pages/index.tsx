import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import BlogItem from "../components/blog-list/blog-item";
import SEO from "../components/seo"
import withLayout from "../util/HOC/withLayout";

const IndexPage = () => {

  const data: {allMarkdownRemark: MarkdownRemark<Blog>} = useStaticQuery(graphql`
    query IndexQuery {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 10
        skip: 0
        filter: {frontmatter: {type: {eq: "blog"}}}
      ) {
        edges {
          node {
            excerpt(pruneLength: 250)
            id
            frontmatter {
              title
              date(formatString: "MMMM DD, YYYY")
              path
            }
          }
        }
      }
    }
  `);
  const { edges: posts } = data.allMarkdownRemark
  return (
    <>
      <SEO title="首页" />
      <div className="d-flex justify-content-between">
        <h1 className="m-0">最新博客</h1>
        <Link to="/blog" className="align-self-end">更多&gt;&gt;</Link>
      </div>
      <hr />
      {posts
        .filter((post)=> post.node.frontmatter.title.length > 0)
        .map(({ node: post }) => <div key={post.id} ><BlogItem blog={post} /></div>)
      }
    </>
  )
}

export default withLayout(IndexPage)
