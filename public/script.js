const API_URL = 'http://localhost:8080';

async function fetchBlogs() {
    try {
      const res = await fetch(`${API_URL}/api/blogs`);
      if (!res.ok) {
        throw new Error(`Hálózati hiba: ${res.status} - ${res.statusText}`);
      }
      const blogs = await res.json();
      console.log('Kapott blogok:', blogs);
      renderBlogs(blogs);
    } catch (err) {
      console.error('fetchBlogs hiba:', err);
    }
  }
  function fetchUsers(selectedUserId = null) {
    return fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(users => {
        const newPostSelect = document.getElementById('user_id');
        const editSelect = document.getElementById('edit-user-id');
  
        newPostSelect.innerHTML = '';
        editSelect.innerHTML = '';
  
        users.forEach(u => {
          const option1 = document.createElement('option');
          option1.value = u.id;
          option1.textContent = u.name;
          newPostSelect.appendChild(option1);
  
          const option2 = document.createElement('option');
          option2.value = u.id;
          option2.textContent = u.name;
  
          if (selectedUserId != null && parseInt(u.id) === parseInt(selectedUserId)) {
            option2.selected = true;
          }
  
          editSelect.appendChild(option2);
        });
      });
  }
  
function resetFormsView() {
    document.getElementById('blog-form').style.display = 'block';
    document.getElementById('author-form').style.display = 'block';
    document.getElementById('edit-blog-form').style.display = 'none';
    document.getElementById('edit-section').style.display = 'none';
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
        const authorName = blog.author || blog.user?.name || 'Ismeretlen szerző';
  
        let createdDate = 'Ismeretlen időpont';
        if (blog.created_at) {
          const d = new Date(blog.created_at);
          createdDate = d.toISOString().split('T')[0]; 
        }
  
        let updatedDate = 'Nincs módosítás';
        if (blog.updated_at) {
          const d2 = new Date(blog.updated_at);
          updatedDate = d2.toISOString().split('T')[0];
        }
  
        const div = document.createElement('div');
        div.className = 'blog';
        div.innerHTML = `
          <h3>${blog.title} <small>(${blog.category})</small></h3>
          <p><em>${authorName}</em> - Létrehozva: ${createdDate}</p>
          <p><strong>Utolsó módosítás:</strong> ${updatedDate}</p>
          <p>${blog.content}</p>
          <button class="edit-button">Szerkesztés</button>
          <button class="delete-button">Törlés</button>
        `;
        
        const editBtn = div.querySelector('.edit-button');
        editBtn.addEventListener('click', () => editBlog(blog.id));
        
        const deleteBtn = div.querySelector('.delete-button');
        deleteBtn.addEventListener('click', () => deleteBlog(blog.id));
        
        container.appendChild(div);
      });
  }
  

  async function editBlog(id) {
    try {
      const res = await fetch(`${API_URL}/api/blogs/${id}`);
      if (!res.ok) {
        throw new Error('Nem sikerült betölteni a blog adatait.');
      }
  
      const blog = await res.json();
  
      await fetchUsers(blog.user_id || blog.user?.id || null);
  
      document.getElementById('edit-blog-id').value = blog.id;
      document.getElementById('edit-user-id').value = blog.user_id || blog.user?.id || '';
      document.getElementById('edit-title').value = blog.title;
      document.getElementById('edit-category').value = blog.category;
      document.getElementById('edit-content').value = blog.content;
  
      document.getElementById('edit-blog-form').style.display = 'block';
      document.getElementById('edit-section').style.display = 'block';
  
      document.getElementById('blog-form').style.display = 'none';
      document.getElementById('author-form').style.display = 'none';
    } catch (error) {
      alert(`Hiba: ${error.message}`);
    }
  }
  
  document.getElementById('edit-blog-form').addEventListener('submit', async e => {
    e.preventDefault();
  
    const id = parseInt(document.getElementById('edit-blog-id').value, 10);
    const user_id = parseInt(document.getElementById('edit-user-id').value, 10);
    const title = document.getElementById('edit-title').value;
    const category = document.getElementById('edit-category').value;
    const content = document.getElementById('edit-content').value;
  
    const res = await fetch(`${API_URL}/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, title, category, content })
    });
  
    if (!res.ok) {
      const err = await res.json();
      alert(`Hiba: ${err.error || res.statusText}`);
      return;
    }
  
    alert('Bejegyzés sikeresen frissítve!');

const editForm = document.getElementById('edit-blog-form');
editForm.style.display = 'none';
editForm.reset();

document.getElementById('edit-section').style.display = 'none';

document.getElementById('blog-form').style.display = 'block';
document.getElementById('author-form').style.display = 'block';

fetchBlogs();
});

document.getElementById('cancel-edit').addEventListener('click', () => {
    const editForm = document.getElementById('edit-blog-form');
    editForm.style.display = 'none';
    editForm.reset();
  
    document.getElementById('blog-form').style.display = 'block';
    document.getElementById('author-form').style.display = 'block';
    document.getElementById('edit-section').style.display = 'none';
  });

async function deleteBlog(id) {
  await fetch(`${API_URL}/api/blogs/${id}`, { method: 'DELETE' });
  fetchBlogs();
}

fetchUsers();
fetchBlogs();