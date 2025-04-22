import { AnimatePresence, motion } from 'framer-motion'
import { type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const SkeletonAnimation = ({ children }: Props) => {
  return (
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
  )
}

export default SkeletonAnimation
