import { AspectRatio } from '@/shared/components/ui/aspect-ratio'

interface VideoPlayerProps {
  videoId: string
}

const VideoPlayer = ({ videoId }: VideoPlayerProps) => {
  return (
    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-slate-900">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </AspectRatio>
  )
}

export default VideoPlayer
