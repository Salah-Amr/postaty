import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        savedPosts: [{
            postId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
                required: true
            },
            savedAt: { type: Date, default: Date.now }
        }],
        likedPosts: [{
            postId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
                required: true
            },
            likedAt: { type: Date, default: Date.now }
        }],
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

export const userModel = mongoose.model("User", userSchema);