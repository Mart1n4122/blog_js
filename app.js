import express from 'express';
import * as db from './util/database.js';
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.get('/api/blogs', (req, res) => {
  res.json(db.getAllBlogs());
});

app.get('/api/blogs/:id', (req, res) => {
  const blog = db.getBlogById(req.params.id);
  if (!blog) return res.status(404).json({ error: 'Bejegyzés nem található' });
  res.json(blog);
});

app.post('/api/blogs', (req, res) => {
  const { user_id, title, category, content } = req.body;
  if (!user_id || !title || !category || !content) {
    return res.status(400).json({ error: 'Hiányzó mezők' });
  }
  const result = db.createBlog(user_id, title, category, content);
  res.status(201).json({ id: result.lastInsertRowid });
});

app.post('/api/users', (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'A név megadása kötelező' });
    }
    const result = db.createUser(name);
    res.status(201).json({ id: result.lastInsertRowid });
  });

app.put('/api/blogs/:id', (req, res) => {
  const { title, category, content } = req.body;
  if (!title || !category || !content) {
    return res.status(400).json({ error: 'Hiányzó mezők' });
  }
  const result = db.updateBlog(req.params.id, title, category, content);
  if (result.changes === 0) return res.status(404).json({ error: 'Nem található' });
  res.json({ success: true });
});

app.delete('/api/blogs/:id', (req, res) => {
  const result = db.deleteBlog(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Nem található' });
  res.status(204).send();
});

app.get('/api/users', (req, res) => {
  res.json(db.getAllUsers());
});

app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}`);
});
