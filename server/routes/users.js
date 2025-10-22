import express from "express"

const router = express.Router();

router.route("/:id")
    .get((req, res) => {
        console.log("Getting user with ID: " + req.params.id);
        res.send(`Get User With ID ${req.params.id}`)
    })
    .put((req, res) => {
        console.log("Updating user with ID: " + req.params.id);
        res.send(`Update User with ID ${req.params.id}`)
    })
    .delete((req, res) => {
        console.log("Deleting user with ID: " + req.params.id);
        res.send(`Delete User with ID ${req.params.id}`)
    })

// middleware

router.param("id", (req, res, next, id) => {
    console.log("Requesting user with ID: " + id);
    next();
})
export default router;
