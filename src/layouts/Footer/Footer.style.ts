import styled from 'styled-components'

import { fontSizes, theme } from '@habx/thunder-ui'

export const FooterContainer = styled.footer`
  background: ${theme.get('primary')};
  padding: 8px 32px;
  font-size: ${fontSizes.small};
  color: ${theme.get('neutralLight')};
  text-align: right;
`
