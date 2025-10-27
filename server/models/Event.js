// models/eventModel.js
import pool from "../database.js";

// 🟢 Get all events for a given day
export const getAll = async (dayId) => {
    const { rows } = await pool.query(
        `SELECT * FROM "Events" WHERE day_id = $1 ORDER BY time ASC`,
        [dayId]
    );
    return rows;
};

// 🟢 Get a specific event by ID
export const getById = async (eventId) => {
    const { rows } = await pool.query(
        `SELECT * FROM "Events" WHERE id = $1`,
        [eventId]
    );
    return rows[0];
};

// 🟢 Create a new event for a day
export const create = async (data) => {
  const {
    day_id,
    title,
    notes = "",
    location,
    cost,
    time,
    photo_url = ""
  } = data;

  const { rows } = await pool.query(
    `INSERT INTO "Events" 
      (day_id, title, notes, time, location, cost, photo)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [day_id, title, notes, time, location, cost, photo_url]
  );

  return rows[0];
};

// 🟢 Update an event
export const update = async (eventId, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
        throw new Error("No fields provided for update");
    }

    // Dynamically build the SET clause
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");

    const { rows } = await pool.query(
        `UPDATE "Events"
        SET ${setClause}, updated_at = NOW()
        WHERE id = $${fields.length + 1}
        RETURNING *`,
        [...values, eventId]
    );

    return rows[0];
};

// 🟢 Delete an event
export const remove = async (id) => {
  await pool.query(`DELETE FROM "Events" WHERE id = $1`, [id]);
  return { message: "Event deleted successfully" };
};
