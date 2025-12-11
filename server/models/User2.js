import { getSupabaseAdminClient } from "../supabaseClient.js";

const supabase = getSupabaseAdminClient();

// 🟢 Get a user by ID
export const getById = async (id) => {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// Delete a user
export const remove = async (id) => {
    // 1. Check if user exists
    const { data: user, error: userError } = await supabase
        .from("Users")
        .select("id")
        .eq("id", id)
        .single();

    if (userError) throw userError;
    if (!user) throw new Error("User not found");

    // 2. Delete user (Supabase will handle FK with CASCADE if enabled)
    const { error: deleteError } = await supabase
        .from("Users")
        .delete()
        .eq("id", id);

    if (deleteError) throw deleteError;

    // 3. Return clean message for controller
    return "User deleted successfully";
};

// Get all users
export const getAll = async () => {
  const { data, error } = await supabase.from("Users").select("*");
  if (error) throw error;
  return data;
};

// Update user profile (public fields only)
export const update = async (id, updates) => {
  if (!updates || Object.keys(updates).length === 0) return null;

  // Optional: whitelist allowed fields
  const allowedFields = ["name", "profile_pic_url", "about_me"];
  const updateObject = {};

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      updateObject[key] = value;
    }
  }

  if (Object.keys(updateObject).length === 0) return null;

  const { data, error } = await supabase
    .from("Users")
    .update(updateObject)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTripsByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("Trips")
    .select("*")
    .eq("user_id", userId);

    if (error) throw error;
    return data;
}
