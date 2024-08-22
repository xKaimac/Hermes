import pool from '../../config/db.config';
import { FriendData } from '../../../types/FriendData';

interface ChatMember extends FriendData {
  role: string;
  memberSince: number;
}

interface Result {
  success: boolean;
  members: Array<ChatMember>;
}

const getChatMembers = async (chat_id: number): Promise<Result> => {
  const client = await pool.connect();
  const result = { success: false, members: new Array<ChatMember>() };

  try {
    await client.query('BEGIN;');
    const { rows } = await client.query(
      'SELECT users.id, users.username, users.profile_picture, chat_participants.role, chat_participants.joined_at FROM chat_participants LEFT JOIN users ON users.id = chat_participants.user_id WHERE chat_participants.chat_id = $1',
      [chat_id]
    );

    await client.query('COMMIT');
    result.success = true;
    for (const row of rows) {
      const member: ChatMember = {
        id: row.id,
        username: row.username,
        profilePicture: row.profile_picture,
        role: row.role,
        memberSince: row.joined_at,
      };

      result.members.push(member);
    }
  } catch (error) {
    console.log(error);
    await client.query('ROLLBACK');
    result.success = false;
  } finally {
    client.release();
  }

  return result;
};

export default getChatMembers;
