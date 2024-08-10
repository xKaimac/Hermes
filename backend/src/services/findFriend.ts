import pool from "../config/db.config";
import { findUserByName } from "./user.service";
import { FriendData } from "../../types/FriendData";

interface Result {
  friendData: FriendData | undefined;
  success: boolean;
}

const findFriend = async (
  userId: string,
  friendName: string
): Promise<Result> => {
  const client = await pool.connect();
  const friendData: FriendData = await findUserByName(friendName);
  let result: Result = { friendData: friendData, success: false };

  if (!friendData.id) {
    return result;
  }

  try {
    await client.query("BEGIN;");

    const { rows } = await client.query(
      "SELECT * FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)",
      [userId, friendData.id]
    );

    await client.query("COMMIT");

    if (rows.length > 0) {
      result.success = true;
    }
  } catch (error) {
    await client.query("ROLLBACK");
    result.success = false;
  } finally {
    client.release();
  }

  return result;
};

export default findFriend;
