import { cn } from '@/shared/model/lib/utils'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  className?: string
}

export default function BackButton({ className }: BackButtonProps) {
  return <ArrowLeft className={cn('h-5 w-5', className)} />
}
