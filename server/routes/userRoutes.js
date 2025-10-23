import express from "express"
import {
    getUser,
    deleteUser
} from "../controllers/UserController.js";

const router = express.Router();

router.route("/:id")
    .get(getUser)
    .put((req, res) => {
        console.log("Updating user with ID: " + req.params.id);
        res.send(`Update User with ID ${req.params.id}`)
    })
    .delete(deleteUser);

// middleware

router.param("id", (req, res, next, id) => {
    console.log("Requesting user with ID: " + id);
    next();
})
export default router;
