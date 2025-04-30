import BackButton from '@/shared/components/BackButton/BackButton'

interface FormHeaderProps {
  title?: string
  onBackButtonClick?: () => void
  className?: string
}

export const FormHeader = ({
  title = '플레이리스트 등록',
  onBackButtonClick,
  className = 'py-3',
}: FormHeaderProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {onBackButtonClick && <BackButton onClick={onBackButtonClick} />}
      <h1 className="text-h3 text-c100 font-medium">{title}</h1>
    </div>
  )
}
