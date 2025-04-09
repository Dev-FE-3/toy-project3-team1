import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form'
import { signUpWithEmail } from '@/shared/model/api/auth'
import { useNavigate, Link, Navigate } from 'react-router-dom'

const signupSchema = z
  .object({
    nickname: z.string().min(2, '닉네임은 최소 2자 이상이어야 합니다.'),
    email: z.string().email('올바른 이메일을 입력하세요'),
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
    passwordConfirm: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const navigate = useNavigate()

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signUpWithEmail(data)
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('회원가입 실패:', err)
      form.setError('root', {
        type: 'manual',
        message: '회원가입에 실패했습니다. 다시 시도해주세요.',
      })
    }
  }

  return (
    <div className="bg-c900 flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-[390px] flex-1 flex-col p-3">
        <h1 className="text-c50 text-h2 mt-[200px] mb-[100px] text-center">리플레이</h1>

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
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="사용할 닉네임을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage className="text-red mt-1 flex items-center gap-1">
                    {form.formState.errors.nickname && <AlertCircle className="h-4 w-4" />}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="이메일을 입력하세요" {...field} autoComplete="email" />
                  </FormControl>
                  <FormMessage className="text-red mt-1 flex items-center gap-1">
                    {form.formState.errors.email && <AlertCircle className="h-4 w-4" />}
                  </FormMessage>
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
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage className="text-red" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
                      {...field}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage className="text-red" />
                </FormItem>
              )}
            />

            <Button
              variant={'outline'}
              type="submit"
              className="bg-c600 text-c200 h-12 w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? '회원가입 중...' : '회원가입'}
            </Button>
          </form>
        </Form>

        <div className="text-captionM mt-6 mb-8 space-x-1 text-center">
          <span className="text-c500">이미 계정이 있으신가요?</span>
          <Link to="/login" className="text-c100">
            로그인
          </Link>
        </div>
      </div>
    </div>
  )
}
