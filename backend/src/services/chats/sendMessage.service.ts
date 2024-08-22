import { Message } from '../../../../shared/types/Message';
import pool from '../../config/db.config';

const sendMessage = async (
  chat_id: number,
  user_id: number,
  content: string
): Promise<Message | undefined> => {
  const client = await pool.connect();
  let message: Message | undefined;

  try {
    await client.query('BEGIN;');
    const { rows } = await client.query(
      'INSERT INTO messages(chat_id, sender_id, content) VALUES($1, $2, $3) returning *',
      [chat_id, user_id, content]
    );

    await client.query('COMMIT');
    const result = rows[0];

    message = {
      id: result.id,
      chat_id: result.chat_id,
      content: result.content,
      created_at: result.created_at,
      sender_id: result.sender_id,
    };
  } catch (error) {
    console.log(error);
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }

  return message;
};

export default sendMessage;
