import pool from "../config/db.config";

const updateStatusText = async (body: any, result: any): Promise<boolean> => {
  const client = await pool.connect();
  const { email } = body;
  const statusText = result;
  let success: boolean = false;
  try {
    await client.query("BEGIN;");
    await client.query("UPDATE users SET status_text = $1 WHERE email = $2", [
      statusText,
      email,
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
