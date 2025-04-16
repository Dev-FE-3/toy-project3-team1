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
  /** 삭제할 플레이리스트 제목 */
  title: string
  /** 모달의 제목 */
  modalTitle?: string
  /** 삭제 설명 문구 */
  description?: string
  /** 취소 버튼 텍스트 */
  cancelText?: string
  /** 확인 버튼 텍스트 */
  confirmText?: string
}

const DEFAULT_TEXTS = {
  modalTitle: '플레이리스트 삭제',
  description: '다음 플레이리스트를 삭제하시겠습니까?\n삭제된 플레이리스트는 복구할 수 없습니다.',
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
}: DeleteConfirmModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogTrigger asChild />
      <AlertDialogContent className="bg-c900 border-c700 w-[456px]">
        <AlertDialogHeader className="gap-3">
          <AlertDialogTitle className="text-c100 text-lg font-bold">{modalTitle}</AlertDialogTitle>
          <AlertDialogDescription className="text-c300 text-sm whitespace-pre-line">
            {description}
          </AlertDialogDescription>
          {title && (
            <div className="mt-3">
              <div className="bg-c700/30 rounded-lg p-3">
                <span className="text-c100 line-clamp-2 font-medium">{title}</span>
              </div>
            </div>
          )}
        </AlertDialogHeader>
        <div className="mt-6 space-y-2">
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red active:bg-red/80 w-full rounded-xl py-3.5 text-base font-medium text-white"
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
