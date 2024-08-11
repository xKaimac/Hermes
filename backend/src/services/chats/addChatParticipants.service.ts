import pool from "../../config/db.config";
import { ChatParticipants } from "../../../types/ChatParticipants";

const addChatParticipants = async (
  chatId: number,
  participants: Array<ChatParticipants>
): Promise<boolean> => {
  const client = await pool.connect();
  let success: boolean = false;

  for (let participant of participants) {
    try {
      const { userId, role } = participant;
      await client.query("BEGIN");
      await client.query(
        "INSERT INTO chat_participants(chat_id, user_id, role) VALUES($1, $2, $3)",
        [chatId, userId, role]
      );
      await client.query("COMMIT");
    } catch (error) {
      console.log(error);
      success = false;
    }
  }
  client.release();

  return success;
};

export default addChatParticipants;
