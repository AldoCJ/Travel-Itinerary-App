import * as Trip from '../models/Trip2.js';
import * as Day from '../models/Day2.js';
import * as Event from '../models/Event2.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

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
// ***Error checking needs to be revised***
export const updateTrip = asyncHandler(async (req, res) => {
    const { tripId } = req.params;
    const fields = req.body;

    if (!tripId) {
        res.status(400);
        throw new Error("tripId is required");
    }

    const requiredFields = ["title", "summary", "start_date", "end_date"];

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

export const updateTripPicture = asyncHandler(async (req, res) => {
    const { tripId } = req.params;

    if (!tripId) {
        res.status(400);
        throw new Error("tripId is required");
    }

    if (!req.file) {
        res.status(400);
        throw new Error("No file uploaded");
    }

    const trip = await Trip.getById(tripId);
    if (!trip) {
        res.status(404);
        throw new Error("Trip not found");
    }

    const filePath = req.file.path;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
                folder: "trip_photos",
                public_id: `trip_${tripId}_photo`,
                overwrite: true,
                width: 1920,
                height: 1080,
                crop: "limit",
                resource_type: "image"
            });

    const updatedTrip = await Trip.update(tripId, { photo_url: result.secure_url });

    fs.unlinkSync(filePath);
    
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

// 🟢 Add a day to a trip
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
        throw new Error("Dat not found");
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

    res.status(200).json(updated);
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

export const getAllEvents = async (req, res) => {
    try {
        const { dayId } = req.params;
        const events = await Event.getAll(dayId);

        if (!events.length) {
            return res.status(404).json({ message: "No events found for this day" });
        }

        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Failed to retrieve events" });
    }
};

export const getEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.getById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ error: "Failed to retrieve event" });
    }
};

// Add an event to a day
export const addEvent = async (req, res) => {
  try {
    const { dayId } = req.params;
    const event = await Event.create({ day_id : dayId, ...req.body });
    res.status(201).json(event);
  } catch (err) {
    console.error("Error adding event:", err);
    res.status(500).json({ error: "Failed to add event" });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const updates = req.body;

        console.log("Updating event:", eventId, updates);

        const updatedEvent = await Event.update(eventId, updates);

        if (!updatedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ error: "Failed to update event" });
    }
};

export const updateEventPhoto = asyncHandler(async (req, res) => {
    const { eventId } = req.params;

    if (!eventId) {
        res.status(400);
        throw new Error("eventId is required");
    }

    if (!req.file) {
        res.status(400);
        throw new Error("No file uploaded");
    }

    const filePath = req.file.path;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
                folder: "event_photos",
                public_id: `event_${eventId}_photo`,
                overwrite: true,
                width: 1920,
                height: 1080,
                crop: "limit",
                resource_type: "image"
            });

    const updatedEvent = await Event.update(eventId, { photo_url: result.secure_url });
    if (!updatedEvent) {
        res.status(404);
        throw new Error("Event not found");
    }

    fs.unlinkSync(filePath);
    res.status(200).json(updatedEvent);
});

// Remove an event
export const removeEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    await Event.remove(eventId);
    res.json({ message: "Event removed successfully" });
  } catch (err) {
    console.error("Error removing event:", err);
    res.status(500).json({ error: "Failed to remove event" });
  }
};
