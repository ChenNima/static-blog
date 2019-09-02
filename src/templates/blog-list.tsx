import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ReactPaginate from "react-paginate";
// import '../css/index.css'; // add some style if you want!

interface Props {
  data: any;
  pageContext: {
    currentPage: number;
    limit: number;
    numPages: number;
    skip: number;
  }
}

export default function BlogList({ data, pageContext }: Props) {
  const { currentPage, numPages } = pageContext;
  debugger;
  const { edges: posts } = data.allMarkdownRemark
  return (
    <Layout>
      <SEO title="list"/>
      <div className="blog-posts">
        {posts
          .filter((post: any)=> post.node.frontmatter.title.length > 0)
          .map(({ node: post }: { node: any }) => {
            return (
              <div className="blog-post-preview" key={post.id}>
                <h1>
                  <Link to={post.frontmatter.path}>{post.frontmatter.title}</Link>
                </h1>
                <h2>{post.frontmatter.date}</h2>
                <p>{post.excerpt}</p>
              </div>
            )
          })}
          <ReactPaginate
            pageCount={numPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
          />
        </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query IndexQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: $limit
      skip: $skip
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
`