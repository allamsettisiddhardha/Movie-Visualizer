require('dotenv').config()
const mysql = require('mysql2/promise')

async function initDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  console.log('Connected to MySQL. Initializing Letterboxd Clone schema...')

  try {
    // 1. Users Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        display_name VARCHAR(255)
      )
    `)
    await connection.execute(`INSERT IGNORE INTO users (id, username, display_name) VALUES ('default_user', 'user', 'Demo User')`)

    // 2. Custom Movies Table (for movies not on TMDB)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS custom_movies (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        overview TEXT,
        release_date VARCHAR(50),
        genres JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // 3. Diary Entries (Logs, Ratings, Reviews)
    // A single entry can combine watching (date), rating (0.5 to 5.0), review (text)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS diary_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        movie_id VARCHAR(255) NOT NULL,
        watch_date DATE NOT NULL,
        rating DECIMAL(3,1),
        review TEXT,
        is_favorite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // 4. Lists Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS lists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // 5. List Items
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS list_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        list_id INT NOT NULL,
        movie_id VARCHAR(255) NOT NULL,
        order_index INT DEFAULT 0,
        FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
      )
    `)

    console.log('Database initialization completed successfully.')
  } catch (err) {
    console.error('Error initializing database:', err)
  } finally {
    await connection.end()
  }
}

initDB()
