// models/eventModel.js
import pool from "../database.js";

// 🟢 Get all events for a specific day
export const getByDayId = async (dayId) => {
  const { rows } = await pool.query(
    `SELECT * FROM "Events" WHERE day_id = $1 ORDER BY time ASC`,
    [dayId]
  );
  return rows;
};

// 🟢 Get a single event by its ID
export const getById = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM "Events" WHERE id = $1`,
    [id]
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
export const update = async (id, updates) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");

  const { rows } = await pool.query(
    `UPDATE "Events" SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  return rows[0];
};

// 🟢 Delete an event
export const remove = async (id) => {
  await pool.query(`DELETE FROM "Events" WHERE id = $1`, [id]);
  return { message: "Event deleted successfully" };
};
