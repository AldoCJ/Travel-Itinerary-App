import express from 'express';
import {
  createTrip,
  getAllTrips,
  getTripDetails,
  updateTrip,
  deleteTrip,
  addDay,
  updateDay,
  removeDay,
  addEvent,
  updateEvent,
  removeEvent,
  getDay,
  getAllDays,
  getEvent,
  getAllEvents
} from "../controllers/TripController.js";

const router = express.Router();

router.route('/:tripId')
    .get(getTripDetails)
    .patch(updateTrip)
    .delete(deleteTrip);


router.route('/')
    .post(createTrip)
    .get(getAllTrips);

router.route('/:tripId/days')
    .post(addDay)
    .get(getAllDays)

router.route('/:tripId/days/:dayId')
    .get(getDay)
    .patch(updateDay)
    .delete(removeDay);

router.route('/:tripId/days/:dayId/events')
    .post(addEvent)
    .get(getAllEvents);

router.route('/:tripId/days/:dayId/events/:eventId')
    .get(getEvent)
    .patch(updateEvent)
    .delete(removeEvent);

export default router;
