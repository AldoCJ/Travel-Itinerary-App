import express from "express";
import { getSupabaseClient, getSupabaseAdminClient } from "../supabaseClient.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
const supabaseAdmin = getSupabaseAdminClient();

// Sign up a new account
router.post("/signup", asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: "Email, password, and name are required" });
    }

    // Use admin method to create user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true  // Optional: auto-confirm user to simplify testing
    });

    if (authError) return res.status(400).json({ error: authError.message });

    const authUserId = authData.user.id;

    // Create row in AuthUsers
    const { error: authUserError } = await supabaseAdmin
        .from("AuthUsers")
        .insert([{ id: authUserId, name }]);

    if (authUserError) return res.status(500).json({ error: "Error creating AuthUsers row" });

    // Create row in Users and link via auth_id
    const { data: userData, error: userError } = await supabaseAdmin
        .from("Users")
        .insert([{ name, auth_id: authUserId }])
        .select()
        .single();

    if (userError) return res.status(500).json({ error: "Error creating Users row" });

    res.status(201).json({
        user: {
            id: userData.id,
            email,
            auth_id: authUserId
        },
        access_token: null // No session created here; frontend will need to call signIn
    });
}));

// Sign in an existing user
router.post("/signin", asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const supabaseClient = getSupabaseClient(); // <-- normal client with anon key

    // Sign in
    const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (signInError) return res.status(400).json({ error: signInError.message });
    if (!signInData.session) return res.status(401).json({ error: "Could not create session" });

    // Fetch corresponding Users row
    const { data: userData, error: userDataError } = await supabaseAdmin
        .from("Users")
        .select("*")
        .eq("auth_id", signInData.user.id)
        .single();

    if (userDataError || !userData) return res.status(500).json({ error: "Could not fetch linked Users row" });

    res.status(200).json({
        user: {
            id: userData.id,
            email: signInData.user.email,
            auth_id: signInData.user.id
        },
        access_token: signInData.session.access_token
    });
}));


export default router;
