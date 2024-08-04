import pool from "../config/db.config";

interface FriendData {
  id: string;
  username: string;
  status: string;
  statusText: string;
  profilePicture: string;
}

interface FriendsResult {
  confirmedFriends: FriendData[];
  outgoingRequests: FriendData[];
  incomingRequests: FriendData[];
}

const getFriends = async (userId: string): Promise<FriendsResult> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN;");

    const { rows: friendships } = await client.query(
      `SELECT f.user_id, f.friend_id, f.status, 
              u1.username as user_username, u1.status_type as user_status_type, u1.status_text as user_status_text, u1.profile_picture as user_profile_picture,
              u2.username as friend_username, u2.status_type as friend_status_type, u2.status_text as friend_status_text, u2.profile_picture as friend_profile_picture
       FROM friends f
       JOIN users u1 ON f.user_id = u1.id
       JOIN users u2 ON f.friend_id = u2.id
       WHERE f.user_id = $1 OR f.friend_id = $1`,
      [userId]
    );

    const confirmedFriends: FriendData[] = [];
    const outgoingRequests: FriendData[] = [];
    const incomingRequests: FriendData[] = [];

    friendships.forEach((friendship) => {
      const isInitiator = friendship.user_id === userId;
      const friendData: FriendData = {
        id: isInitiator ? friendship.friend_id : friendship.user_id,
        username: isInitiator
          ? friendship.friend_username
          : friendship.user_username,
        status: isInitiator
          ? friendship.friend_status_type
          : friendship.user_status_type,
        statusText: isInitiator
          ? friendship.friend_status_text
          : friendship.user_status_text,
        profilePicture: isInitiator
          ? friendship.friend_profile_picture
          : friendship.user_profile_picture,
      };

      if (friendship.status === "accepted") {
        confirmedFriends.push(friendData);
      } else if (friendship.status === "pending") {
        if (isInitiator) {
          outgoingRequests.push(friendData);
        } else {
          incomingRequests.push(friendData);
        }
      }
    });

    await client.query("COMMIT");
    return { confirmedFriends, outgoingRequests, incomingRequests };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export default getFriends;
