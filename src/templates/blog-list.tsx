import React from "react"
import { graphql, navigateTo } from "gatsby"
import SEO from "../components/seo"
import Pagination from "../components/pagination"
import BlogItem from "../components/blog-list/blog-item"
import withLayout from "../util/HOC/withLayout";

interface Props {
  data: {
    allMarkdownRemark: {
      edges: {node: Blog}[]
    }
  };
  pageContext: {
    currentPage: number;
    limit: number;
    numPages: number;
    skip: number;
  }
}

function BlogList({ data, pageContext }: Props) {
  const { currentPage, numPages } = pageContext;
  const { edges: posts } = data.allMarkdownRemark
  return (
    <>
      <SEO title="博客列表"/>
      <div className="blog-posts">
        {posts
          .filter((post)=> post.node.frontmatter.title.length > 0)
          .map(({ node: post }) => <div key={post.id} ><BlogItem blog={post} /></div>)
        }
      </div>
      <div className="d-flex justify-content-center mt-5">
        <Pagination currentPage={currentPage} pageCount={numPages} onPageClick={page => navigateTo(`blog/${page === 1 ? '' : page}`)}/>
      </div>
    </>
  )
}

export default withLayout(BlogList);

export const pageQuery = graphql`
  query ListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: $limit
      skip: $skip
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
`