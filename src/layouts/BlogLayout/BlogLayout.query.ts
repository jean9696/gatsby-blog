import { graphql } from 'gatsby'

export const BlogLayoutOtherPostFragment = graphql`
  fragment OtherPost on MarkdownRemark {
    frontmatter {
      title
      path
      date(formatString: "MMMM DD, YYYY")
    }
    timeToRead
    excerpt
  }
`
