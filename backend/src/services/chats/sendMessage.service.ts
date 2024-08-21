import pool from "../../config/db.config";

const sendMessage = async (
  chatId: string,
  userId: string,
  content: string
): Promise<Boolean> => {
  const client = await pool.connect();
  let result: boolean = false;

  try {
    await client.query("BEGIN;");
    await client.query(
      "INSERT INTO messages(chat_id, sender_id, content) VALUES($1, $2, $3)",
      [chatId, userId, content]
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

export default sendMessage;
