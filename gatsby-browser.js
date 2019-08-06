import React from 'react'

import GlobalStyle from './src/context/style'
import Thunder from './src/context/Thunder'
require('prismjs/themes/prism-tomorrow.css')
require('material-icons/iconfont/material-icons.css')

export const wrapRootElement = ({ element }) => ( // eslint-disable-line
  <Thunder>
    {element}
    <GlobalStyle />
  </Thunder>
)
