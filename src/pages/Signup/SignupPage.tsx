import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form'
import { signUpWithEmail, checkEmailExists } from '@/shared/model/api/auth'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { Label } from '@/shared/components/ui/label'

const signupSchema = z
  .object({
    nickname: z
      .string()
      .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
      .max(5, '닉네임은 5자 이하여야 합니다.')
      .refine((value) => /\d/.test(value), {
        message: '숫자를 포함해야 합니다.',
      })
      .refine((value) => /[a-zA-Z가-힣]/.test(value), {
        message: '문자를 포함해야 합니다.',
      }),
    email: z.string().email('올바른 이메일을 입력하세요'),
    password: z
      .string()
      .min(8, '비밀번호를 최소 8자 이상 입력해주세요.')
      .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
        message: '특수문자를 포함해야 합니다.',
      }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  })

type SignupFormValues = z.infer<typeof signupSchema>

const getValidationTextColor = (value: string, error: boolean) => {
  if (!value) return 'text-c500' // 초기 상태
  if (error) return 'text-red' // 에러 상태
  return 'text-dark-green' // 유효한 상태
}

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
    mode: 'onSubmit',
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
        <img className="mx-auto h-[52px]" src="/images/logo.svg" />

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
                <FormItem className="">
                  <Label className="!text-c50 text-captionL">닉네임</Label>
                  <FormControl>
                    <Input placeholder="사용할 닉네임을 입력하세요" maxLength={5} {...field} />
                  </FormControl>
                  <div
                    className={`text-captionM ${getValidationTextColor(field.value, !!form.formState.errors.nickname)}`}
                  >
                    숫자를 포함한 5자 이하를 입력해주세요
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <Label className="!text-c50 text-captionL">이메일</Label>
                  <FormControl>
                    <Input
                      placeholder="이메일을 입력하세요"
                      {...field}
                      autoComplete="email"
                      onBlur={async (e) => {
                        field.onBlur()
                        const email = e.target.value
                        if (email && !form.formState.errors.email) {
                          try {
                            const exists = await checkEmailExists(email)
                            if (exists) {
                              form.setError('email', {
                                type: 'manual',
                                message: '이미 사용 중인 이메일입니다.',
                              })
                            }
                          } catch (error) {
                            console.error('이메일 중복 체크 실패:', error)
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <div
                    className={`text-captionM ${getValidationTextColor(field.value, !!form.formState.errors.email)}`}
                  >
                    인증 가능한 이메일을 입력해주세요
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <Label className="!text-c50 text-captionL">비밀번호</Label>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      minLength={8}
                      {...field}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <div
                    className={`text-captionM ${getValidationTextColor(field.value, !!form.formState.errors.password)}`}
                  >
                    특수문자를 포함한 8자 이상으로 입력해주세요
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <Label className="!text-c50 text-captionL">비밀번호 확인</Label>
                  <FormControl>
                    <Input
                      type="password"
                      minLength={8}
                      placeholder="비밀번호를 다시 입력하세요"
                      {...field}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <div
                    className={`text-captionM ${getValidationTextColor(field.value, !!form.formState.errors.passwordConfirm)}`}
                  >
                    설정한 비밀번호를 입력하세요
                  </div>
                </FormItem>
              )}
            />

            <Button
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
