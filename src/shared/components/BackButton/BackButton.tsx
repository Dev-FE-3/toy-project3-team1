import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  onClick?: () => void
  className?: string
}

export default function BackButton({ onClick, className = 'text-c400' }: BackButtonProps) {
  const navigate = useNavigate()
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(-1)
    }
  }
  
  return (
    <button 
      onClick={handleClick}
      className="p-1"
      aria-label="뒤로 가기"
    >
      <ArrowLeft size={24} className={className} />
    </button>
  )
}
