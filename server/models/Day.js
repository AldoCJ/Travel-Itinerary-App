import pool from '../database.js';

export const getByTripId = async (tripId) => {
  const { rows } = await pool.query(
    `SELECT * FROM "Days" WHERE trip_id = $1 ORDER BY date`,
    [tripId]
  );
  return rows;
};

export const getAll = async (tripId) => {
    const { rows } = await pool.query(
        `SELECT * FROM "Days" WHERE trip_id = $1 ORDER BY date ASC`,
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
export const update = async (dayId, fields) => {
    if (!dayId || !fields || Object.keys(fields).length === 0) {
        return null;
    }

    const allowedFields = [
        'date',
        'summary',
        'lodging',
        'lodging_cost',
        'transport_cost'
    ];

    const setClauses = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(fields)) {
        if (allowedFields.includes(key)) {
            setClauses.push(`"${key}" = $${index}`);
            values.push(value);
            index++;
        }
    }

    if (setClauses.length === 0) {
        return null; // No valid fields provided
    }

    // Always update timestamp
    setClauses.push(`updated_at = now()`);

    const query = `
    UPDATE "Days"
    SET ${setClauses.join(', ')}
    WHERE id = $${index}
    RETURNING *;
  `;

    values.push(dayId);

    const { rows } = await pool.query(query, values);
    return rows[0];
};

// 🟢 Delete a day
export const remove = async (id) => {
  await pool.query(`DELETE FROM "Days" WHERE id = $1`, [id]);
  return { message: "Day deleted successfully" };
};