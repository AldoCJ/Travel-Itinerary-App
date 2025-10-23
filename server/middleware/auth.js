// middleware/authMiddleware.js


import {supabase} from "../supabaseClient.js";

export async function authMiddleware(req, res, next) {
  try {
    // Expecting the frontend to send:  Authorization: Bearer <token>
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Missing auth token" });
    }

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach user info to request object
    req.user = data.user;

    // Move to the next middleware / route
    next();
  } catch (err) {
    res.status(500).json({ error: "Server error during authentication" });
  }
}
