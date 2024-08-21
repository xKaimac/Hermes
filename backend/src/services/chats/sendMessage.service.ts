import pool from "../../config/db.config";

interface Result {
  success: boolean;
  created_at: number;
}

const sendMessage = async (
  chatId: string,
  userId: string,
  content: string
): Promise<Result> => {
  const client = await pool.connect();
  let result: Result = {
    success: false,
    created_at: 0,
  };

  try {
    await client.query("BEGIN;");
    const { rows } = await client.query(
      "INSERT INTO messages(chat_id, sender_id, content) VALUES($1, $2, $3) RETURNING created_at",
      [chatId, userId, content]
    );
    await client.query("COMMIT");
    result.created_at = rows[0].created_at;
    result.success = true;
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    result.success = false;
  } finally {
    client.release();
  }

  return result;
};

export default sendMessage;
