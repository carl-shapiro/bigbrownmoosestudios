export default function SpotifyEmbed({ embedUrl }: { embedUrl: string }) {
  return (
    <iframe
      className="mt-4 rounded-xl"
      src={embedUrl}
      width="100%"
      height="152"
      style={{ border: 0 }}
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Spotify player"
    />
  );
}
