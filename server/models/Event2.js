import { getSupabaseAdminClient } from "../supabaseClient.js";

// 🟢 Get all days for a trip
export const getByTripId = async (tripId) => {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("Days")
    .select("*")
    .eq("trip_id", tripId)
    .order("date", { ascending: true });

  if (error) throw error;
  return data;
};

// 🟢 Get all days (same as above)
export const getAll = async (tripId) => {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("Days")
    .select("*")
    .eq("trip_id", tripId)
    .order("date", { ascending: true });

  if (error) throw error;
  return data;
};

// 🟢 Get a day by ID
export const getById = async (id) => {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("Days")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// 🟢 Create a day
export const create = async (data) => {
  const supabase = getSupabaseAdminClient();

  const {
    trip_id,
    date,
    summary = "",
    lodging,
    lodging_cost = 0,
    transport_cost = 0,
  } = data;

  const { data: newDay, error } = await supabase
    .from("Days")
    .insert({
      trip_id,
      date,
      summary,
      lodging,
      lodging_cost,
      transport_cost,
    })
    .select()
    .single();

  if (error) throw error;
  return newDay;
};

// 🟢 Update a day
export const update = async (dayId, fields) => {
  const supabase = getSupabaseAdminClient();

  if (!dayId || !fields || Object.keys(fields).length === 0) {
    return null;
  }

  const allowedFields = [
    "date",
    "summary",
    "lodging",
    "lodging_cost",
    "transport_cost",
  ];

  const updateObject = {};

  for (const [key, value] of Object.entries(fields)) {
    if (allowedFields.includes(key)) {
      updateObject[key] = value;
    }
  }

  if (Object.keys(updateObject).length === 0) return null;

  updateObject.updated_at = new Date();

  const { data, error } = await supabase
    .from("Days")
    .update(updateObject)
    .eq("id", dayId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 🟢 Delete a day
export const remove = async (id) => {
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase.from("Days").delete().eq("id", id);

  if (error) throw error;

  return { message: "Day deleted successfully" };
};
