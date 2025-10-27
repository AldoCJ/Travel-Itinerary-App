import express from 'express';
import {
  createTrip,
  getTrip,
  getTripDetails,
  updateTrip,
  deleteTrip,
  addDay,
  updateDay,
  removeDay,
  addEvent,
  updateEvent,
  removeEvent
} from "../controllers/TripController.js";

const router = express.Router();

router.route('/:tripId')
    .get(getTripDetails)
    .put(updateTrip)
    .delete(deleteTrip);


router.route('/')
    .post(createTrip)
    .get((req, res) => {
        console.log("Listing all trip thumbnails with params: ", req.query);
        res.send('Get all Trips');
    });

router.route('/:tripId/days')
    .post(addDay)

router.route('/:tripId/days/:dayId')
    .put(updateDay)
    .delete(removeDay);

router.route('/:tripId/days/:dayId/events')
    .post(addEvent);

router.route('/:tripId/days/:dayId/events/:eventId')
    .put(updateEvent)
    .delete(removeEvent);

export default router;
