import * as React from 'react'

import { Title } from '@habx/thunder-ui'

import { MainLayoutContainer, MainLayoutHeader } from './MainLayout.style'

const MainLayout: React.FunctionComponent = ({ children }) => (
  <MainLayoutContainer>
    <MainLayoutHeader>
      <Title>Blog</Title>
    </MainLayoutHeader>
    {children}
  </MainLayoutContainer>
)

export default MainLayout
