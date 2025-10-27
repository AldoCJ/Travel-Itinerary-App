import pool from '../database.js';

export const getByTripId = async (tripId) => {
  const { rows } = await pool.query(
    `SELECT * FROM "Days" WHERE trip_id = $1 ORDER BY date`,
    [tripId]
  );
  return rows;
};

export const getById = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM "Days" WHERE id = $1`,
    [id]
  );
  return rows[0];
};

export const create = async (data) => {
  const {
    trip_id,
    date,
    summary = "",
    lodging,
    lodging_cost = 0,
    transport_cost = 0,
  } = data;
  const { rows } = await pool.query(
    `INSERT INTO "Days" (trip_id, date, summary, lodging, lodging_cost, transport_cost)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [trip_id, date, summary, lodging, lodging_cost, transport_cost]
  );
  return rows[0];
};

// 🟢 Update a day
export const update = async (dayId, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) return null;

    // Dynamically build SET clause
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');

    const { rows } = await pool.query(
        `UPDATE "Days" SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
        [...values, dayId]
    );

    return rows[0];
};

// 🟢 Delete a day
export const remove = async (id) => {
  await pool.query(`DELETE FROM "Days" WHERE id = $1`, [id]);
  return { message: "Day deleted successfully" };
};