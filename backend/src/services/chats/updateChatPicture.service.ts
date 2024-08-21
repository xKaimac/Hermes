import pool from "../../config/db.config";

const updateChatPicture = async (
  chatId: string,
  image: string
): Promise<boolean> => {
  const client = await pool.connect();

  let success: boolean = false;
  try {
    await client.query("BEGIN;");
    await client.query("UPDATE chats SET chat_picture = $1 WHERE id = $2", [
      image,
      chatId,
    ]);
    await client.query("COMMIT");
    success = true;
  } catch (e) {
    await client.query("ROLLBACK");
    success = false;
  } finally {
    client.release();
  }
  return success;
};

export default updateChatPicture;
