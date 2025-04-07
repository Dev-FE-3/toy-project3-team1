
import { useQuery } from '@tanstack/react-query';
import  { fetchRawYouTubeVideoData }  from '../services/youtubeVideoApi';

export const useYouTubeVideoQuery = (videoId: string) => {
  return useQuery(
{
    queryKey: ['youtubeVideo', videoId],
    queryFn: () => fetchRawYouTubeVideoData(videoId),
    enabled: !!videoId,
}
  );
};