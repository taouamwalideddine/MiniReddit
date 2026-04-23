import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');

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
    if (!currentUserId) {
      alert('You must be logged in to post');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, user_id: currentUserId })
      });
      if (response.ok) {
        setTitle('');
        setContent('');
        fetchPosts();
      }
    } catch (err) {
      console.error('Error creating post', err);
    }
  };

  const handleDeletePost = async (id) => {
    if(!confirm("Are you sure you want to delete this post?")) return;
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'DELETE'
      });
      if(response.ok) {
        fetchPosts();
      }
    } catch(err) {
      console.error('Error deleting post', err);
    }
  };

  const startEditing = (post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleUpdatePost = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, content: editContent })
      });
      if(response.ok) {
        setEditingId(null);
        fetchPosts();
      }
    } catch(err) {
      console.error('Error updating post', err);
    }
  };

  return (
    <div>
      {currentUserId && (
        <div className="card">
          <h3 style={{marginBottom: '1rem'}}>Create a Post</h3>
          <form onSubmit={handleCreatePost}>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Post Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <textarea 
                placeholder="What's on your mind?" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                required 
                rows="3"
              />
            </div>
            <button type="submit">Submit Post</button>
          </form>
        </div>
      )}

      <h2 style={{marginBottom: '1rem', marginTop: '2rem'}}>Recent Posts</h2>
      {posts.length === 0 ? <p className="text-muted">No posts yet.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {posts.map((post) => (
            <div key={post.id} className="card">
              {editingId === post.id ? (
                <form onSubmit={(e) => handleUpdatePost(e, post.id)}>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)} 
                    required 
                    style={{marginBottom: '0.5rem'}}
                  />
                  <textarea 
                    value={editContent} 
                    onChange={(e) => setEditContent(e.target.value)} 
                    required 
                    rows="3"
                    style={{marginBottom: '0.5rem'}}
                  />
                  <div className="action-bar">
                    <button type="submit">Save Changes</button>
                    <button type="button" className="btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <Link to={`/post/${post.id}`}>
                    <h3 className="post-title">{post.title}</h3>
                  </Link>
                  <p className="post-meta">Posted by u/{post.username}</p>
                  
                  {/* Creator Controls */}
                  {currentUserId && parseInt(currentUserId) === post.user_id && (
                    <div className="action-bar">
                      <button className="btn-secondary" onClick={() => startEditing(post)}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDeletePost(post.id)}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
