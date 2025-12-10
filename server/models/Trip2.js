// backend/src/models/Trip.js
import {getSupabaseAdminClient } from "../supabaseClient.js";

const supabase = getSupabaseAdminClient();

// Get all trips (optionally with filters)
export const getAll = async (filters = {}) => {
  const { location, userId } = filters;

  let query =  supabase.from("Trips").select("*");

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (location) {
    query = query.ilike("summary", `%${location}%`);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

// Get a specific trip by ID
export const getById = async (id) => {
  const { data, error } = await supabase
    .from("Trips")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// Get trips by User ID
export const getByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("Trips")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

// Create a new trip
export const create = async (data) => {
  const { 
    user_id,
    title,
    summary,
    start_date,
    end_date,
    number_of_people,
    total_price
  } = data;

  const { data: newTrip, error } = await supabase
    .from("Trips")
    .insert({
      user_id,
      title,
      summary,
      start_date,
      end_date,
      number_of_people,
      total_price
    })
    .select()
    .single();

  if (error) throw error;
  return newTrip;
};

// Update an existing trip
export const update = async (tripId, fields) => {
    if (!tripId || !fields || Object.keys(fields).length === 0) {
        return null;
    }

    const allowedFields = ["title", "summary", "start_date", "end_date", "number_of_people", "total_price", "photo_url"];
    const updateFields = {};

    for (const key of Object.keys(fields)) {
        if (allowedFields.includes(key)) {
        updateFields[key] = fields[key];
        }
    }

    if (Object.keys(updateFields).length === 0) return null;

    const { data, error } = await supabase
        .from("Trips")
        .update({
        ...updateFields,
        updated_at: new Date()
        })
        .eq("id", tripId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Delete a trip
export const remove = async (id) => {
  const { error } = await supabase
    .from("Trips")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return { message: "Trip deleted successfully" };
};

// Search for a trip
export const search = async ({ query }) => {
    if (!query || !query.trim()) return [];

    const term = `%${query.trim()}%`;

    // Trips by title
    const { data: tripsByTitle, error: titleError } = await supabase
        .from("Trips")
        .select("id")
        .ilike("title", term);

    if (titleError) throw titleError;

    // Trips by user name
    const { data: users, error: userError } = await supabase
        .from("Users")
        .select("id")
        .ilike("name", term);

    if (userError) throw userError;

    const userIds = users.map(u => u.id);

    let tripsByUsers = [];
    if (userIds.length > 0) {
        const { data, error } = await supabase
            .from("Trips")
            .select("id")
            .in("user_id", userIds);

        if (error) throw error;
        tripsByUsers = data;
    }

    // Trips by event location
    const { data: events, error: eventError } = await supabase
        .from("Events")
        .select(`
      id,
      Days (
        trip_id
      )
    `)
        .ilike("location", term);

    if (eventError) throw eventError;

    // Merge unique Trip IDs
    const tripIds = new Set([
        ...tripsByTitle.map(t => t.id),
        ...tripsByUsers.map(t => t.id),
        ...events.map(e => e.Days?.trip_id).filter(Boolean),
    ]);

    if (tripIds.size === 0) return [];

    // Fetch FINAL frontend-ready trips
    const { data: trips, error: finalError } = await supabase
        .from("Trips")
        .select(`
      id,
      title,
      summary,
      start_date,
      end_date,
      total_price,
      photo_url,
      Users (
        id,
        name,
        profile_pic_url
      )
    `)
        .in("id", [...tripIds]);

    if (finalError) throw finalError;

    return trips;
};