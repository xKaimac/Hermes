import pool from "../config/db.config";

export const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE,
      email VARCHAR(255) UNIQUE,
      status_text TEXT,
      status_type VARCHAR(50) CHECK (status_type IN ('offline', 'online', 'busy')),
      google_id VARCHAR(255) UNIQUE,
      discord_id VARCHAR(255) UNIQUE,
      github_id VARCHAR(255) UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error creating users table", error);
  }
};
