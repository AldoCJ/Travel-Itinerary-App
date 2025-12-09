// middleware/authMiddleware.js

import {getSupabaseAdminClient} from "../supabaseClient.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  // Expecting the frontend to send:  Authorization: Bearer <token>
  const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Missing auth token" });
        }

    const supabase = getSupabaseAdminClient();

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const authId = data.user.id;

    // Fetch the corresponding Users row
    const { data: userRow, error: userError } = await supabase
        .from("Users")
        .select("*")
        .eq("auth_id", authId)
        .single();

    if (userError || !userRow) return res.status(401).json({ error: "User not found in Users table" });

    // Attach the Users row to req.user
    req.user = userRow;

    next();
  }
);
