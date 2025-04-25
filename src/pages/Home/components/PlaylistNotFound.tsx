import { Button } from '@/shared/components/ui/button'
import { AlertTriangle } from 'lucide-react'

const PlaylistNotFound = () => {
  return (
    <div className="bg-c900 relative flex h-full flex-col items-center justify-center gap-12 py-4">
      <div className="flex flex-col items-center justify-center">
        <AlertTriangle size={48} className="text-c400 mb-4" />
        <h3 className="text-c300 text-h3 mb-2">무언가 잘못된 것 같아요</h3>
        <p className="text-c400 text-textR">새로고침 해주세요</p>
      </div>
      <Button
        variant="outline"
        type="button"
        onClick={() => window.location.reload()}
        className="bg-c600 text-c200 h-10"
      >
        새로고침
      </Button>
    </div>
  )
}

export default PlaylistNotFound
