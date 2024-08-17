import mongoose from "mongoose";

const StackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    recommendedStack: {
      name: { type: String, required: true },
      technologies: { type: [String], required: true },
      reasoning: { type: String, required: true },
    },
    alternativeStack: {
      name: { type: String, required: true },
      technologies: { type: [String], required: true },
      reasoning: { type: String, required: true },
    },
    gettingStarted: { type: String, required: true },
    additionalAdvice: { type: String, required: true },
  },
  { timestamps: true }
);

const Stack = mongoose.model("Stack", StackSchema);

export default Stack;
