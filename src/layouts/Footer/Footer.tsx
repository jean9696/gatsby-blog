import * as React from 'react'

import { FooterContainer } from './Footer.style'

const Footer: React.FunctionComponent = () => (
  <FooterContainer>Jean Dessane - © {new Date().getFullYear()}</FooterContainer>
)

export default Footer
