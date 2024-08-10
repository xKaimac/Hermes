import pool from "../../config/db.config";

const updateProfilePicture = async (
  userId: string,
  image: string
): Promise<boolean> => {
  const client = await pool.connect();

  let success: boolean = false;
  try {
    await client.query("BEGIN;");
    await client.query("UPDATE users SET profile_picture = $1 WHERE id = $2", [
      image,
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

export default updateProfilePicture;
