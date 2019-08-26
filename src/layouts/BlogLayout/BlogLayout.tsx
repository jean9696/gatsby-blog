import { graphql } from 'gatsby'
import * as React from 'react'

import { FontIcon } from '@habx/thunder-ui'

import { PostLink } from '@components/atoms'

import Footer from '../Footer'

import {
  BackLink,
  BlogLayoutContainer,
  BlogLayoutContent,
  BlogLayoutDate,
  BlogLayoutMinutes,
  BlogLayoutTitle,
} from './BlogLayout.style'
import { blogLayoutMarkdown } from './types/blogLayoutMarkdown'
import { OtherPost } from './types/OtherPost'
const BlogLayout: React.FunctionComponent<{
  data: blogLayoutMarkdown
  pageContext: { otherPost: OtherPost }
}> = ({ data, pageContext }) => {
  const { otherPost } = pageContext
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark
  return (
    <React.Fragment>
      <BlogLayoutContainer>
        <BackLink to="/">
          <FontIcon icon="arrow_back" />
        </BackLink>
        <BlogLayoutTitle>{frontmatter.title}</BlogLayoutTitle>
        <BlogLayoutDate>{frontmatter.date}</BlogLayoutDate>
        <BlogLayoutMinutes>
          {markdownRemark.timeToRead} minutes to read 🕐
        </BlogLayoutMinutes>
        <BlogLayoutContent dangerouslySetInnerHTML={{ __html: html }} />
        <PostLink post={otherPost} />
      </BlogLayoutContainer>
      <Footer />
    </React.Fragment>
  )
}

export default BlogLayout

export const pageQuery = graphql`
  query blogLayoutMarkdown($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      timeToRead
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`
