import pool from "../../config/db.config";
import findFriend from "../friends/findFriend";

const addChatMember = async (
  chatId: any,
  friendName: any,
  userId: any
): Promise<Boolean> => {
  const client = await pool.connect();
  let result: boolean = false;
  const role: string = "regular";

  const friend = await findFriend(userId, friendName);
  const friendId: string | undefined = friend.friendData?.id;

  if (!friendId) {
    return result;
  }

  try {
    await client.query("BEGIN;");
    await client.query(
      "INSERT INTO chat_participants (user_id, chat_id, role) VALUES ($1, $2, $3)",
      [friendId, chatId, role]
    );
    await client.query("COMMIT");
    result = true;
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
    result = false;
  } finally {
    client.release();
  }

  return result;
};

export default addChatMember;
