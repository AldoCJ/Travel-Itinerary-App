// models/eventModel.js
import { getSupabaseAdminClient } from "../supabaseClient.js";

const supabase = getSupabaseAdminClient();

//  Get all events for a given day
export const getAll = async (dayId) => {
  const { data, error } = await supabase
    .from("Events")
    .select("*")
    .eq("day_id", dayId)
    .order("time", { ascending: true });

  if (error) throw error;
  return data;
};

//  Get a specific event by ID
export const getById = async (eventId) => {
  const { data, error } = await supabase
    .from("Events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error) throw error;
  return data;
};

//  Create a new event
export const create = async (data) => {
  const {
    day_id,
    title,
    notes = "",
    location,
    cost,
    time,
    photo_url = "",
  } = data;

  const { data: event, error } = await supabase
    .from("Events")
    .insert({
      day_id,
      title,
      notes,
      location,
      cost,
      time,
      photo: photo_url,
    })
    .select()
    .single();

  if (error) throw error;
  return event;
};

//  Update an event
export const update = async (eventId, updates) => {
  if (!updates || Object.keys(updates).length === 0) {
    throw new Error("No fields provided for update");
  }

  const { data, error } = await supabase
    .from("Events")
    .update({
      ...updates,
      updated_at: new Date(),
    })
    .eq("id", eventId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

//  Delete an event
export const remove = async (id) => {
  const { error } = await supabase
    .from("Events")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return { message: "Event deleted successfully" };
};
