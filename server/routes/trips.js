import express from 'express';

const router = express.Router();

router.route('/:tripId')
    .get((req, res) => {
        console.log("Getting trips for trip ID: " + req.params.tripId);
        res.send(`Get Trips for Trip ID ${req.params.tripId}`);
    })
    .put((req, res) => {
        console.log("Updating trips for trip ID: " + req.params.tripId);
        res.send(`Update Trips for Trip ID ${req.params.tripId}`);
    })
    .delete((req, res) => {
        console.log("Deleting trips for trip ID: " + req.params.tripId);
        res.send(`Delete Trips for Trip ID ${req.params.tripId}`);
    });

router.route('/')
    .post((req, res) => {
        console.log("Creating a new trip");
        res.send('Create a new Trip');
    });

router.route('/')
    .get((req, res) => {
        console.log("Listing all trip thumbnails with params: ", req.query);
        res.send('Get all Trips');
    });

export default router;
