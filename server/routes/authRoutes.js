import express from "express";
import { supabase, supabaseAdmin } from "../supabaseClient.js";

const router = express.Router();

// Sign up a new account
router.post("/signup", async (req, res) => {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
        console.error("Signup error: Missing email or password");
        return res.status(400).json({ error: "Email and password are required" });
    }

    // Sign up user with Supabase
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        console.error("Signup error:", error);
        return res.status(400).json({ error: error.message });
    }

    const user = data.user
    console.log("New user ID:", user.id);
    const { error: updateError } = await supabaseAdmin
        .from('Users')
        .upsert([{ id: user.id, name: name }]);

    if (updateError) {
        console.error("Error updating user profile:", updateError);
        return res.status(500).json({ error: "Error updating user profile" });
    }

    // Respond with user info (excluding password)
    console.log("User signed up:", data.user);
    res.status(201).json({ user: { id: data.user.id, email: data.user.email } });
});

// Sign in an existing account
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.error("Signin error: Missing email or password");
        return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error("Signin error:", error);
        return res.status(400).json({ error: error.message });
    }

    // Respond with user info (excluding password)
    console.log("User signed in:", data.user);
    res.status(200).json({ 
        user: { 
            id: data.user.id, 
            email: data.user.email 
        },
        access_token: data.session?.access_token
    });
});
export default router;
