import pool from "../../config/db.config";

interface Message {
  sender_id: string;
  content: string;
  created_at: number;
}

interface Result {
  success: boolean;
  messages: Array<Message>;
}

const getAllMessages = async (chatId: string): Promise<Result> => {
  const client = await pool.connect();
  let result = { success: false, messages: new Array<Message>() };

  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT sender_id, content, created_at FROM messages WHERE chat_id = $1 ORDER BY created_at ASC",
      [chatId]
    );
    await client.query("COMMIT");
    for (let row of rows) {
      const message: Message = {
        sender_id: row.sender_id,
        content: row.content,
        created_at: row.created_at,
      };
      result.messages.push(message);
    }
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }

  return result;
};

export default getAllMessages;
