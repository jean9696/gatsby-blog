import { Link } from 'gatsby'
import styled from 'styled-components'

import { fontSizes, theme } from '@habx/thunder-ui'

export const PostLinkContainer = styled(Link)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  position: relative;
  &:before {
    position: absolute;
    content: '';
    height: 100px;
    top: 24px;
    width: 2px;
    left: 0;
    background: ${theme.get('primary')};
  }
`
export const PostLinkTitle = styled.h3``

export const PostLinkSubTitle = styled.h5`
  color: ${theme.get('neutralLight')};
  margin-bottom: 16px;
`

export const PostLinkAbstract = styled.p`
  max-width: 500px;
`

export const CallToAction = styled.span`
  color: ${theme.get('primary')};
  text-align: right;
  i {
    vertical-align: middle;
    font-size: ${fontSizes.regular};
  }
`
