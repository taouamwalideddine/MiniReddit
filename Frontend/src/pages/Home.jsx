import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home({ searchQuery }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  

  const [toastMessage, setToastMessage] = useState('');
  const [deleteModalPostId, setDeleteModalPostId] = useState(null);

  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Error fetching posts', err);
    } finally {
      setLoading(false);
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
        showToast("Post created successfully!");
        fetchPosts();
      }
    } catch (err) {
      console.error('Error creating post', err);
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${deleteModalPostId}`, {
        method: 'DELETE'
      });
      if(response.ok) {
        showToast("Post deleted");
        setDeleteModalPostId(null);
        fetchPosts();
      }
    } catch(err) {
      console.error('Error deleting post', err);
    }
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
        showToast("Post updated");
        fetchPosts();
      }
    } catch(err) {
      console.error('Error updating post', err);
    }
  };

  const handleVote = async (id, type) => {
    if (!currentUserId) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUserId, vote_type: type })
      });
      if (response.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error('Error voting', err);
    }
  };


  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  return (
    <div>

      {toastMessage && (
        <div className="toast-container">
          <div className="toast">{toastMessage}</div>
        </div>
      )}


      {deleteModalPostId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Post</h3>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteModalPostId(null)}>Cancel</button>
              <button className="btn-danger" onClick={handleDeletePost}>Delete</button>
            </div>
          </div>
        </div>
      )}

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

      <h2 style={{marginBottom: '1rem', marginTop: '2rem'}}>
        {searchQuery ? `Search Results for "${searchQuery}"` : "Recent Posts"}
      </h2>
      
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map(n => (
            <div key={n} className="card skeleton" style={{ height: '150px' }}></div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <p className="text-muted">No posts found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredPosts.map((post) => (
            <div key={post.id} className="card post-layout">

              <div className="vote-container">
                <button className="vote-btn upvote" onClick={() => handleVote(post.id, 1)}>▲</button>
                <span className="vote-score">{post.score}</span>
                <button className="vote-btn downvote" onClick={() => handleVote(post.id, -1)}>▼</button>
              </div>


              <div className="post-body">
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
                      <button type="submit">Save</button>
                      <button type="button" className="btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <Link to={`/post/${post.id}`}>
                      <h3 className="post-title">{post.title}</h3>
                    </Link>
                    <p className="post-meta">
                      Posted by <Link to={`/user/${post.username}`} style={{color: 'var(--primary)', fontWeight: '600'}}>u/{post.username}</Link>
                    </p>
                    
                    {currentUserId && parseInt(currentUserId) === post.user_id && (
                      <div className="action-bar">
                        <button className="btn-secondary" onClick={() => {
                          setEditingId(post.id);
                          setEditTitle(post.title);
                          setEditContent(post.content);
                        }}>Edit</button>
                        <button className="btn-danger" onClick={() => setDeleteModalPostId(post.id)}>Delete</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
