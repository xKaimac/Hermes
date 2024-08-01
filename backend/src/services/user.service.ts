import pool from "../config/db.config";

const findOrCreateUser = async (provider: string, profile: any) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const providerId = `${provider}_id`;
    const { rows } = await client.query(
      `SELECT * FROM users WHERE ${providerId} = $1 OR email = $2`,
      [profile.id, profile.email]
    );
    let user;
    let isFirstLogin = false;

    if (rows.length > 0) {
      if (rows.length === 1) {
        // User exists, update the provider ID if it's not set
        user = rows[0];
        if (!user[providerId]) {
          await client.query(
            `UPDATE users SET ${providerId} = $1, first_login = false WHERE id = $2`,
            [profile.id, user.id]
          );
        } else {
          // User exists and provider ID is set, just update first_login
          await client.query(
            `UPDATE users SET first_login = false WHERE id = $1`,
            [user.id]
          );
        }
      } else {
        // Multiple users found, merge them
        const userWithProviderId = rows.find(
          (row) => row[providerId] === profile.id
        );
        const userWithEmail = rows.find((row) => row.email === profile.email);

        if (
          userWithProviderId &&
          userWithEmail &&
          userWithProviderId.id !== userWithEmail.id
        ) {
          // Merge the two users
          await client.query(
            `UPDATE users 
             SET ${providerId} = $1, 
                 email = COALESCE(NULLIF($2, ''), email),
                 username = COALESCE(NULLIF($3, ''), username)
             WHERE id = $4`,
            [
              profile.id,
              profile.email,
              profile.displayName || profile.username,
              userWithEmail.id,
            ]
          );

          // Delete the duplicate user
          await client.query("DELETE FROM users WHERE id = $1", [
            userWithProviderId.id,
          ]);

          user = userWithEmail;
        } else {
          // If we can't merge, just use the first user
          user = rows[0];
        }
      }
    } else {
      // No user found, create a new one
      const newUser = {
        username: profile.displayName || profile.username,
        email: profile.email || (profile.emails && profile.emails[0].value),
        [providerId]: profile.id,
        status_type: "online",
        first_login: true,
      };
      const { rows: newRows } = await client.query(
        `INSERT INTO users (username, email, ${providerId}, status_type, first_login) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          newUser.username,
          newUser.email,
          newUser[providerId],
          newUser.status_type,
          newUser.first_login,
        ]
      );
      user = newRows[0];
      isFirstLogin = true;
    }
    await client.query("COMMIT");
    return { user, isFirstLogin };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};
export const findUserById = async (id: string) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
};

export default findOrCreateUser;
