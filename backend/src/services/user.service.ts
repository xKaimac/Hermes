import pool from "../config/db.config";

export const findOrCreateUser = async (provider: string, profile: any) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const providerId = `${provider}_id`;
    const { rows } = await client.query(
      `SELECT * FROM users WHERE ${providerId} = $1`,
      [profile.id]
    );

    if (rows.length > 0) {
      await client.query("COMMIT");
      return rows[0];
    }

    const newUser = {
      username: profile.displayName || profile.username,
      email: profile.email || (profile.emails && profile.emails[0].value),
      [providerId]: profile.id,
      status_type: "offline",
    };

    const { rows: newRows } = await client.query(
      `INSERT INTO users (username, email, ${providerId}, status_type) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        newUser.username,
        newUser.email,
        newUser[providerId],
        newUser.status_type,
      ]
    );

    await client.query("COMMIT");
    return newRows[0];
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
