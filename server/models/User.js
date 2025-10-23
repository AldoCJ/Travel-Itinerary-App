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