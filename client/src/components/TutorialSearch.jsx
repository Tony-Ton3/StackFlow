import { useState } from "react";

export default function TutorialSerch() {
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

  const getVideoDescription = async (videoId, apiKey) => {
    const descriptionUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
    try {
      const response = await fetch(descriptionUrl);
      const data = await response.json();
      console.log("Video details API response:", data);
      return {
        ...data.items[0].snippet,
        id: videoId,
      };
    } catch (error) {
      console.error("Error fetching video details:", error);
      throw error;
    }
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
      console.log("Search API response:", searchData);

      if (searchData.error) {
        throw new Error(searchData.error.message);
      }

      const videoDetailsPromises = searchData.items.map((item) =>
        getVideoDescription(item.id.videoId, apiKey)
      );
      const videoDetails = await Promise.all(videoDetailsPromises);

      const videoResults = videoDetails
        .map((details) => ({
          title: details.title,
          description: details.description,
          channelTitle: details.channelTitle,
          publishDate: details.publishedAt,
          videoUrl: `https://www.youtube.com/watch?v=${details.id}`,
          repoUrl: extractRepoUrl(details.description),
          thumbnail: details.thumbnails.default.url,
        }))
        .filter((video) => video.repoUrl !== null);

      setVideos(videoResults);
    } catch (error) {
      console.error("An error occurred:", error);
      setError(`Failed to fetch videos: ${error.message}`);
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
    <div className="min-h-screen bg-purple-400 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl shadow-purple-900 p-10">
        <h1 className="text-3xl font-bold text-center mb-6 underline font-mono">
          Curated Tutorial Search
        </h1>

        <div className="flex mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search query"
            className="w-full px-4 py-2 border rounded-tl-3xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-purple-500 text-white px-4 py-2 rounded-br-3xl hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-800 disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-6 max-h-[50vh] overflow-hidden overflow-y-auto p-10 scrollbar-thin">
          {videos.map((video, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-32 h-20 object-cover rounded-md"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
              </div>
              <p className="text-gray-600 mb-2">
                Channel: {video.channelTitle}
              </p>
              <div className="flex space-x-4 mb-2">
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline font-bold"
                >
                  Watch Video
                </a>
                <a
                  href={video.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline font-bold"
                >
                  GitHub Repository
                </a>
              </div>
              <p className="text-gray-700">
                {video.description.slice(0, 200)}...
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
