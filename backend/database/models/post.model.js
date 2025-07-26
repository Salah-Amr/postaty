import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    edited: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

export const postModel = mongoose.model("Post", postSchema);