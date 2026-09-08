import React, { Suspense } from 'react'

const DevtoolsPanel = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import('@tanstack/react-query-devtools').then((res) => ({
        default: res.ReactQueryDevtoolsPanel,
      })),
    )

export default {
  name: 'Tanstack Query',
  render: (
    <Suspense fallback={null}>
      <DevtoolsPanel />
    </Suspense>
  ),
}
