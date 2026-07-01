import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import "../assets/styles/pages/BrowsePage.scss";

const formatViewers = (n) => {
  if (typeof n !== "number") return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
};

const StreamCard = ({ stream }) => {
  const slug = stream?.slug || stream?.channel?.slug;
  const title = stream?.session_title || stream?.stream?.session_title || stream?.stream_title || "Untitled";
  const username = stream?.channel?.user?.username || stream?.user?.username || slug;
  const category = stream?.categories?.[0]?.name || stream?.category?.name || "";
  const viewers = stream?.viewer_count ?? stream?.viewers ?? 0;
  const thumb = stream?.thumbnail?.url || stream?.session_thumbnail || stream?.thumbnail;

  if (!slug) return null;

  return (
    <Link className="streamCard" to={`/watch/${encodeURIComponent(slug)}`}>
      <div className="streamCardThumb">
        {thumb ? <img src={thumb} alt="" loading="lazy" decoding="async" /> : <div className="streamCardThumbFallback" />}
        <span className="streamCardLive">LIVE</span>
        <span className="streamCardViewers">{formatViewers(viewers)}</span>
      </div>
      <div className="streamCardMeta">
        <div className="streamCardTitle" title={title}>{title}</div>
        <div className="streamCardSub">
          <span className="streamCardUser">{username}</span>
          {category && <span className="streamCardCat">{category}</span>}
        </div>
      </div>
    </Link>
  );
};

const BrowsePage = () => {
  const [streams, setStreams] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (p) => {
    setLoading(true);
    setError(null);
    try {
      const data = await window.app.kick.getLiveStreams({ page: p, limit: 24 });
      const list = Array.isArray(data) ? data : data?.data || [];
      setStreams((prev) => (p === 1 ? list : [...prev, ...list]));
    } catch (e) {
      setError(e?.message || "Failed to load streams");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  return (
    <div className="browsePage">
      <TitleBar />
      <div className="browseContent">
        <header className="browseHeader">
          <h1>Live Channels</h1>
          <nav className="browseNav">
            <Link to="/">Chat</Link>
            <Link to="/browse">Browse</Link>
            <Link to="/search">Search</Link>
          </nav>
        </header>
        {error && <div className="browseError">{error}</div>}
        <div className="streamGrid">
          {streams.map((s, i) => (
            <StreamCard key={`${s?.slug || s?.id || i}`} stream={s} />
          ))}
        </div>
        {streams.length > 0 && (
          <div className="browseFooter">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                const next = page + 1;
                setPage(next);
                load(next);
              }}>
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
        {!loading && streams.length === 0 && !error && (
          <div className="browseEmpty">No live streams.</div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
