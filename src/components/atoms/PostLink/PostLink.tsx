import * as React from 'react'

import { FontIcon } from '@habx/thunder-ui'

import { PostLinkProps } from './PostLink.interface'
import {
  CallToAction,
  PostLinkAbstract,
  PostLinkContainer,
  PostLinkSubTitle,
  PostLinkTitle,
} from './PostLink.style'

const PostLink: React.FunctionComponent<PostLinkProps> = ({ post }) => {
  return (
    <PostLinkContainer to={post.frontmatter.path}>
      <PostLinkTitle>{post.frontmatter.title}</PostLinkTitle>
      <PostLinkSubTitle>
        {post.frontmatter.date} - {post.timeToRead} min read
      </PostLinkSubTitle>
      <PostLinkAbstract>{post.excerpt}</PostLinkAbstract>
      <CallToAction>
        Read more <FontIcon icon="arrow_forward" />
      </CallToAction>
    </PostLinkContainer>
  )
}

export default PostLink
