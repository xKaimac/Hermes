import pool from "../config/db.config";

const updateUsername = async (body: any): Promise<boolean> => {
  const client = await pool.connect();
  const { username, email } = body;
  let success: boolean = false;
  try {
    await client.query("BEGIN;");
    const { rows } = await client.query(
      "SELECT username from users WHERE UPPER(username) LIKE UPPER($1)",
      [username]
    );
    if (rows.length === 0) {
      await client.query("UPDATE users SET username = $1 WHERE email = $2", [
        username,
        email,
      ]);
      success = true;
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    success = false;
  } finally {
    client.release();
  }
  return success;
};

export default updateUsername;
