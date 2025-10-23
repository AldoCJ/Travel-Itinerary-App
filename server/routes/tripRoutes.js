import express from 'express';
import {
  createTrip,
  getTrip,
  getTripDetails,
  addDay,
  addEventToDay,
  updateTrip,
  deleteTrip
} from "../controllers/TripController.js";

const router = express.Router();

router.route('/:tripId')
    .get(getTrip)
    .put(updateTrip)
    .delete(deleteTrip);


router.route('/')
    .post(createTrip)
    .get((req, res) => {
        console.log("Listing all trip thumbnails with params: ", req.query);
        res.send('Get all Trips');
    });

export default router;
