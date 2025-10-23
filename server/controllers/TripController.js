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

    res.json({ trip, days });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trip details' });
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

// 🟢 Get day details
export const getDay = async (req, res) => {
  try {
    const { dayId } = req.params;
    const day = await Day.getById(dayId);
    if (!day) {
      return res.status(404).json({ error: 'Day not found' });
    }
    res.json(day);
  } catch (err) {
    console.error("Error retrieving day:", err);
    res.status(500).json({ error: "Failed to retrieve day" });
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

// 🟢 Add an event to a day
export const addEventToDay = async (req, res) => {
  try {
    const { dayId } = req.params;
    const event = await Event.create({ ...req.body, day_id: dayId });
    res.status(201).json(event);
  } catch (err) {
    console.error("Error adding event:", err);
    res.status(500).json({ error: "Failed to add event" });
  }
};

