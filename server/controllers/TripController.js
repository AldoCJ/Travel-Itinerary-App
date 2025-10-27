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
    const trip = await Trip.update(tripId, req.body);
    res.json(trip);
  } catch (err) {
    console.error("Error updating trip:", err);
    res.status(500).json({ error: "Failed to update trip" });
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

// Update a day
export const updateDay = async (req, res) => {
  try {
    const { dayId } = req.params;
    const updatedDay = await Day.update(dayId, req.body);
    res.json(updatedDay);
  } catch (err) {
    console.error("Error updating day:", err);
    res.status(500).json({ error: "Failed to update day" });
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
    const { eventId } = req.params.eventId;
    const updatedEvent = await Event.update(eventId, req.body);
    res.json(updatedEvent);
  } catch (err) {
    console.error("Error updating event:", err);
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
