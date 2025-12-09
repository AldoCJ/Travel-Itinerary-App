import {createClient} from "@supabase/supabase-js";

import dotenv from "dotenv";
dotenv.config(); // load .env

export function getSupabaseClient() {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY
    );
}

export function getSupabaseAdminClient() {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
}