import { create } from 'zustand'

interface UserState {
  profileId: string | null
  setProfileId: (id: string) => void
}

export const useUserStore = create<UserState>((set) => ({
  // 임시 프로필 ID 설정 (나중에 실제 인증 구현 시 null로 변경 필요)
  profileId: 'b7de2b3d-2a22-457d-951d-a73b29a5b063',
  setProfileId: (id: string) => set({ profileId: id }),
}))
