import express from "express"
import {
    getUser,
    deleteUser,
    getAllUsers,
    updateUser
} from "../controllers/UserController.js";

const router = express.Router();


// Get All Users route
router.get("/", getAllUsers);

// By ID routes
router.route("/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);


// middleware

router.param("id", (req, res, next, id) => {
    console.log("Requesting user with ID: " + id);
    next();
})

export default router;