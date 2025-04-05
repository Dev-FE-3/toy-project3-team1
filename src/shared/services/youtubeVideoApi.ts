import { YouTubeVideoRaw } from "../model/types/youtube.type";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const fetchRawYouTubeVideoData = async (
  videoId: string
): Promise<YouTubeVideoRaw> => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
  );

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("비디오를 찾을 수 없습니다.");
  }

  return data.items[0]; 
};

