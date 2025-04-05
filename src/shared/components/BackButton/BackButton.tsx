import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  color?: string
}

export default function BackButton({ color = 'text-50' }: BackButtonProps) {
  return <ArrowLeft size={24} className={color} />
}
