import pool from "../config/db.config";

const updateProfilePicture = async (
  body: any,
  result: any
): Promise<boolean> => {
  const client = await pool.connect();
  const { email } = body;
  const image = result;
  let success: boolean = false;
  try {
    await client.query("BEGIN;");
    await client.query(
      "UPDATE users SET profile_picture = $1 WHERE email = $2",
      [image, email]
    );
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

export default updateProfilePicture;
