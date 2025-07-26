import express from "express";
import { addPost, getAllPosts, updatePost, deletePost, getUserPosts, getUserSavedPosts, getUserLikedPosts, searchPost, toggleLikePost, toggleSavePost } from "./post.controller.js";
import { verifyToken } from "../../middleware/auth.js";

const postRouter = express.Router();

postRouter.post("/", verifyToken, addPost);
postRouter.put("/:_id", verifyToken, updatePost);
postRouter.delete("/:_id", verifyToken, deletePost);
postRouter.get("/", getAllPosts);
postRouter.get("/search/", searchPost);
postRouter.get("/user/", verifyToken, getUserPosts);
postRouter.get("/saved/", verifyToken, getUserSavedPosts);
postRouter.get("/liked/", verifyToken, getUserLikedPosts);
postRouter.put("/togglelike/:_id", verifyToken, toggleLikePost);
postRouter.put("/togglesave/:_id", verifyToken, toggleSavePost);

export default postRouter;