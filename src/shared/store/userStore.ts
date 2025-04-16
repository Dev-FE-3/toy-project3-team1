import { create } from 'zustand'

interface UserState {
  profileId: string | null
  setProfileId: (id: string) => void
}

export const useUserStore = create<UserState>((set) => ({
  profileId: null, // 로그인하지 않은 상태의 초기값
  setProfileId: (id: string) => set({ profileId: id }),
}))
