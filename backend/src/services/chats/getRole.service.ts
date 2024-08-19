import pool from "../../config/db.config";

interface Result {
  success: boolean;
  role: string;
}

const getRole = async (userId: any, chatId: any): Promise<Result> => {
  const client = await pool.connect();
  const result = { success: false, role: "regular" };

  try {
    await client.query("BEGIN;");
    const { rows } = await client.query(
      "SELECT role FROM chat_participants WHERE (user_id = $1 AND chat_id = $2)",
      [userId, chatId]
    );
    await client.query("COMMIT");
    result.success = true;
    result.role = rows[0].role;
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    result.success = false;
  } finally {
    client.release();
  }

  return result;
};

export default getRole;
