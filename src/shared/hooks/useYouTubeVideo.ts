import { useYouTubeVideoQuery } from "../queries/useYouTubeVideoQuery";

export const useYouTubeVideo = (videoId: string) => {
  const { data: rawData, isLoading, error } = useYouTubeVideoQuery(videoId);

  const parsedData = rawData
    ? {
        id: rawData.id,
        title: rawData.snippet.title,
        thumbnailUrl: rawData.snippet.thumbnails.high.url,
        channelTitle: rawData.snippet.channelTitle,
        publishedAt: rawData.snippet.publishedAt,
        viewCount: rawData.statistics.viewCount,
      }
    : null;

  return {
    video: parsedData,
    isLoading,
    error,
  };
};