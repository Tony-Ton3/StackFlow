import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    channelTitle: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const UserTutorialsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    stackTutorials: [VideoSchema],
  },
  { timestamps: true }
);

const UserTutorials = mongoose.model("UserTutorials", UserTutorialsSchema);

export default UserTutorials;
