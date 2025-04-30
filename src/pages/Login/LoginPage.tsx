import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { signInWithEmail } from '@/shared/model/api/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import * as z from 'zod'

const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const fromTo = location.state?.from || '/'

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit', // onSubmit 시에만 유효성 검사
    reValidateMode: 'onSubmit', // 재검증도 onSubmit 시에만 수행
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await signInWithEmail(data.email, data.password)

      // 로그인 성공 시 이전 페이지나 홈으로 리다이렉트
      navigate(fromTo, { replace: true })
    } catch (err) {
      console.error('로그인 실패:', err)
      // 서버에서 반환된 에러를 form error에 설정
      form.setError('root', {
        type: 'manual',
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      })
    }
  }

  return (
    <div className="bg-c900 flex min-h-[100dvh] flex-col">
      <div className="mx-auto flex w-full max-w-[390px] flex-1 flex-col p-3">
        <img
          src="/images/logo.webp"
          className="text-c50 text-h2 mx-auto mt-[16vh] mb-[10vh] w-60"
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {form.formState.errors.root && (
              <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <p>{form.formState.errors.root.message}</p>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="이메일을 입력하세요"
                      {...field}
                      autoComplete="email"
                      className={`${form.formState.errors.email ? 'border-red border-2' : ''}`}
                    />
                  </FormControl>
                  <div className="text-red text-captionM flex items-center gap-1">
                    {form.formState.errors.email && (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        <span>{form.formState.errors.email.message}</span>
                      </>
                    )}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      {...field}
                      autoComplete="current-password"
                      className={`${form.formState.errors.password ? 'border-red border-2' : ''}`}
                    />
                  </FormControl>
                  <div className="text-red text-captionM flex items-center gap-1">
                    {form.formState.errors.password && (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        <span>{form.formState.errors.password.message}</span>
                      </>
                    )}
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-c600 text-c200 h-12 w-full cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </Form>

        <div className="text-captionM mt-6 mb-8 space-x-1 text-center">
          <span className="text-c500">계정이 없으신가요?</span>
          <Link to="/signup" className="text-c100">
            회원가입
          </Link>
        </div>
        <Button
          type="button"
          className="bg-dark-green text-c200 mt-4 h-12 w-full cursor-pointer"
          disabled={form.formState.isSubmitting}
          onClick={() => {
            const testCredentials = { email: 'test@test.com', password: 'test@test.com' }
            form.setValue('email', testCredentials.email)
            form.setValue('password', testCredentials.password)
            form.handleSubmit(onSubmit)()
          }}
        >
          테스트 계정으로 접속하기
        </Button>
      </div>
    </div>
  )
}
