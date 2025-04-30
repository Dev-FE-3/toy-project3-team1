import { create } from 'zustand'
import { combine, persist } from 'zustand/middleware'

// 상태 타입 정의
interface ProfileState {
  profileId: string | null
}

interface ProfileActions {
  setProfileId: (id: string | null) => void
  clearProfile: () => void
}

export const useUserStore = create(
  persist(
    combine<ProfileState, ProfileActions>({ profileId: null }, (set) => ({
      setProfileId: (id) => set({ profileId: id }),
      clearProfile: () => set({ profileId: null }),
    })),
    {
      name: 'user-profile-store', // localStorage key 이름
    },
  ),
)
