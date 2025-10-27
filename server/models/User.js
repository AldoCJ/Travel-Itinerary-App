import pool from "../database.js";

// Get a user
export const getById = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM "Users" WHERE id = $1`,
    [id]
  );
  return rows[0];
};


// Delete a user
export const remove = async (id) => {
  await pool.query(`DELETE FROM "Users" WHERE id = $1`, [id]);
  return { message: "User deleted successfully" };
}

// Get All Users

export const getAll = async () => {
    const { rows } = await pool.query(`SELECT * FROM "Users"`);
    return rows;
};

// Update User Profile (Public Data Only)
export const update = async (id, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) return null;

    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const { rows } = await pool.query(
        `UPDATE "Users" SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
        [...values, id]
    );

    return rows[0];
};