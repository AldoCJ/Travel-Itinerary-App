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

const router = express.Router();

// Get All Users route
router.get("/", getAllUsers);

// By ID routes
router.route("/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

router.patch("/:id/pfp", upload.single("pfp"), updateUserProfilePicture);

// Get User Trips route

router.get("/:id/trips", getUserTrips);

export default router;