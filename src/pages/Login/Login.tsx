import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { AlertCircle } from 'lucide-react'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!formData.email) {
      newErrors.email = '이메일 또는 비밀번호가 잘못되었습니다.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('로그인 시도:', formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // 입력 시 해당 필드의 에러 메시지 제거
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }))
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex-1 flex flex-col">
        <h1 className="text-[32px] font-bold text-white text-center mt-[200px] mb-[100px]">
          리플레이
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              name="email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleChange}
              className={`h-12 bg-white rounded-md ${
                errors.email ? 'border-red-500 border-2' : ''
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              className={`h-12 bg-white rounded-md ${
                errors.password ? 'border-red-500 border-2' : ''
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full" variant="default">
            로그인
          </Button>
        </form>

        <div className="mt-auto mb-8 text-center">
          <span className="text-[#0EA5E9] text-sm">계정이 없으신가요? </span>
          <a href="/signup" className="text-white text-sm">
            회원가입
          </a>
        </div>
      </div>
    </div>
  )
}
