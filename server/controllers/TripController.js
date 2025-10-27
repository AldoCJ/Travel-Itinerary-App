import * as Trip from '../models/Trip.js';
import * as Day from '../models/Day.js';
import * as Event from '../models/Event.js';

// -------------------- Trip Controllers -------------------- //

export const createTrip = async (req, res) => {
  try {
    const tripData = req.body;
    const newTrip = await Trip.create(tripData);
    res.status(201).json(newTrip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trip' });
  }
};

export const getTrip = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const trip = await Trip.getById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json(trip);

    } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trip' });
  }
};

export const getAllTrips = async (req, res) => {
    try {
        console.log("Fetching all trips...");

        // Optional filters via query parameters
        const filters = {
            userId: req.query.userId || null,
            location: req.query.location || null,
        };

        const trips = await Trip.getAll(filters);

        res.status(200).json(trips);
    } catch (error) {
        console.error("Error fetching trips:", error);
        res.status(500).json({ error: "Failed to fetch trips" });
    }
};

export const getTripDetails = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const trip = await Trip.getById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const days = await Day.getByTripId(tripId);
    for (let day of days) {
      const events = await Event.getByDayId(day.id);
      day.events = events;
    }

    res.json({ trip, days });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trip details' });
  }
};

export const getUserTrips = async (req, res) => {
  try {
    const userId = req.params.userId;
    const trips = await Trip.getByUserId(userId);
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user trips' });
  }
};

// 🟢 Update a trip
export const updateTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        console.log(`Updating trip with ID: ${tripId}`);
        console.log(`Request body:`, req.body);

        if (!tripId) {
            return res.status(400).json({ error: "Trip ID is required" });
        }

        const updatedTrip = await Trip.update(tripId, req.body);

        if (!updatedTrip) {
            return res.status(404).json({ error: "Trip not found" });
        }

        res.status(200).json({
            message: "Trip updated successfully",
            trip: updatedTrip
        });
    } catch (err) {
        console.error("Error updating trip:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🟢 Delete a trip
export const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    await Trip.remove(tripId);
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error("Error deleting trip:", err);
    res.status(500).json({ error: "Failed to delete trip" });
  }
};

// -------------------- Day Controllers -------------------- //

// 🟢 Add a day to a trip
export const addDay = async (req, res) => {
  try {
    const { tripId } = req.params;
    const day = await Day.create({ trip_id: tripId, ...req.body });
    res.status(201).json(day);
  } catch (err) {
    console.error("Error adding day:", err);
    res.status(500).json({ error: "Failed to add day" });
  }
};

// Get All Days from Trip
export const getAllDays = async (req, res) => {
    try {
        const { tripId } = req.params;
        const days = await Day.getAll(tripId);
        if (!days.length) {
            return res.status(404).json({ message: "No days found for this trip" });
        }
        res.status(200).json(days);
    } catch (error) {
        console.error("Error fetching days:", error);
        res.status(500).json({ error: "Failed to retrieve days" });
    }
};

// Get Day by ID
export const getDay = async (req, res) => {
    try {
        const { dayId } = req.params;
        const day = await Day.getById(dayId);
        if (!day) {
            return res.status(404).json({ message: "Day not found" });
        }
        res.status(200).json(day);
    } catch (error) {
        console.error("Error fetching day:", error);
        res.status(500).json({ error: "Failed to retrieve day" });
    }
};

// Update a day
export const updateDay = async (req, res) => {
    try {
        const { tripId, dayId } = req.params;
        console.log(`Updating day with ID: ${dayId} for trip ${tripId}`);
        console.log(`Request body:`, req.body);

        if (!dayId) {
            return res.status(400).json({ error: "Day ID is required" });
        }

        const updatedDay = await Day.update(dayId, req.body);

        if (!updatedDay) {
            return res.status(404).json({ error: "Day not found or no valid fields provided" });
        }

        res.status(200).json({
            message: "Day updated successfully",
            day: updatedDay
        });
    } catch (err) {
        console.error("Error updating day:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Remove day
export const removeDay = async (req, res) => {
  try {
    const { dayId } = req.params;
    await Day.remove(dayId);
    res.json({ message: "Day removed successfully" });
  } catch (err) {
    console.error("Error removing day:", err);
    res.status(500).json({ error: "Failed to remove day" });
  }
};

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
