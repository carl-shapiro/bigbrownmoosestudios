export default function YouTubeEmbed({ embedUrl }: { embedUrl: string }) {
  return (
    <iframe
      className="mt-4 rounded-xl"
      src={embedUrl}
      width="100%"
      height="315"
      style={{ border: 0 }}
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      loading="lazy"
      title="YouTube player"
    />
  );
}
