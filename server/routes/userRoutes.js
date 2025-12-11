import express from "express";
import {
    getUser,
    deleteUser,
    getAllUsers,
    updateUser,
    updateUserProfilePicture,
    getUserTrips
} from "../controllers/UserController.js";

import upload from "../middleware/multerUpload.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Get All Users route
router.get("/", getAllUsers);

// By ID routes
router.route("/:id")
    .get(getUser)
    .patch(authMiddleware, updateUser)

router.delete("/me", authMiddleware, deleteUser);

router.patch("/:id/pfp", authMiddleware, upload.single("pfp"), updateUserProfilePicture);

// Get User Trips route

router.get("/:id/trips", getUserTrips);

export default router;