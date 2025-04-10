/**
 * YouTube URL에서 비디오 ID를 추출하는 함수
 * 일반 YouTube 동영상, 쇼츠, 재생목록의 비디오 등 다양한 형식을 지원
 * @param url YouTube URL
 * @returns 추출한 비디오 ID 또는 유효하지 않은 경우 null
 */
export const extractVideoId = (url: string): string | null => {
  if (!url) return null;
  
  url = url.trim();
  
  // YouTube 일반 동영상 URL (https://www.youtube.com/watch?v=VIDEO_ID)
  // YouTube 공유 URL (https://youtu.be/VIDEO_ID)
  // YouTube 임베드 URL (https://www.youtube.com/embed/VIDEO_ID)
  // YouTube 쇼츠 URL (https://www.youtube.com/shorts/VIDEO_ID)
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^#&?]*)/,
    /(?:youtube\.com\/watch.*[?&]v=)([^#&?]*)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1] && match[1].length === 11) {
      return match[1];
    }
  }

  // 재생목록 내 비디오인 경우 video 파라미터 추출
  const playlistMatch = url.match(/[?&]v=([^#&?]*)/);
  if (playlistMatch && playlistMatch[1] && playlistMatch[1].length === 11) {
    return playlistMatch[1];
  }

  return null;
};

/**
 * 비디오 ID가 유효한지 확인하는 함수
 * @param videoId 확인할 비디오 ID
 * @returns 유효성 여부
 */
export const isValidVideoId = (videoId: string): boolean => {
  return !!videoId && videoId.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(videoId);
};

/**
 * 완전한 YouTube 표준 URL을 생성하는 함수
 * @param videoId 비디오 ID
 * @returns YouTube 표준 URL
 */
export const createYouTubeUrl = (videoId: string): string => {
  if (!isValidVideoId(videoId)) return '';
  return `https://www.youtube.com/watch?v=${videoId}`;
};

/**
 * YouTube 썸네일 URL을 생성하는 함수
 * @param videoId 비디오 ID
 * @param quality 썸네일 품질 (default, medium, high, standard, maxres)
 * @returns 썸네일 URL
 */
export const getYouTubeThumbnail = (videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'): string => {
  if (!isValidVideoId(videoId)) return '';
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}; 