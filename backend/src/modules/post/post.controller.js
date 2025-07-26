import { postModel } from "../../../database/models/post.model.js";
import { userModel } from "../../../database/models/user.model.js";


export const addPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.userId;

        const user = await userModel.findById(userId);
        if (user) {
            await postModel.insertMany({ title, description, userId });
            return res.status(200).json({ message: "success" });
        }
        else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.find()
            .sort({ createdAt: -1 })
            .populate("userId", "name -_id");
        return res.status(200).json({ message: "success", posts });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const updatePost = async (req, res) => {
    try {
        const { _id } = req.params;
        const { title, description } = req.body;

        const post = await postModel.findByIdAndUpdate({ _id }, { new: true });
        if (post) {
            if (title !== post.title || description !== post.description) {
                post.title = title, post.description = description, post.edited = true;
                await post.save();
            }
            return res.status(200).json({ message: "success", post });
        }
        else {
            return res.status(404).json({ message: "Post not found" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const deletePost = async (req, res) => {
    try {
        const { _id } = req.params;
        const post = await postModel.findByIdAndDelete({ _id });
        if (post) {
            return res.status(200).json({ message: "success" });
        }
        else {
            return res.status(404).json({ message: "Post not found" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const searchPost = async (req, res) => {
    try {
        const title = req.query.title || "";
        const posts = await postModel.find({
            title: { $regex: title, $options: "i" }
        }).sort({ createdAt: -1 });
        return res.status(200).json({ message: "success", posts });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const id = req.userId;
        const posts = await postModel
            .find({ userId: id })
            .sort({ createdAt: -1 })
            .populate("userId", "name -_id");
        return res.status(200).json({ message: "success", posts });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const getUserSavedPosts = async (req, res) => {
    try {
        const id = req.userId;
        const user = await userModel
            .findById(id)
            .populate("savedPosts.postId");

        const savedPosts = user.savedPosts
            .sort((a, b) => b.savedAt - a.savedAt)
            .map(obj => obj.postId);

        return res.status(200).json({ message: "success", savedPosts });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const getUserLikedPosts = async (req, res) => {
    try {
        const id = req.userId;
        const user = await userModel
            .findById(id)
            .populate("likedPosts.postId");

        const likedPosts = user.likedPosts
            .sort((a, b) => b.likedAt - a.likedAt)
            .map(obj => obj.postId);

        return res.status(200).json({ message: "success", likedPosts });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const toggleSavePost = async (req, res) => {
    try {
        const { _id } = req.params;
        const userId = req.userId;

        const user = await userModel.findById(userId);
        const alreadySaved = user.savedPosts.some(el => el.postId.toString() === _id);

        let saved = false;
        if (alreadySaved) {
            // Unsave
            await userModel.findByIdAndUpdate(userId, {
                $pull: { savedPosts: { postId: _id } }
            });
        } else {
            // Save
            await userModel.findByIdAndUpdate(userId, {
                $addToSet: { savedPosts: { postId: _id, savedAt: new Date() } }
            });
            saved = true;
        }
        return res.status(200).json({ message: "success", saved });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

export const toggleLikePost = async (req, res) => {
    try {
        const { _id } = req.params;
        const userId = req.userId;

        const user = await userModel.findById(userId);
        const alreadyLiked = user.likedPosts.some(el => el.postId.toString() === _id);

        let updatedPost, liked = false;
        if (alreadyLiked) {
            // Unlike
            await userModel.findByIdAndUpdate(userId, {
                $pull: { likedPosts: { postId: _id } }
            });
            updatedPost = await postModel.findByIdAndUpdate(
                _id,
                { $inc: { totalLikes: -1 } },
                { new: true }
            );
        } else {
            // Like
            await userModel.findByIdAndUpdate(userId, {
                $addToSet: { likedPosts: { postId: _id, likedAt: new Date() } }
            });
            updatedPost = await postModel.findByIdAndUpdate(
                _id,
                { $inc: { totalLikes: 1 } }
                , { new: true }
            );
            liked = true;
        }
        return res.status(200).json({ message: "success", liked, totalLikes: updatedPost.totalLikes });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};