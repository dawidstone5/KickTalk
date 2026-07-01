import { memo, useMemo } from "react";

// Slug must be the URL segment Kick uses (lowercase alphanumeric + underscores
// plus a few legacy chars). Reject anything else so the iframe URL can't be
// coerced into navigating the player to a different host or path.
const SAFE_SLUG = /^[a-z0-9][a-z0-9_-]{0,29}$/i;

const StreamPlayer = memo(({ slug, autoplay = true, muted = true }) => {
  const src = useMemo(() => {
    if (!SAFE_SLUG.test(String(slug || ""))) return null;
    const params = new URLSearchParams();
    if (autoplay) params.set("autoplay", "true");
    if (muted) params.set("muted", "true");
    return `https://player.kick.com/${slug}?${params.toString()}`;
  }, [slug, autoplay, muted]);

  if (!src) {
    return <div className="streamPlayerEmpty">Invalid channel</div>;
  }

  return (
    <div className="streamPlayer">
      <iframe
        title={`${slug} stream`}
        src={src}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
});

export default StreamPlayer;
