import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CarouselViewProps } from '../../model/types'

const CarouselView = ({ images, title, carouselRef, isBackground }: CarouselViewProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  // 카드 바뀔 때마다 스크롤 초기화 + 인덱스 초기화
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0
    }
    setActiveIndex(0)
  }, [images.join('')])

  // 스크롤 감지해서 인덱스 계산
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft
    const itemWidth = e.currentTarget.getBoundingClientRect().width - 100 // item width + padding (px-2)
    const newIndex = Math.round(scrollLeft / itemWidth)
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < images.length) {
      setActiveIndex(newIndex)
    }
  }

  return (
    <>
      {isBackground ? (
        <div className="relative m-auto w-full py-1">
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={images[0]}
              alt={`${title} 1`}
              className="h-full w-full object-cover object-center"
              draggable={false}
            />
          </div>
        </div>
      ) : (
        <div className="relative w-full overflow-visible">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto"
            style={{
              marginLeft: '-20px',
              marginRight: '-20px',
              paddingLeft: '40px',
              paddingRight: '100px',
              width: 'calc(100% + 40px)',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {images.map((url, imgIndex) => (
              <div
                key={imgIndex}
                className="relative w-[120%] max-w-[440px] flex-none snap-center p-1"
              >
                <div className="aspect-video w-full overflow-hidden rounded-lg shadow-[0_0_12px_rgba(0,0,0,0.3)]">
                  <motion.div
                    className="h-full w-full"
                    animate={{
                      opacity: imgIndex === activeIndex ? 1 : 0.4,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: 'easeIn',
                    }}
                  >
                    <img
                      src={url}
                      alt={`${title} ${imgIndex + 1}`}
                      className="aspect-video w-full object-cover object-center"
                      draggable={false}
                    />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default CarouselView
