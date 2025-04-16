import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  /** 삭제할 항목의 제목 */
  title: string
  /** 모달의 제목 */
  modalTitle?: string
  /** 삭제 설명 문구 */
  description?: string
  /** 취소 버튼 텍스트 */
  cancelText?: string
  /** 확인 버튼 텍스트 */
  confirmText?: string
  /** 버튼 스타일 variant */
  variant?: 'default' | 'destructive'
  /** 삭제 항목 표시 박스의 배경색 */
  titleBoxClassName?: string
}

const DEFAULT_TEXTS = {
  modalTitle: '삭제 안내',
  description: '다음 영상을 플레이리스트에서 삭제하시겠습니까?',
  confirmText: '삭제',
  cancelText: '취소',
} as const

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  modalTitle = DEFAULT_TEXTS.modalTitle,
  description = DEFAULT_TEXTS.description,
  confirmText = DEFAULT_TEXTS.confirmText,
  cancelText = DEFAULT_TEXTS.cancelText,
  variant = 'destructive',
  titleBoxClassName = 'bg-c700/30',
}: DeleteConfirmModalProps) {
  const getActionClassName = () => {
    if (variant === 'destructive') {
      return 'bg-red text-white active:bg-red/80'
    }
    return 'bg-c700 text-c100 active:bg-c500'
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogTrigger asChild />
      <AlertDialogContent className="bg-c800 rounded-2xl p-5" style={{ maxWidth: 464 }}>
        <AlertDialogHeader className="gap-3">
          <AlertDialogTitle className="text-c100 text-lg font-bold">{modalTitle}</AlertDialogTitle>
          <AlertDialogDescription className="text-c300 text-sm">
            {description}
          </AlertDialogDescription>
          {title && (
            <div className="mt-3">
              <div className={`rounded-lg ${titleBoxClassName} p-3`}>
                <span className="text-c100 line-clamp-2 font-medium">{title}</span>
              </div>
            </div>
          )}
        </AlertDialogHeader>
        <div className="mt-6 space-y-2">
          <AlertDialogAction
            onClick={onConfirm}
            className={`${getActionClassName()} w-full rounded-xl py-3.5 text-base font-medium`}
          >
            {confirmText}
          </AlertDialogAction>
          <AlertDialogCancel className="bg-c700 text-c100 active:bg-c500 mt-0 w-full rounded-xl border-0 py-3.5 text-base font-medium">
            {cancelText}
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
