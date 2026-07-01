import { useState, useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import "../assets/styles/pages/BrowsePage.scss";

const ChannelResult = ({ channel }) => {
  const slug = channel?.slug || channel?.user?.username;
  const username = channel?.user?.username || slug;
  const followers = channel?.followers_count ?? channel?.followersCount;
  const avatar = channel?.user?.profile_pic;
  if (!slug) return null;
  return (
    <Link className="searchResultRow" to={`/watch/${encodeURIComponent(slug)}`}>
      {avatar ? <img className="searchResultAvatar" src={avatar} alt="" /> : <div className="searchResultAvatar" />}
      <div className="searchResultMeta">
        <div className="searchResultName">{username}</div>
        {typeof followers === "number" && <div className="searchResultSub">{followers.toLocaleString()} followers</div>}
      </div>
    </Link>
  );
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get("q") || "";
  const [query, setQuery] = useState(initial);
  const [results, setResults] = useState({ channels: [], categories: [] });
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (q) => {
    if (!q?.trim()) {
      setResults({ channels: [], categories: [] });
      return;
    }
    setLoading(true);
    try {
      const data = await window.app.kick.search(q.trim());
      setResults(data || { channels: [], categories: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initial) run(initial);
  }, [initial, run]);

  const submit = (e) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    run(query);
  };

  return (
    <div className="browsePage">
      <TitleBar />
      <div className="browseContent">
        <header className="browseHeader">
          <h1>Search</h1>
          <nav className="browseNav">
            <Link to="/">Chat</Link>
            <Link to="/browse">Browse</Link>
            <Link to="/search">Search</Link>
          </nav>
        </header>
        <form className="searchForm" onSubmit={submit}>
          <input
            type="search"
            placeholder="Search channels..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button type="submit" disabled={loading}>{loading ? "..." : "Search"}</button>
        </form>
        {results.channels.length > 0 && (
          <section>
            <h2>Channels</h2>
            <div className="searchResultList">
              {results.channels.map((c, i) => <ChannelResult key={c?.id || c?.slug || i} channel={c} />)}
            </div>
          </section>
        )}
        {!loading && initial && results.channels.length === 0 && (
          <div className="browseEmpty">No matches.</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
