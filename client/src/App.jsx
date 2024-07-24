import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchCodingTutorials = async (searchQuery, maxResults = 10) => {
    try {
      setIsLoading(true);
      setError(null);

      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        searchQuery
      )}&type=video&maxResults=${maxResults}&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const videoResults = data.items.map((item) => ({
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        publishDate: item.snippet.publishedAt,
        videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));

      setVideos(videoResults);
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError("Failed to fetch videos. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      searchCodingTutorials(query, 10);
    }
  };

  return (
    <div className="App">
      <h1>Coding Tutorial Search</h1>
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query"
        />
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="video-list">
        {videos.map((video, index) => (
          <div key={index} className="video-item">
            <h2>{video.title}</h2>
            <p>Channel: {video.channelTitle}</p>
            <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
              Watch Video
            </a>
            <p>{video.description.slice(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
