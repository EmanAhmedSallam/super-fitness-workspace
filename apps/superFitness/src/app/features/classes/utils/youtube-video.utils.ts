export function getYouTubeVideoId(url: string | null): string | null {
  if (!url) return null;

  const match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return match?.[1] ?? null;
}

export function getYouTubeThumbnailUrl(url: string | null): string | null {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
}
