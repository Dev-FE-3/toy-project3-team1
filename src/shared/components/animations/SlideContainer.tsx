import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export interface SlideContainerProps {
  children: ReactNode
  direction?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
  stiffness?: number
  damping?: number
  duration?: number
  animationType?: 'spring' | 'tween'
  initialVisible?: boolean
}

/**
 * 슬라이드 애니메이션을 가진 컨테이너 컴포넌트
 * 다양한 방향으로 슬라이드 인/아웃 애니메이션을 적용할 수 있습니다.
 */
export const SlideContainer = ({
  children,
  direction = 'right',
  className = '',
  stiffness = 300,
  damping = 30,
  duration = 0.3,
  animationType = 'spring',
  initialVisible = false,
}: SlideContainerProps) => {
  // 방향에 따른 애니메이션 속성 설정
  const getInitialPosition = () => {
    switch (direction) {
      case 'left':
        return { x: '-100%' }
      case 'right':
        return { x: '100%' }
      case 'top':
        return { y: '-100%' }
      case 'bottom':
        return { y: '100%' }
      default:
        return { x: '100%' }
    }
  }

  // 애니메이션 타입에 따른 트랜지션 설정
  const getTransition = () => {
    if (animationType === 'spring') {
      return {
        type: 'spring',
        stiffness,
        damping,
      }
    }

    return {
      type: 'tween',
      duration,
      ease: 'easeInOut',
    }
  }

  const transition = getTransition()
  const initialPosition = getInitialPosition()
  const exitPosition = initialPosition

  return (
    <motion.div
      initial={initialVisible ? { x: 0, y: 0 } : initialPosition}
      animate={{ x: 0, y: 0 }}
      exit={exitPosition}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}
