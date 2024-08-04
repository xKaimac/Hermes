import pool from "../config/db.config";

const acceptFriendRequest = async (
  userId: string,
  friendId: string
): Promise<boolean> => {
  const client = await pool.connect();
  let success: boolean = false;
  const accepted = "accepted";

  try {
    await client.query("BEGIN;");
    await client.query(
      "UPDATE friends SET status = $3 WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)",
      [userId, friendId, accepted]
    );
    await client.query("COMMIT");
    success = true;
  } catch (error) {
    await client.query("ROLLBACK");
    success = false;
  } finally {
    client.release();
  }
  return success;
};

export default acceptFriendRequest;
