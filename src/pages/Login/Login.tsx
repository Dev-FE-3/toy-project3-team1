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
    <div className="flex min-h-screen flex-col bg-[#0F1729]">
      <div className="mx-auto flex w-full max-w-[390px] flex-1 flex-col p-3">
        <h1 className="font-dohyeon mt-[200px] mb-[100px] text-center text-[32px] font-bold text-white">
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
                  <FormMessage className="mt-1 flex items-center gap-1 text-red-500">
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
                    <Input type="password" placeholder="비밀번호를 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="h-12 w-full bg-[#374151] text-white/60 hover:bg-[#374151]/90"
            >
              로그인
            </Button>
          </form>
        </Form>

        <div className="mt-auto mb-8 space-x-1 text-center">
          <span className="text-sm text-white/40">계정이 없으신가요?</span>
          <a href="/signup" className="text-sm text-white">
            회원가입
          </a>
        </div>
      </div>
    </div>
  )
}
