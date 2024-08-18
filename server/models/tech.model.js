import mongoose from "mongoose";

const TechSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, required: true },
    documentation: { type: String, required: true },
    videoTutorials: {
      channelTitle: { type: String, required: true },
      id: { type: String, required: true },
      thumbnail: { type: String, required: true },
      title: { type: String, required: true },
    },
    prerequsites: { type: [String], requried: true },
  },
  { timestamps: true }
);

const Tech = mongoose.model("Tech", TechSchema);

export default Tech;
