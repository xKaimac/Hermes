import pool from "../../config/db.config";

const updateStatusText = async (
  userId: string,
  statusText: string
): Promise<boolean> => {
  const client = await pool.connect();
  let success: boolean = false;
  try {
    await client.query("BEGIN;");
    await client.query("UPDATE users SET status_text = $1 WHERE id = $2", [
      statusText,
      userId,
    ]);
    await client.query("COMMIT");
    success = true;
  } catch (e) {
    await client.query("ROLLBACK");
    success = false;
  } finally {
    client.release();
  }
  return success;
};

export default updateStatusText;
