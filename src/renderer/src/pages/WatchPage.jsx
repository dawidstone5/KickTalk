import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StreamPlayer from "../components/StreamPlayer";
import Chat from "../components/Chat";
import TitleBar from "../components/TitleBar";
import useChatStore from "../providers/ChatProvider";
import { useSettings } from "../providers/SettingsProvider";
import "../assets/styles/pages/WatchPage.scss";

const WatchPage = () => {
  const { slug } = useParams();
  const { settings, updateSettings } = useSettings();
  const addChatroom = useChatStore((s) => s.addChatroom);
  const orderedChatrooms = useChatStore((s) => s.getOrderedChatrooms());
  const setCurrentChatroom = useChatStore((s) => s.setCurrentChatroom);

  const [chatroomId, setChatroomId] = useState(null);
  const [error, setError] = useState(null);

  const kickUsername = localStorage.getItem("kickUsername");
  const kickId = localStorage.getItem("kickId");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!slug) return;
      const existing = orderedChatrooms.find((c) => c.username?.toLowerCase() === slug.toLowerCase());
      if (existing) {
        if (!cancelled) {
          setChatroomId(existing.id);
          setCurrentChatroom(existing.id);
        }
        return;
      }
      try {
        const created = await addChatroom(slug);
        if (cancelled) return;
        if (created?.id) {
          setChatroomId(created.id);
          setCurrentChatroom(created.id);
        } else {
          setError(created?.status || "Failed to load chat");
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load chat");
      }
    })();
    return () => { cancelled = true; };
  }, [slug, addChatroom, setCurrentChatroom, orderedChatrooms]);

  return (
    <div className="watchPage">
      <TitleBar />
      <div className="watchContent">
        <nav className="watchNav">
          <Link to="/">Chat</Link>
          <Link to="/browse">Browse</Link>
          <Link to="/search">Search</Link>
          <span className="watchSlug">/ {slug}</span>
        </nav>
        <div className="watchSplit">
          <div className="watchPlayer">
            <StreamPlayer slug={slug} />
          </div>
          <aside className="watchChat">
            {error && <div className="watchError">{error}</div>}
            {chatroomId ? (
              <Chat
                chatroomId={chatroomId}
                kickUsername={kickUsername}
                kickId={kickId}
                settings={settings}
                updateSettings={updateSettings}
              />
            ) : (
              <div className="watchLoading">Loading chat...</div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
