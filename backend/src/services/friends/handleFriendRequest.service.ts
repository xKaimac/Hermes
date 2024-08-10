import pool from "../../config/db.config";

const handleFriendRequest = async (
  action: string,
  userId: string,
  friendId: string
): Promise<boolean> => {
  const client = await pool.connect();
  let success: boolean = false;
  console.log(action);

  try {
    await client.query("BEGIN;");
    await client.query(
      "UPDATE friends SET status = $1 WHERE (user_id = $2 AND friend_id = $3) OR (user_id = $3 AND friend_id = $2)",
      [action, userId, friendId]
    );
    await client.query("COMMIT");
    success = true;
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    success = false;
  } finally {
    client.release();
  }
  console.log(success);
  return success;
};

export default handleFriendRequest;
