import * as User from "../models/User.js";

// 🟢 Get a user by ID
export const getUser = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// 🟢 Remove a user by ID
export const deleteUser = async (req, res) => {
  try {
    await User.remove(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ error: "Failed to retrieve users" });
    }
};

// Update a User Profile (Public Data Only)
// HAVE TO DISABLE AUTH FROM INDEX.JS FIRST (UNTIL AUTH IS IMPLEMENTED IN ROUTES)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;  // User ID passed in the URL
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