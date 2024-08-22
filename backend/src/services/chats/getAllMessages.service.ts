import { Message } from '../../../../shared/types/Message';
import pool from '../../config/db.config';

const getAllMessages = async (chat_id: number): Promise<Array<Message>> => {
  const client = await pool.connect();
  const messages = new Array<Message>()

  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      'SELECT sender_id, content, created_at FROM messages WHERE chat_id = $1 ORDER BY created_at ASC',
      [chat_id]
    );

    await client.query('COMMIT');

    for (const row of rows) {
      const message: Message = {
        chat_id: chat_id,
        sender_id: row.sender_id,
        content: row.content,
        created_at: row.created_at,
      };

      messages.push(message);
    }
  } catch (error) {
    console.error(error);
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }

  return messages;
};

export default getAllMessages;
