import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const extractRepoUrl = (description) => {
    const githubRegex =
      /https?:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/;
    const match = description.match(githubRegex);
    return match ? match[0] : null;
  };

  const getVideoDetails = async (videoId, apiKey) => {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items[0].snippet;
  };

  const searchCodingTutorials = async (searchQuery, maxResults) => {
    try {
      setIsLoading(true);
      setError(null);

      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        searchQuery
      )}&type=video&maxResults=${maxResults}&key=${apiKey}`;

      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (searchData.error) {
        throw new Error(searchData.error.message);
      }

      const videoDetailsPromises = searchData.items.map((item) =>
        getVideoDetails(item.id.videoId, apiKey)
      );
      const videoDetails = await Promise.all(videoDetailsPromises);

      const videoResults = videoDetails
        .map((details) => ({
          title: details.title,
          description: details.description,
          channelTitle: details.channelTitle,
          publishDate: details.publishedAt,
          videoUrl: `https://www.youtube.com/watch?v=${details.resourceId?.videoId}`,
          repoUrl: extractRepoUrl(details.description),
        }))
        .filter((video) => video.repoUrl !== null);

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
      searchCodingTutorials(query, 50);
    }
  };

  return (
    <div className="App">
      <h1>Coding Tutorial Search (with GitHub Repos)</h1>
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
            <a href={video.repoUrl} target="_blank" rel="noopener noreferrer">
              GitHub Repository
            </a>
            <p>{video.description.slice(0, 200)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
