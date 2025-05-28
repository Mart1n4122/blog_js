import Database from 'better-sqlite3';
const db = new Database('./data/blog.sqlite');


db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );
`).run();


db.prepare(`
  CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`).run();


const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
if (userCount === 0) {
  const insertUser = db.prepare('INSERT INTO users (name) VALUES (?)');
  const user1 = insertUser.run('Kiss Péter').lastInsertRowid;
  const user2 = insertUser.run('Nagy Anna').lastInsertRowid;
  const user3 = insertUser.run('Szabó Márk').lastInsertRowid;

  const insertBlog = db.prepare(`
    INSERT INTO blogs (user_id, title, category, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const now = new Date().toISOString();
  insertBlog.run(user1, 'JavaScript tippek', 'Programozás', 'Tartalom 1', now, now);
  insertBlog.run(user1, 'Express bevezető', 'Webfejlesztés', 'Tartalom 2', now, now);
  insertBlog.run(user2, 'Horgolás kezdőknek', 'Hobbi', 'Tartalom 3', now, now);
  insertBlog.run(user2, 'Kötés haladóknak', 'Hobbi', 'Tartalom 4', now, now);
  insertBlog.run(user3, 'Edzésterv', 'Fitness', 'Tartalom 5', now, now);
  insertBlog.run(user3, 'Táplálkozás', 'Egészség', 'Tartalom 6', now, now);
}


export const getAllBlogs = () => {
  return db.prepare(`
    SELECT blogs.*, users.name as author
    FROM blogs
    JOIN users ON blogs.user_id = users.id
    ORDER BY created_at DESC
  `).all();
};

export const getBlogById = (id) => {
  return db.prepare(`
    SELECT blogs.*, users.name as author
    FROM blogs
    JOIN users ON blogs.user_id = users.id
    WHERE blogs.id = ?
  `).get(id);
};

export const createBlog = (user_id, title, category, content) => {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO blogs (user_id, title, category, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(user_id, title, category, content, now, now);
};

export const updateBlog = (id, title, category, content) => {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    UPDATE blogs
    SET title = ?, category = ?, content = ?, updated_at = ?
    WHERE id = ?
  `);
  return stmt.run(title, category, content, now, id);
};

export const createUser = (name) => {
    const stmt = db.prepare('INSERT INTO users (name) VALUES (?)');
    return stmt.run(name);
  };

export const deleteBlog = (id) => {
  return db.prepare(`DELETE FROM blogs WHERE id = ?`).run(id);
};

export const getAllUsers = () => {
  return db.prepare('SELECT * FROM users').all();
};
