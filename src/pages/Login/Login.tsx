import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form'

const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    console.log('로그인 시도:', data)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0F1729]">
      <div className="flex flex-col flex-1 w-full max-w-[390px] mx-auto p-3">
        <h1
          className="text-[32px] font-bold text-white text-center mt-[200px] mb-[100px]
          font-dohyeon"
        >
          리플레이
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="이메일을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage className="flex items-center gap-1 mt-1 text-red-500">
                    {form.formState.errors.email && <AlertCircle className="w-4 h-4" />}
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
                    <Input type="password" placeholder="비밀번호를 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 bg-[#374151] hover:bg-[#374151]/90 text-white/60"
            >
              로그인
            </Button>
          </form>
        </Form>

        <div className="mt-auto mb-8 text-center space-x-1">
          <span className="text-white/40 text-sm">계정이 없으신가요?</span>
          <a href="/signup" className="text-white text-sm">
            회원가입
          </a>
        </div>
      </div>
    </div>
  )
}
