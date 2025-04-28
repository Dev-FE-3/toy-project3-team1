import { Playlist } from "@/pages/PlaylistForm/model"
import { queryClient } from "@/shared/model/lib/queryClient"
import { profilePageQueryKeys } from "./profilePageQueryKeys"

export const getCachedPlaylists = (profileId?: string): Playlist[] | undefined => {
  return queryClient.getQueryData<Playlist[]>(profilePageQueryKeys.playlists(profileId))
}
