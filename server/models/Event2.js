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

// ---------------------------------------------------------
// 🟢 Get an event by ID
// ---------------------------------------------------------
export const getById = async (eventId) => {

    const { data, error } = await supabase
        .from("Events")
        .select("*")
        .eq("id", eventId)
        .single();

    if (error) throw error;
    return data;
};

// ---------------------------------------------------------
// 🟢 Create a new event
// ---------------------------------------------------------
export const create = async (fields) => {

    const {
        day_id,
        title,
        notes = "",
        location,
        cost = 0,
        time,
        photo = null
    } = fields;

    // Validate required fields (non-nullables in schema)
    if (!day_id) throw new Error("day_id is required");
    if (!title?.trim()) throw new Error("title is required");
    if (!location?.trim()) throw new Error("location is required");
    if (!time) throw new Error("time is required");

    const { data, error } = await supabase
        .from("Events")
        .insert({
            day_id,
            title,
            notes,
            location,
            cost,
            time,
            photo,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ---------------------------------------------------------
// 🟢 Update an event
// ---------------------------------------------------------
export const update = async (eventId, fields) => {

    if (!eventId) throw new Error("eventId is required");
    if (!fields || Object.keys(fields).length === 0) {
        throw new Error("No fields provided for update");
    }

    // Only allow valid updatable fields
    const allowedFields = [
        "title",
        "notes",
        "location",
        "cost",
        "time",
        "photo",
    ];

    const updateObject = {};

    // filter only allowed keys
    for (const [key, value] of Object.entries(fields)) {
        if (allowedFields.includes(key)) {
            updateObject[key] = value;
        }
    }

    if (Object.keys(updateObject).length === 0) {
        throw new Error("No valid fields provided for update");
    }

    // Required fields must not be updated to empty values
    if (updateObject.title !== undefined && !updateObject.title.trim()) {
        throw new Error("title cannot be empty");
    }

    if (updateObject.location !== undefined && !updateObject.location.trim()) {
        throw new Error("location cannot be empty");
    }

    if (updateObject.time !== undefined && updateObject.time === "") {
        throw new Error("time cannot be empty");
    }

    updateObject.updated_at = new Date();

    const { data, error } = await supabase
        .from("Events")
        .update(updateObject)
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
