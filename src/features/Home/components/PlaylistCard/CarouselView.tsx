import { motion, AnimatePresence } from 'framer-motion'

export interface CarouselViewProps {
  images: string[]
  title: string
  currentIndex: number
  carouselRef: React.RefObject<HTMLDivElement>
  setCurrentImageIndex: (index: number) => void // 추가
}

const CarouselView = ({
  images,
  title,
  currentIndex,
  carouselRef,
  setCurrentImageIndex, // 추가
}: CarouselViewProps) => {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const scrollLeft = container.scrollLeft
    const itemWidth = container.offsetWidth
    const newIndex = Math.round(scrollLeft / itemWidth)
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
      setCurrentImageIndex(newIndex)
    }
  }

  return (
    <div className="relative w-full overflow-visible">
      <div
        ref={carouselRef}
        className=" no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto"
        style={{
          marginLeft: '-20px',
          marginRight: '-20px',
          paddingLeft: '50px',
          paddingRight: '100px',
          width: 'calc(100% + 40px)',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
        onScroll={handleScroll}
      >
        {images.map((url, imgIndex) => (
          <div key={imgIndex} className="relative w-[400px] flex-none snap-center px-2">
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <motion.div
                className="h-full w-full"
                animate={{
                  opacity: imgIndex === currentIndex ? 1 : 0.4,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              >
                <img
                  src={url}
                  alt={`${title} ${imgIndex + 1}`}
                  className="h-full w-full object-cover object-center"
                  draggable={false}
                />
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default CarouselView