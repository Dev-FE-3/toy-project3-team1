import { useMutation, useQueryClient } from '@tanstack/react-query'

import { profileService } from '@/pages/Profile/services/profileService'
import { profileSharedQueryKeys } from '@/shared/queries/profileSharedQueryKeys'
import { profileSharedService } from '@/shared/services/profileSharedService'

interface UploadProfileImageParams {
  file: File
}

export const useUploadProfileImageMutation = (profileId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file }: UploadProfileImageParams) => {
      return await profileService.uploadProfileImage(file, profileId)
    },
    meta: {
      toastError: true,
      toastSuccess: true,
      toastSuccessMessage: '프로필 이미지가 정상적으로 업로드되었습니다',
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileSharedQueryKeys.image(profileId) })
    },
    retry: 0,
  })
}

export const useUploadAndSaveProfileImageMutation = (profileId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file }: UploadProfileImageParams) => {
      // 1. 기존 프로필 이미지가 있으면 삭제
      const { data: profileData } = await profileSharedService.getProfileRow(profileId)
      if (profileData?.profile_image_url) {
        await profileService.deleteProfileImage(profileData.profile_image_url)
      }
      // 2. 새 파일 업로드
      const filePath = await profileService.uploadProfileImageToStorage(file, profileId)
      // 3. publicUrl 조회
      const { publicUrl } = await profileSharedService.getProfileImageUrl(filePath)
      // 4. DB에 filePath 저장
      await profileService.updateProfileImageUrlInDB(profileId, filePath)
      return publicUrl
    },
    meta: {
      toastError: true,
      toastSuccess: true,
      toastSuccessMessage: '프로필 이미지가 정상적으로 업로드되었습니다',
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileSharedQueryKeys.image(profileId) })
    },
    retry: 0,
  })
}
