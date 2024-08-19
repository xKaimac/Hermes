import pool from "../../config/db.config";
import findFriend from "../friends/findFriend";

const addChatMember = async (
  chatId: any,
  friendName: any,
  userId: any
): Promise<Boolean> => {
  const client = await pool.connect();
  let result: boolean = false;

  const friend = await findFriend(userId, friendName);
  const friendId: string | undefined = friend.friendData?.id;

  if (!friendId) {
    return result;
  }

  try {
    await client.query("BEGIN;");
    await client.query(
      "INSERT INTO chat_participants (user_id, chat_id) VALUES ($1, $2)",
      [Number(friendId), chatId]
    );
    await client.query("COMMIT");
    result = true;
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    result = false;
  } finally {
    client.release();
  }

  return result;
};

export default addChatMember;
