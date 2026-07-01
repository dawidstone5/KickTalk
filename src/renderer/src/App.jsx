import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import BrowsePage from "./pages/BrowsePage";
import SearchPage from "./pages/SearchPage";
import WatchPage from "./pages/WatchPage";
import SettingsProvider from "./providers/SettingsProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import Loader from "./pages/Loader";

const App = () => {
  return (
    <ErrorBoundary>
      <Loader />
      <SettingsProvider>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/watch/:slug" element={<WatchPage />} />
        </Routes>
      </SettingsProvider>
    </ErrorBoundary>
  );
};

export default App;
