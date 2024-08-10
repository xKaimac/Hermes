import pool from "../../config/db.config";

const updateUsername = async (
  username: string,
  userId: string
): Promise<boolean> => {
  const client = await pool.connect();
  let success: boolean = false;
  try {
    await client.query("BEGIN;");
    const { rows } = await client.query(
      "SELECT username from users WHERE UPPER(username) LIKE UPPER($1)",
      [username]
    );
    if (rows.length === 0) {
      await client.query("UPDATE users SET username = $1 WHERE id = $2", [
        username,
        userId,
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
