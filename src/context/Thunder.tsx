import * as React from 'react'

import { ThunderProvider, Spotlight } from '@habx/thunder-ui'

const Thunder: React.FunctionComponent = ({ children }) => {
  return (
    <ThunderProvider>
      {children}
      <Spotlight />
    </ThunderProvider>
  )
}

export default Thunder
