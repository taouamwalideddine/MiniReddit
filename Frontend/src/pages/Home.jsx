import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/posts');
      const data = await response.json();
      if (response.ok) {
        setPosts(data);
      }
    } catch (err) {
      console.error('Error fetching posts', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('You must be logged in to post');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, user_id: userId })
      });
      if (response.ok) {
        setTitle('');
        setContent('');
        fetchPosts(); // Refresh the feed
      }
    } catch (err) {
      console.error('Error creating post', err);
    }
  };

  return (
    <div>
      <h2>Create a Post</h2>
      <form onSubmit={handleCreatePost} style={{ marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Post Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Post Content" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
          rows="4"
        />
        <button type="submit">Submit Post</button>
      </form>

      <h2>Posts Feed</h2>
      {posts.length === 0 ? <p>No posts yet.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map((post) => (
            <div key={post.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px', backgroundColor: '#fafafa' }}>
              <Link to={`/post/${post.id}`}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#ff4500' }}>{post.title}</h3>
              </Link>
              <p style={{ margin: 0, color: '#666' }}>Posted by: {post.username}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
