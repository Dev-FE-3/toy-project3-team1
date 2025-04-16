import { FormHeader } from '@/pages/PlaylistForm/components'
import StatusButton from '@/shared/components/StatusButton/StatusButton'
import { signOut } from '@/shared/model/api/auth'

export default function Settings() {
  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      signOut()
    }
  }

  return (
    <div className="container mx-auto px-9">
      <FormHeader title="설정" />

      <div className="flex flex-col gap-4 py-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-c100 text-textR">계정</h2>
          <StatusButton
            status="active"
            onClick={handleLogout}
            className="text-c50 bg-[#ff3e3e] hover:bg-[#ff3e3e]/65"
          >
            로그아웃
          </StatusButton>
        </div>
      </div>
    </div>
  )
}
