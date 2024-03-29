import * as React from 'react'

import { Title } from '@habx/thunder-ui'

import Footer from '../Footer'

import { MainLayoutContainer, MainLayoutHeader } from './MainLayout.style'

const MainLayout: React.FunctionComponent = ({ children }) => (
  <React.Fragment>
    <MainLayoutContainer>
      <MainLayoutHeader>
        <Title>A javascript experience</Title>
      </MainLayoutHeader>
      {children}
    </MainLayoutContainer>
    <Footer />
  </React.Fragment>
)

export default MainLayout
