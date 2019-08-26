const path = require(`path`)
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/layouts/BlogLayout/BlogLayout.tsx`)
  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: ASC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          previous {
            frontmatter {
              title
              path
              date(formatString: "MMMM DD, YYYY")
            }
            timeToRead
            excerpt
          }
          next {
            frontmatter {
              title
              path
              date(formatString: "MMMM DD, YYYY")
            }
            timeToRead
            excerpt
          }
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }
    return result.data.allMarkdownRemark.edges.forEach(
      ({ node, previous, next }) => {
        createPage({
          path: node.frontmatter.path,
          component: blogPostTemplate,
          context: {
            otherPost: next ? next : previous,
          },
        })
      }
    )
  })
}
