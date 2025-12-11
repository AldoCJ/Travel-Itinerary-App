import * as User from "../models/User2.js";
import cloudinary from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";


// Get a user by ID
export const getUser = asyncHandler(async (req, res) => {
    const user = await User.getById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    res.status(200).json(user);
});
// Remove a user by ID
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400);
        throw new Error("userId is required");
    }

    const msg = await User.remove(id);

    res.status(200).json({ message: msg });
});

// Get All Users
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.getAll();
    res.status(200).json(users);
});

// Update a User Profile (Public Data Only)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;  
        const updates = req.body;

        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "No fields provided for update" });
        }

        const updatedUser = await User.update(id, updates);

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
};

export const updateUserProfilePicture = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const user = await User.getById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const filePath = req.file.path;

        const result = await cloudinary.uploader.upload(filePath, {
            folder: "profile_pictures",
            public_id: `user_${id}_pfp`,
            overwrite: true,
            resource_type: "image"
        });

        const updatedUser = await User.update(id, { profile_pic_url: result.secure_url });

        fs.unlinkSync(filePath);
        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ error: "Failed to update profile picture" });
    }
}

export const getUserTrips = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400);
        throw new Error("Id is required.");
    }

    const trips = await User.getTripsByUserId(id);
    res.status(200).json(trips);
});