import { MoreVertical } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/shared/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer'
import { cn } from '@/shared/model/lib/utils'
import { playlistCollectionService } from '../services/playlistCollectionService'
import { DeleteConfirmModal } from './DeleteConfirmModal'

interface PlaylistMoreMenuProps {
  playlistId: string
  title: string
  className?: string
  onDelete?: () => void
  isSubscribed?: boolean
  onUnsubscribe?: () => Promise<void>
}

export default function PlaylistMoreMenu({
  playlistId,
  title,
  className,
  onDelete,
  isSubscribed = false,
  onUnsubscribe,
}: PlaylistMoreMenuProps) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeletePlaylistModalOpen, setIsDeletePlaylistModalOpen] = useState(false)

  const handleDeletePlaylist = async () => {
    try {
      await playlistCollectionService.deletePlaylist(playlistId)
      onDelete?.()
      setIsOpen(false)
    } catch (error) {
      alert(error instanceof Error ? error.message : '플레이리스트 삭제 중 오류가 발생했습니다.')
    }
  }

  const subscribedMenuItems = [
    {
      label: '구독 취소하기',
      onClick: async () => {
        try {
          await playlistCollectionService.unsubscribePlaylist(playlistId)
          onUnsubscribe?.()
          setIsOpen(false)
        } catch (error) {
          alert(error instanceof Error ? error.message : '구독 취소 중 오류가 발생했습니다.')
        }
      },
    },
  ]

  const ownerMenuItems = [
    {
      label: '편집하기',
      onClick: () => {
        navigate(`/playlist/edit/${playlistId}`)
        setIsOpen(false)
      },
    },
    {
      label: '삭제하기',
      onClick: () => {
        setIsDeletePlaylistModalOpen(true)
        setIsOpen(false)
      },
    },
  ]

  const menuItems = isSubscribed ? subscribedMenuItems : ownerMenuItems

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-4 w-4 cursor-pointer rounded-full p-0', className)}
          >
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">더 보기 메뉴</span>
          </Button>
        </DrawerTrigger>

        <DrawerContent className="bg-c600 text-c100 mx-auto w-[440px] rounded-t-xl">
          <DrawerHeader className="p-0">
            <DrawerTitle className="sr-only">더보기 메뉴</DrawerTitle>
            <div className="flex flex-col gap-1 px-4 py-3">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className="hover:bg-c700 hover:text-c50 cursor-pointer rounded-lg px-4 py-3 text-left transition-colors"
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </DrawerHeader>
          <DrawerFooter className="mt-5 p-0" />
        </DrawerContent>
      </Drawer>

      <DeleteConfirmModal
        isOpen={isDeletePlaylistModalOpen}
        onClose={() => setIsDeletePlaylistModalOpen(false)}
        onConfirm={handleDeletePlaylist}
        title={title}
      />
    </>
  )
}
