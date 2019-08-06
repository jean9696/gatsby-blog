import { graphql, useStaticQuery } from 'gatsby'
import * as React from 'react'

import { PostLink } from '@components/atoms'

import { blogPosts_allMarkdownRemark } from './types/blogPosts'

const PostList: React.FunctionComponent = () => {
  const data = useStaticQuery<{
    allMarkdownRemark: blogPosts_allMarkdownRemark
  }>(blogPostQuery)
  return (
    <React.Fragment>
      {data.allMarkdownRemark.nodes.map(post => {
        return (
          <div key={post.id}>
            <PostLink post={post} />
          </div>
        )
      })}
    </React.Fragment>
  )
}

export default PostList

export const blogPostQuery = graphql`
  query blogPosts {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 1000
    ) {
      nodes {
        id
        frontmatter {
          title
          path
          date(formatString: "MMMM DD, YYYY")
        }
        timeToRead
        excerpt
      }
    }
  }
`
