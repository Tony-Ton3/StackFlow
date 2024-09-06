import Stack from "../models/stack.model.js";
import UserTutorials from "../models/tutorial.model.js";
import { errorHandler } from "../utils/error.js";

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
    console.log("user signed out");
  } catch (error) {
    next(error);
  }
};

export const getstack = async (req, res, next) => {
  try {
    const stack = await Stack.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 }) // finds the last created stack
      .limit(1) // Limit to 1 document
      .exec();

    // console.log("Fetched stack:", stack);

    if (!stack) {
      return res.status(404).json({ message: "Stack not found" });
    }

    res.status(200).json(stack);
  } catch (error) {
    console.error("Error fetching stack:", error);
    next(errorHandler(500, "Error fetching stack"));
  }
};

export const getallsavedstacks = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const savedStacks = await Stack.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    if (!savedStacks || savedStacks.length === 0) {
      return res.status(404).json({ message: "No saved stacks found" });
    }

    res.status(200).json(savedStacks);
  } catch (error) {
    console.error("Error fetching stacks:", error);
    next(errorHandler(500, "Error fetching stacks"));
  }
};

export const deletesavedstack = async (req, res, next) => {
  try {
    const { stackId } = req.params;
    const userId = req.user.id;

    // Check if the stack exists and belongs to the user
    const stack = await Stack.findOne({ _id: stackId, userId });

    if (!stack) {
      return res
        .status(404)
        .json({ message: "Stack not found or unauthorized" });
    }

    // Delete the stack
    await Stack.findByIdAndDelete(stackId);

    // Delete associated tutorials
    await UserTutorials.deleteOne({ stackId: stackId });

    res
      .status(200)
      .json({ message: "Stack and associated tutorials deleted successfully" });
  } catch (error) {
    console.error("Error deleting stack:", error);
    next(errorHandler(500, "Error deleting stack"));
  }
};
