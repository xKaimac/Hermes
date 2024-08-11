import pool from "../../config/db.config";
import { ChatParticipants } from "../../../types/ChatParticipants";
import addChatParticipants from "./addChatParticipants.service";
import { Chat } from "../../../types/Chat";

interface Result extends Chat {
  success: boolean;
  participants: Array<ChatParticipants>;
}

const createChat = async (
  chatName: string,
  participants: Array<ChatParticipants>
): Promise<Result> => {
  const client = await pool.connect();
  let result: Result = {
    success: false,
    participants: new Array<ChatParticipants>(),
  };

  try {
    await client.query("BEGIN;");
    const { rows } = await client.query(
      "INSERT INTO chats(name) VALUES($1) RETURNING *",
      [chatName]
    );
    const chat = rows[0];
    await client.query("COMMIT");
    result.success = await addChatParticipants(chat.id, participants);
    result.participants = participants;
    result.chatId = chat.id;
    result.name = chat.name;
    result.chatPicture = chat.chat_picture;
    result.mostRecentMessage = "";
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    result.success = false;
  } finally {
    client.release();
  }

  return result;
};

export default createChat;
