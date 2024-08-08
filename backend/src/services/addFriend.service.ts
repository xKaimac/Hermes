import pool from "../config/db.config";
import handleFriendRequest from "./handleFriendRequest.service";

const getFriendId = async (friendName: string) => {
  const client = await pool.connect();
  let friendId: string;

  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT id FROM users WHERE UPPER(username) = $1",
      [friendName.toUpperCase()]
    );
    if (rows.length > 0) {
      friendId = rows[0].id;
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
  return friendId!;
};

const getRequestStatus = async (userId: string, friendId: string) => {
  const client = await pool.connect();
  let requestStatus: string;
  const accepted: string = "accepted";

  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT status FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)",
      [userId, friendId]
    );
    if (rows.length > 0) {
      requestStatus = rows[0].status;
      if (requestStatus === "pending") {
        await handleFriendRequest(accepted, userId, friendId);
        requestStatus = accepted;
      }
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
  return requestStatus!;
};

const sendFriendRequest = async (
  userId: string,
  friendName: string
): Promise<any> => {
  const client = await pool.connect();
  let success: { success: boolean; friendId: string } = {
    success: false,
    friendId: "",
  };
  let requestStatus: string;
  let friendId: string;

  friendId = await getFriendId(friendName);

  if (!friendId) {
    return success;
  }

  requestStatus = await getRequestStatus(userId, friendId);

  if (!requestStatus) {
    requestStatus = "pending";
  } else if (requestStatus === "accepted") {
    success.success = true;
    return success;
  }

  try {
    await client.query("BEGIN;");
    await client.query(
      "INSERT INTO friends (user_id, friend_id, status) VALUES ($1, $2, $3)",
      [userId, friendId, requestStatus]
    );
    await client.query("COMMIT");
    success.success = true;
  } catch (error) {
    await client.query("ROLLBACK");
    success.success = false;
  } finally {
    client.release();
  }
  return success;
};

export default sendFriendRequest;
