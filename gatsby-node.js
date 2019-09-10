const path = require("path")
exports.createPages = async arg => {
  const blogTemplate = path.resolve(`src/templates/blog-post.tsx`);
  const resumeTemplate = path.resolve(`src/templates/resume.tsx`);
  await createMarkdownPages("resume", resumeTemplate)(arg)
  const posts = await createMarkdownPages("blog", blogTemplate)(arg)
  createBlogList(arg, posts)
}


const createMarkdownPages = (type, template) => async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const result = await graphql(`
    {
      allMarkdownRemark(sort: {order: DESC, fields: [frontmatter___date]}, limit: 1000,
        filter: {frontmatter: {type: {eq: "${type}"}}}) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `)
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: template,
      context: {}, // additional data can be passed via context
    })
  })
  const posts = result.data.allMarkdownRemark.edges
  return posts;
}

const createBlogList = ({ actions }, posts) => {
  const postsPerPage = 6
  const numPages = Math.ceil(posts.length / postsPerPage)
  Array.from({ length: numPages }).forEach((_, i) => {
    actions.createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: path.resolve("./src/templates/blog-list.tsx"),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    })
  })
}