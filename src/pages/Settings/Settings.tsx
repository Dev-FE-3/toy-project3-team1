import { FormHeader } from '@/pages/PlaylistForm/components'
import StatusButton from '@/shared/components/StatusButton/StatusButton'
import { useLogout } from '@/shared/model/api/auth'

const SURVEY_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfUbS-Ugip-EJBQKB6RVJJo88qPN3e1_IU7vV4DB8uZZzI9sg/viewform?usp=dialog'

export default function Settings() {
  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      useLogout()
    }
  }

  const handleSurveyClick = () => {
    window.open(SURVEY_URL, '_blank')
  }

  return (
    <div className="container mx-auto px-5">
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

        <div className="flex flex-col gap-2">
          <h2 className="text-c100 text-textR">감사합니다 😊</h2>
          <StatusButton
            status="active"
            onClick={handleSurveyClick}
            className="text-c50 bg-c600 hover:bg-c500"
          >
            만족도 조사 참여하기
          </StatusButton>
        </div>
      </div>
    </div>
  )
}
