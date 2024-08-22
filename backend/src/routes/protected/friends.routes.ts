import sendFriendRequest from '../../services/friends/addFriend.service';
import getFriends from '../../services/friends/getFriends';
import { Server } from 'socket.io';
import handleFriendRequest from '../../services/friends/handleFriendRequest.service';
import findFriend from '../../services/friends/findFriend';
import express from 'express';
import { isAuthenticated } from '../../middleware/auth.middleware';
import { emitFriendRequest } from '../../services/socket/socket.service';

const router = express.Router();

router.post('/add-friend', isAuthenticated, async (req, res) => {
  try {
    const { userId, friendName } = req.body;
    const result = await sendFriendRequest(userId, friendName);

    if (result.success) {
      emitFriendRequest(result.friendId, userId);

      return res.status(200).json({
        message: 'Friend request sent successfully',
        result: result.success,
      });
    } else {
      return res
        .status(400)
        .json({ message: 'Failed to send friend request', result: false });
    }
  } catch (error) {
    console.error('Error sending friend request:', error);
    res
      .status(500)
      .json({ message: 'Error sending friend request', error: error });
  }
});

router.post('/get-friends', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await getFriends(userId);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error getting friends:', error);
    res.status(500).json({ message: 'Error getting friends' });
  }
});

router.post('/find-friend', isAuthenticated, async (req, res) => {
  try {
    const { userId, friendName } = req.body;
    const friend = await findFriend(userId, friendName);

    if (!friend) throw new Error();

    return res.status(200).json({ result: friend });
  } catch (error) {
    console.error('Error finding friend: ', error);

    return res.status(500).json({ message: 'Error finding friend' });
  }
});

router.post('/handle-friend-request', isAuthenticated, async (req, res) => {
  try {
    console.log(req.body);
    const { action, userId, friendId } = req.body;
    const result = await handleFriendRequest(action, userId, friendId);

    return res.status(200).json({
      message: `Friend request handled successfully`,
      result: result,
    });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ message: `Failed to handle friend request`, error: error });
  }
});

export default router;
