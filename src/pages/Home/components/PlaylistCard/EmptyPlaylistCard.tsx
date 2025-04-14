import { FolderX } from 'lucide-react'

const EmptyPlaylistCard = () => {
  return (
    <div className="bg-c900 relative flex h-[440px] flex-col items-center justify-center py-4">
      <FolderX size={48} className="text-c400 mb-4" />
      <h3 className="text-c300 text-h3 mb-2">플레이리스트가 없습니다</h3>
      <p className="text-c400 text-textR">추가해보는 건 어떨까요?</p>
    </div>
  )
}

export default EmptyPlaylistCard
