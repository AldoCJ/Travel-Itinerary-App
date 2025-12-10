import express from 'express';
import {
    createTrip,
    getAllTrips,
    getTripDetails,
    updateTrip,
    updateTripPicture,
    deleteTrip,
    addDay,
    updateDay,
    removeDay,
    addEvent,
    updateEvent,
    updateEventPhoto,
    removeEvent,
    getDay,
    getAllDays,
    getEvent,
    getAllEvents,
    searchTrips
} from "../controllers/TripController.js";

import upload from '../middleware/multerUpload.js';

const router = express.Router();

router.get("/search", searchTrips);

router.route('/:tripId')
    .get(getTripDetails)
    .patch(updateTrip)
    .delete(deleteTrip);

router.patch('/:tripId/picture', upload.single('picture'), updateTripPicture);

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

router.patch('/:tripId/days/:dayId/events/:eventId/picture', upload.single('picture'), updateEventPhoto);

export default router;
