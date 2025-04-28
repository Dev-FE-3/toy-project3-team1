import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'

interface NicknameFieldProps {
  nickname: string
  onChange: (value: string) => void
  onCheckDuplicate: () => void
  isChecking: boolean
  availability: 'idle' | 'checking' | 'available' | 'unavailable'
  isValidFormat: boolean
  isSameAsCurrent: boolean
}

export const NicknameField = ({
  nickname,
  onChange,
  onCheckDuplicate,
  isChecking,
  availability,
  isValidFormat,
  isSameAsCurrent,
}: NicknameFieldProps) => {
  const renderStatusMessage = () => {
    if (!isValidFormat) {
      return <p className="text-red">공백과 특수기호를 포함할 수 없습니다.</p>
    }

    if (isSameAsCurrent) {
      return <p className="text-c200">현재 닉네임입니다.</p>
    }

    if (availability === 'unavailable') {
      return <p className="text-red">이미 사용 중인 닉네임입니다.</p>
    }

    if (availability === 'available') {
      return <p className="text-dark-green">사용 가능한 닉네임입니다.</p>
    }

    if (availability === 'checking') {
      return <p className="text-c300">중복 확인 중입니다...</p>
    }

    return null
  }

  return (
    <div className="text-c200 flex gap-2">
      <div className="w-full">
        <Input
          value={nickname}
          onChange={(e) => {
            const value = e.target.value.slice(0, 5) // 5자 제한
            onChange(value)
          }}
          placeholder="5자 이내 입력"
          className="text-c900 mb-1"
        />
        <div className="text-captionM mt-2 pl-1">{renderStatusMessage()}</div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="bg-c600 text-captionM h-12 w-20"
        onClick={onCheckDuplicate}
        disabled={isChecking || !isValidFormat || isSameAsCurrent}
      >
        중복 확인
      </Button>
    </div>
  )
}
