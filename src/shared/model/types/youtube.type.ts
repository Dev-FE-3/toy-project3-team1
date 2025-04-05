export interface YouTubeVideoRaw {
  id: string;
  snippet: {
    title: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
  statistics: {
    viewCount: string;
  };
}

export interface YouTubeVideoInfo {
    id: string
    title: string
    thumbnailUrl: string
    channelTitle: string
    publishedAt: string
    viewCount: string
  }