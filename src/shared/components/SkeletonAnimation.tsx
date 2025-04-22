import { AnimatePresence, motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { DeferredComponent } from './DeferredComponent'

type Props = {
  children: ReactNode
}

const SkeletonAnimation = ({ children }: Props) => {
  return (
    <DeferredComponent>
      {/* DeferredComponent : 0.3초 이상 지연이 걸릴 때 스켈레톤 UI 렌더 */}
      <AnimatePresence mode="wait">
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 top-27 z-10"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </DeferredComponent>
  )
}

export default SkeletonAnimation
