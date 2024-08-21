import pool from "../../config/db.config";
import { Chat } from "../../../types/Chat";

interface Result {
  success: boolean;
  chats: Array<Chat>;
}

const getMostRecentMessage = async (chatId: string): Promise<string> => {
  const client = await pool.connect();
  let result = "";

  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT content FROM messages WHERE chat_id = $1 ORDER BY created_at DESC LIMIT 1",
      [chatId]
    );
    await client.query("COMMIT");
    if (rows.length > 0) {
      result = rows[0].content;
    }
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }

  return result;
};

const getChats = async (userId: any): Promise<Result> => {
  const client = await pool.connect();
  const result = { success: false, chats: new Array<Chat>() };

  try {
    await client.query("BEGIN;");
    const { rows } = await client.query(
      "SELECT chats.id, chats.name, chats.chat_picture FROM chats JOIN (SELECT chat_participants.chat_id, chat_participants.user_id FROM chat_participants WHERE chat_participants.user_id = $1) AS user_chats ON chats.id = user_chats.chat_id",
      [userId]
    );
    await client.query("COMMIT");
    result.success = true;
    for (let row of rows) {
      const mostRecentMessage = await getMostRecentMessage(row.id);
      const chat: Chat = {
        chatId: row.id,
        name: row.name,
        chatPicture: row.chat_picture,
        mostRecentMessage: mostRecentMessage,
      };
      result.chats.push(chat);
    }
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    result.success = false;
  } finally {
    client.release();
  }

  return result;
};

export default getChats;
