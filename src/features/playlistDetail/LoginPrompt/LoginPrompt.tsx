interface LoginPromptProps {
  onLoginClick: () => void
  message?: string
  buttonText?: string
  className?: string
}

const LoginPrompt: React.FC<LoginPromptProps> = ({
  onLoginClick,
  message = '댓글을 작성하려면 로그인이 필요합니다.',
  buttonText = '로그인하기',
  className,
}) => {
  return (
    <div className={`flex flex-col items-center space-y-4 p-4 ${className || ''}`}>
      <p className="text-center text-slate-300">{message}</p>
      <button
        onClick={onLoginClick}
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        {buttonText}
      </button>
    </div>
  )
}

export default LoginPrompt
