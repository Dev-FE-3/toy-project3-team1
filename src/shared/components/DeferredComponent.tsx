import { PropsWithChildren, useEffect, useState } from 'react'

export const DeferredComponent = ({ children }: PropsWithChildren<{}>) => {
  const [isDeferred, setIsDeferred] = useState(false)

  useEffect(() => {
    // 300ms 지난 후 children Render
    const timeoutId = setTimeout(() => {
      setIsDeferred(true)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  if (!isDeferred) {
    return null
  }

  return <>{children}</>
}
