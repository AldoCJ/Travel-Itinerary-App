// backend/src/models/Trip.js
import pool from '../database.js';

// 🟢 Get all trips (optionally with filters)
export const getAll = async (filters = {}) => {
  const { location, userId } = filters;
  let query = `SELECT * FROM "Trips"`;
  const params = [];

  // Apply filters dynamically
  if (userId) {
    params.push(userId);
    query += ` WHERE user_id = $${params.length}`;
  }
  if (location) {
    params.push(`%${location}%`);
    query += params.length === 1 ? ' WHERE' : ' AND';
    query += ` summary ILIKE $${params.length}`;
  }

  const { rows } = await pool.query(query, params);
  return rows;
};

// 🟢 Get a specific trip by ID
export const getById = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM "Trips" WHERE id = $1`,
    [id]
  );
  return rows[0];
};

// 🟢 Create a new trip
export const create = async (data) => {
  const {
    user_id,
    title,
    summary,
    start_date,
    end_date,
    number_of_people,
    total_price
  } = data;

  const { rows } = await pool.query(
    `INSERT INTO "Trips" (user_id, title, summary, start_date, end_date, number_of_people, total_price)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [user_id, title, summary, start_date, end_date, number_of_people, total_price]
  );

  return rows[0];
};

// 🟢 Update an existing trip
export const update = async (id, updates) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  // Dynamically build SET clause
  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE "Trips" SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  return rows[0];
};

// 🟢 Delete a trip
export const remove = async (id) => {
  await pool.query(`DELETE FROM "Trips" WHERE id = $1`, [id]);
  return { message: 'Trip deleted successfully' };
};


