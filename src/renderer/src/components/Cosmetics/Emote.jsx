import { memo, useCallback, useState, useMemo } from "react";
import EmoteTooltip from "./EmoteTooltip";

// 7TV ids are 24-char ULIDs; Kick ids are numeric. Bound the character set to
// strictly what those CDNs will accept so a malformed upstream response can't
// be used to coerce the <img> into hitting some other path on the same host.
const SAFE_EMOTE_ID = /^[A-Za-z0-9]{1,40}$/;

const Emote = memo(({ emote, overlaidEmotes = [], scale = 1, type }) => {
  const { id, name, width, height } = emote;

  if (!SAFE_EMOTE_ID.test(String(id))) return null;

  const [showEmoteInfo, setShowEmoteInfo] = useState(false);
  const [mousePos, setMousePos] = useState({ x: null, y: null });

  const emoteSrcSet = useCallback(
    (emote) => {
      if (type === "stv") {
        const baseUrl = `https://cdn.7tv.app/emote/${emote.id}`;
        return `${baseUrl}/1x.webp 1x, ${baseUrl}/2x.webp 2x, ${baseUrl}/3x.webp 3x, ${baseUrl}/4x.webp 4x`;
      }
      return `https://files.kick.com/emotes/${emote.id}/fullsize`;
    },
    [type],
  );

  const emoteImageSrc = useMemo(() => {
    return type === "stv" ? `https://cdn.7tv.app/emote/${id}/1x.webp` : `https://files.kick.com/emotes/${id}/fullsize`;
  }, [type, id]);

  // Optimize event handlers with useCallback
  const handleMouseEnter = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setShowEmoteInfo(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowEmoteInfo(false);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (showEmoteInfo) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    },
    [showEmoteInfo],
  );

  return (
    <>
      <EmoteTooltip
        type={type}
        showEmoteInfo={showEmoteInfo}
        emoteSrc={emoteImageSrc}
        mousePos={mousePos}
        emoteInfo={emote}
        overlaidEmotes={overlaidEmotes}
      />
      <div
        className="chatroomEmoteWrapper"
        style={{
          width: type === "stv" ? width : "32px",
          height: type === "stv" ? height : "32px",
        }}>
        <div
          className="chatroomEmote"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}>
          <img
            className={type === "stv" ? "stvEmote emote" : "kickEmote emote"}
            src={emoteImageSrc}
            srcSet={type === "stv" ? emoteSrcSet(emote) : null}
            alt={name}
            loading="lazy"
            fetchpriority="low"
            decoding="async"
          />
        </div>

        {/* Overlaid zero-width emotes */}
        {overlaidEmotes.filter((o) => SAFE_EMOTE_ID.test(String(o.id))).map((overlaidEmote) => (
          <div key={overlaidEmote.id} className="chatroomEmote zeroWidthEmote">
            <img
              className={`${type === "stv" ? "stvEmote" : "kickEmote"} emote`}
              src={
                type === "stv"
                  ? `https://cdn.7tv.app/emote/${overlaidEmote.id}/1x.webp`
                  : `https://files.kick.com/emotes/${overlaidEmote.id}/fullsize`
              }
              alt={` ${overlaidEmote.name}`}
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </>
  );
});

export default Emote;
