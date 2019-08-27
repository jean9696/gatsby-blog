import { createGlobalStyle } from 'styled-components'

import { theme } from '@habx/thunder-ui'

const GlobalStyle = createGlobalStyle<{}>`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: 'Red Hat Display', serif;
    color: ${theme.get('neutralStrong')};
    background: ${theme.get('neutralLightest')};
  }
  
  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
  }
  
  a {
    text-decoration: none;
    font-weight: 500;
    color: inherit;
    
    &:visited {
      color: inherit;
    }
  }

`

export default GlobalStyle
