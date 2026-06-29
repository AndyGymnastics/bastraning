export function toYoutubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([^&?/]+)/);
  if (!match?.[1]) {
    return url;
  }
  return `https://www.youtube-nocookie.com/embed/${match[1]}`;
}

export function toYoutubeThumbnailUrl(url: string): string {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([^&?/]+)/);
  if (!match?.[1]) {
    return '';
  }
  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
}
