const API_URL = 'http://localhost:8080';

async function fetchBlogs() {
  const res = await fetch(`${API_URL}/api/blogs`);
  const blogs = await res.json();
  renderBlogs(blogs);
}

function renderBlogs(blogs) {
  const container = document.getElementById('blogs');
  const searchValue = document.getElementById('search').value.toLowerCase();
  container.innerHTML = '';
  blogs
    .filter(blog => blog.title.toLowerCase().includes(searchValue))
    .forEach(blog => {
      const div = document.createElement('div');
      div.className = 'blog';
      div.innerHTML = `
        <h3>${blog.title} <small>(${blog.category})</small></h3>
        <p><em>${blog.author}</em> - ${new Date(blog.created_at).toLocaleString()}</p>
        <p>${blog.content}</p>
        <button onclick="deleteBlog(${blog.id})">Törlés</button>
      `;
      container.appendChild(div);
    });
}

async function fetchUsers() {
  const res = await fetch(`${API_URL}/api/users`);
  const users = await res.json();
  const select = document.getElementById('user_id');
  select.innerHTML = '';
  users.forEach(u => {
    const option = document.createElement('option');
    option.value = u.id;
    option.textContent = u.name;
    select.appendChild(option);
  });
}

document.getElementById('blog-form').addEventListener('submit', async e => {
  e.preventDefault();
  const user_id = parseInt(document.getElementById('user_id').value, 10);
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const content = document.getElementById('content').value;
  const res = await fetch(`${API_URL}/api/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, title, category, content })
  });

  if (!res.ok) {
    const err = await res.json();
    alert(`Hiba: ${err.error || res.statusText}`);
    return;
  }

  e.target.reset();
  fetchBlogs();
});

document.getElementById('search').addEventListener('input', fetchBlogs);

document.getElementById('author-form').addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('author-name').value;
  
    const res = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
  
    if (!res.ok) {
      const err = await res.json();
      alert(`Hiba: ${err.error || res.statusText}`);
      return;
    }
  
    alert('Szerző sikeresen hozzáadva!');
    e.target.reset();
    fetchUsers();
  });

  function renderBlogs(blogs) {
    const container = document.getElementById('blogs');
    const searchValue = document.getElementById('search').value.toLowerCase();
    container.innerHTML = '';
    blogs
      .filter(blog => blog.title.toLowerCase().includes(searchValue))
      .forEach(blog => {
        const div = document.createElement('div');
        div.className = 'blog';
        div.innerHTML = `
          <h3>${blog.title} <small>(${blog.category})</small></h3>
          <p><em>${blog.author}</em> - Létrehozva: ${new Date(blog.created_at).toLocaleString()}</p>
          <p>${blog.content}</p>
          <button class="edit-button" onclick="editBlog(${blog.id})">Szerkesztés</button>
          <button onclick="deleteBlog(${blog.id})">Törlés</button>
        `;
        container.appendChild(div);
      });
  }

  async function editBlog(id) {
    const res = await fetch(`${API_URL}/api/blogs/${id}`);
    const blog = await res.json();
  
    document.getElementById('edit-blog-id').value = blog.id;
    document.getElementById('edit-user-id').value = blog.user_id;
    document.getElementById('edit-title').value = blog.title;
    document.getElementById('edit-category').value = blog.category;
    document.getElementById('edit-content').value = blog.content;

    document.getElementById('edit-blog-form').style.display = 'block';
  
    document.getElementById('blog-form').style.display = 'none';

    document.getElementById('author-form').style.display = 'none';
  }

document.getElementById('edit-blog-form').addEventListener('submit', async e => {
e.preventDefault();

/* const res = await fetch(`${API_URL}/api/blogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, title, category, content })
}); */

if (!res.ok) {
    const err = await res.json();
    alert(`Hiba: ${err.error || res.statusText}`);
    return;
}

alert('Bejegyzés sikeresen frissítve!');
document.getElementById('edit-blog-form').style.display = 'none';
document.getElementById('blog-form').style.display = 'block';
fetchBlogs();
});

document.getElementById('cancel-edit').addEventListener('click', () => {
document.getElementById('edit-blog-form').style.display = 'none';
document.getElementById('blog-form').style.display = 'block';
});

async function deleteBlog(id) {
  await fetch(`${API_URL}/api/blogs/${id}`, { method: 'DELETE' });
  fetchBlogs();
}

fetchUsers();
fetchBlogs();