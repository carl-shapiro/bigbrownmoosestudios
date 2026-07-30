export default function SoundCloudEmbed({ embedUrl }: { embedUrl: string }) {
  return (
    <iframe
      className="mt-4 rounded-xl"
      src={embedUrl}
      width="100%"
      height="166"
      style={{ border: 0 }}
      allow="autoplay"
      loading="lazy"
      title="SoundCloud player"
    />
  );
}
