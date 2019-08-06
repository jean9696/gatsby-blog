import styled from 'styled-components'

import { theme } from '@habx/thunder-ui'

export const BlogLayoutContainer = styled.div`
  margin: 64px auto;
  width: 800px;
`

export const BlogLayoutContent = styled.div`
  margin-bottom: 16px;
  padding-bottom: 32px;
  border-bottom: solid 1px ${theme.get('neutralLight')};
  strong {
    position: relative;
    &:after {
      position: absolute;
      content: '';
      height: 3px;
      width: 100%;
      background: ${theme.get('primary')};
      bottom: -3px;
      left: 0;
    }
  }
  p {
    line-height: 30px;
    text-align: justify;
  }
  a {
    color: ${theme.get('primary')};
    font-weight: 500;
    opacity: 0.9;
    transition: all ease-in-out 200ms;
    &:hover {
      opacity: 1;
    }
  }
  h1,
  h2,
  h3 {
    margin: 24px 0;
  }
`

export const BlogLayoutTitle = styled.h1`
  margin-bottom: 32px;
  position: relative;
  &:after {
    position: absolute;
    content: '';
    height: 5px;
    width: 100px;
    background: ${theme.get('primary')};
    bottom: -8px;
    left: 0;
  }
`

export const BlogLayoutDate = styled.h3`
  margin-bottom: 8px;
`

export const BlogLayoutMinutes = styled.p`
  margin-bottom: 32px;
`
