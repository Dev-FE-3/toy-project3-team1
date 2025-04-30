import { Button } from '@/shared/components/ui/button'
import { Ghost } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ErrorPage = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-c900 flex min-h-[100dvh] flex-col items-center justify-center gap-20">
      <div className="flex flex-col items-center justify-center">
        {/* 404 문구 */}
        <div className="text-c400 flex items-center text-[120px]">
          4
          <Ghost size={100} className="mt-3" /> 4
        </div>
        <h3 className="text-c300 text-h3 mb-2">여긴 어디? 나는 누구?</h3>
        <p className="text-c400 text-textR">길을 잃은 것 같아요.. </p>
      </div>
      <Button
        variant="outline"
        type="button"
        // 뒤로가기
        onClick={() => navigate(-1)}
        className="bg-c600 text-c200 h-10"
      >
        이전 페이지로 이동
      </Button>
    </div>
  )
}

export default ErrorPage
