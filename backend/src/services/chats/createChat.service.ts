import pool from "../../config/db.config";
import { ChatParticipants } from "../../../types/ChatParticipants";
import addChatParticipants from "./addChatParticipants.service";

const createChat = async (
  chatName: string,
  participants: Array<ChatParticipants>
): Promise<boolean> => {
  const client = await pool.connect();
  let success: boolean = false;

  try {
    await client.query("BEGIN;");
    const { rows } = await client.query(
      "INSERT INTO chats(name) VALUES($1) RETURNING id",
      [chatName]
    );
    await client.query("COMMIT");
    success = await addChatParticipants(rows[0].id, participants);
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    success = false;
  } finally {
    client.release();
  }

  return success;
};

export default createChat;
