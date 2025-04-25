import React from 'react'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  onCloseSearch: () => void
}

/**
 * 검색바 뒤로 가기 버튼 컴포넌트
 */
const BackButton = ({ onCloseSearch }: BackButtonProps) => {
  return (
    <button onClick={onCloseSearch} className="text-c200" aria-label="뒤로 가기">
      <ArrowLeft size={24} />
    </button>
  )
}

export default BackButton
