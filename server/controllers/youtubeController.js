import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export const getTutorialsForTechnology = async (req, res) => {
  const { technology } = req.params;
  const maxResults = 3; //returns 3 videos for now

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: `${technology} tutorial`,
          type: "video",
          maxResults,
          key: YOUTUBE_API_KEY,
        },
      }
    );

    const tutorials = response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
    }));

    res.json(tutorials);
  } catch (error) {
    console.error(`Error fetching tutorials for ${technology}:`, error);
    res.status(500).json({ error: "Failed to fetch tutorials" });
  }
};
