export function Youtube({ videoId }: { videoId: string }) {
  const url = `https://www.youtube.com/embed/${videoId}`;
  const caption = `Youtube Video - ${url}`;

  return (
    <iframe
      style={{ width: "100%", aspectRatio: "16 / 9", border: 0 }}
      src={url}
      title={caption}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      aria-label={caption}
    />
  );
}
