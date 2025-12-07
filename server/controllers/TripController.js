import * as Trip from '../models/Trip2.js';
import * as Day from '../models/Day2.js';
import * as Event from '../models/Event2.js';
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper functiion: Check empty strings/null/undefined
const isEmpty = (value) =>
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "");

// -------------------- Trip Controllers -------------------- //

// Create trip
export const createTrip = asyncHandler(async (req, res) => {
    const {
        user_id,
        title,
        summary,
        start_date,
        end_date,
        number_of_people,
        total_price
    } = req.body;

    // Error checking for required fields
    if (!user_id) {
        res.status(400);
        throw new Error("user_id is required");
    }
    if (!title) {
        res.status(400);
        throw new Error("title is required");
    }
    if (!start_date) {
        res.status(400);
        throw new Error("start_date is required");
    }
    if (!end_date) {
        res.status(400);
        throw new Error("end_date is required");
    }
    if (!number_of_people) {
        res.status(400);
        throw new Error("number_of_people is required");
    }
    if (!total_price) {
        res.status(400);
        throw new Error("total_price is required");
    }

    const newTrip = await Trip.create(req.body);
    res.status(201).json(newTrip);
});

// Get trip by id
export const getTrip = asyncHandler(async (req, res) => {
    const tripId = req.params.tripId;
    if (!tripId) {
        res.status(400);
        throw new Error("tripId is required");
    }

    const trip = await Trip.getById(tripId);
    if (!trip) {
        return res.status(404);
        throw new Error('Trip not found');
    }

    res.status(200).json(trip);
});

// Get all trips
export const getAllTrips = asyncHandler(async (req, res) => {
    const filters = {
        userId: req.query.userId || null,
        location: req.query.location || null,
    };

    const trips = await Trip.getAll(filters);

    res.status(200).json(trips);
});

// Get full trip details by id
export const getTripDetails = asyncHandler(async (req, res) => {
    const tripId = req.params.tripId;
    if (!tripId) {
        res.status(400);
        throw new Error("tripId is required");
    }

    const trip = await Trip.getById(tripId);
    if (!trip) {
        res.status(404);
        throw new Error("Trip not found")
    }

    const days = await Day.getByTripId(tripId);

    // Fetch events for each day in parallel
    const daysWithEvents = await Promise.all(
        days.map(async (day) => {
            const events = await Event.getAll(day.id);
            return { ...day, events };
        })
    );

    res.status(200).json({ trip, days: daysWithEvents });
});

// Get trips by user id
export const getUserTrips = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        res.status(400);
        throw new Error("userId is required");
    }

    const trips = await Trip.getByUserId(userId);
    res.status(200).json(trips);
});

// Update a trip
export const updateTrip = asyncHandler(async (req, res) => {
    const { tripId } = req.params;
    const fields = req.body;

    if (!tripId) {
        res.status(400);
        throw new Error("tripId is required");
    }

    const requiredFields = ["title", "start_date", "end_date", "number_of_people", "total_price"];

    for (const field of requiredFields) {
        if (field in fields) {
            if (
                fields[field] === "" ||
                fields[field] === null ||
                fields[field] === undefined
            ) {
                res.status(400);
                throw new Error(`Field "${field}" cannot be empty`);
            }
        }
    }

    const updatedTrip = await Trip.update(tripId, fields);

    if (!updatedTrip) {
        res.status(404);
        throw new Error("Trip not found");
    }

    res.status(200).json(updatedTrip);
});

// Delete a trip
export const deleteTrip = asyncHandler(async (req, res) => {
    const { tripId } = req.params;
    if (!tripId) {
        res.status(400);
        throw new Error("tripId is required");
    }

    const msg = await Trip.remove(tripId);
    res.status(200).json({ message: msg });
});

// -------------------- Day Controllers -------------------- //

// Add a day to a trip
export const addDay = asyncHandler(async (req, res) => {
    const { tripId } = req.params;
    const data = req.body;
    if (!tripId) {
        res.status(400);
        throw new Error("tripId is required");
    }

    if (!data.date || data.date.trim() === "") {
        res.status(400);
        throw new Error("Field \"date\" is required anc cannot be empty");
    }

    const day = await Day.create({ trip_id: tripId, ...data });
    res.status(201).json(day);
});

// Get All Days from Trip
export const getAllDays = asyncHandler(async (req, res) => {
    const { tripId } = req.params;
    if (!tripId) {
        res.status(400);
        throw new Error("tripdId is required");
    }

    const days = await Day.getAll(tripId);
    if (!days.length) {
        res.status(404);
        throw new Error("No days found for this trip");
    }

    res.status(200).json(days);
});

// Get Day by ID
export const getDay = asyncHandler(async (req, res) => {
    const { dayId } = req.params;
    if (!dayId) {
        res.status(400);
        throw new Error("dayId is required");
    }

    const day = await Day.getById(dayId);
    if (!day) {
        res.status(404);
        throw new Error("Day not found");
    }
    res.status(200).json(day);
});

// Update a day
export const updateDay = asyncHandler(async (req, res) => {
    const { dayId } = req.params;
    const fields = req.body;

    if (!dayId) {
        res.status(400);
        throw new Error("Day ID is required");
    }

    const requiredFields = ["date"];

    for (const field of requiredFields) {
        if (field in fields) {
            if (
                fields[field] === "" ||
                fields[field] === null ||
                fields[field] === undefined
            ) {
                res.status(400);
                throw new Error(`Field "${field}" cannot be empty`);
            }
        }
    }

    const updatedDay = await Day.update(dayId, fields);

    if (!updatedDay) {
        res.status(404);
        throw new Error("Day not found");
    }

    res.status(200).json(updatedDay);
});

// Remove day
export const removeDay = asyncHandler(async (req, res) => {
    const { dayId } = req.params;
    if (!dayId) {
        res.status(400);
        throw new Error("Day ID is required");
    }

    const msg = await Day.remove(dayId);
    res.status(200).json({ message: msg });
});

// -------------------- Event Controllers -------------------- //

export const getAllEvents = asyncHandler(async (req, res) => {
    const { dayId } = req.params;
    if (!dayId) {
        res.status(400);
        throw new Error("Day ID is required");
    }

    const events = await Event.getAll(dayId);

    if (!events || events.length === 0) {
        res.status(404);
        throw new Error("No events found for this day.");
    }

    res.status(200).json(events);
});

export const getEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    if (!eventId) {
        res.status(400);
        throw new Error("Event ID is required.");
    }

    const event = await Event.getById(eventId);

    if (!event) {
        res.status(404);
        throw new Error("Event not found.");
    }

    res.status(200).json(event);
});

// Add an event to a day
export const addEvent = asyncHandler(async (req, res) => {
    const { dayId } = req.params;
    const { title, location, cost, time } = req.body;

    if (isEmpty(title)) {
        res.status(400);
        throw new Error("Title is required.");
    }

    if (isEmpty(location)) {
        res.status(400);
        throw new Error("Location is required.");
    }

    if (cost !== undefined && (isNaN(cost) || cost === "")) {
        res.status(400);
        throw new Error("Cost must be a valid number.");
    }

    if (isEmpty(time)) {
        res.status(400);
        throw new Error("Time is required.");
    }

    const event = await Event.create({ day_id : dayId, ...req.body });
    res.status(201).json(event);
});

// Update an event
export const updateEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const fields = req.body;

    if (!eventId) {
        res.status(400);
        throw new Error("Event ID is required.");
    }

    const existing = await Event.getById(eventId);
    if (!existing) {
        res.status(404);
        throw new Error("Event not found.");
    }

    const requiredFields = ["title", "location", "cost", "time"];

    for (const field of requiredFields) {
        if (field in fields) {
            if (
                fields[field] === "" ||
                fields[field] === null ||
                fields[field] === undefined
            ) {
                res.status(400);
                throw new Error(`Field "${field}" cannot be empty`);
            }
        }
    }

    const updatedEvent = await Event.update(eventId, fields);

    if (!updatedEvent) {
        res.status(400);
        throw new Error("Could not update event.");
    }

    res.status(200).json(updatedEvent);
});

// Remove an event
export const removeEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params;

    const existing = await Event.getById(eventId);
    if (!existing) {
        res.status(404);
        throw new Error("Event not found");
    }

    const msg = await Event.remove(eventId);
    res.status(200).json({ message: msg });
});
