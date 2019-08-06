import { MainLayout } from '@layouts'
import * as React from 'react'

import { PostList } from '@components/molecules'

const Home: React.FunctionComponent = () => {
  return (
    <MainLayout>
      <PostList />
    </MainLayout>
  )
}

export default Home
