import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  // Edit State
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');

  const fetchPostAndComments = async () => {
    try {
      const postRes = await fetch(`http://localhost:3000/api/posts/${id}`);
      if (postRes.ok) {
        const postData = await postRes.json();
        setPost(postData);
        setEditTitle(postData.title);
        setEditContent(postData.content);
      } else {
        navigate('/');
        return;
      }

      const commentsRes = await fetch(`http://localhost:3000/api/comments/${id}`);
      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      }
    } catch (err) {
      console.error('Error fetching post details', err);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      alert('You must be logged in to comment');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment, post_id: id, user_id: currentUserId })
      });
      if (response.ok) {
        setNewComment('');
        fetchPostAndComments();
      }
    } catch (err) {
      console.error('Error adding comment', err);
    }
  };

  const handleDeletePost = async () => {
    if(!confirm("Are you sure you want to delete this post?")) return;
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'DELETE'
      });
      if(response.ok) {
        navigate('/');
      }
    } catch(err) {
      console.error('Error deleting post', err);
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, content: editContent })
      });
      if(response.ok) {
        setEditing(false);
        fetchPostAndComments();
      }
    } catch(err) {
      console.error('Error updating post', err);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <div className="card">
        {editing ? (
          <form onSubmit={handleUpdatePost}>
            <input 
              type="text" 
              value={editTitle} 
              onChange={(e) => setEditTitle(e.target.value)} 
              required 
              style={{marginBottom: '1rem'}}
            />
            <textarea 
              value={editContent} 
              onChange={(e) => setEditContent(e.target.value)} 
              required 
              rows="5"
              style={{marginBottom: '1rem'}}
            />
            <div className="action-bar">
              <button type="submit">Save Changes</button>
              <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <h1 className="post-title" style={{ fontSize: '1.8rem' }}>{post.title}</h1>
            <p className="post-meta" style={{ marginBottom: '1.5rem' }}>Posted by u/{post.username}</p>
            <p className="post-content" style={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem' }}>{post.content}</p>
            
            {/* Creator Controls */}
            {currentUserId && parseInt(currentUserId) === post.user_id && (
              <div className="action-bar" style={{ marginTop: '2rem' }}>
                <button className="btn-secondary" onClick={() => setEditing(true)}>Edit Post</button>
                <button className="btn-danger" onClick={handleDeletePost}>Delete Post</button>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Comments ({comments.length})</h3>
        
        {currentUserId ? (
          <form onSubmit={handleAddComment} className="card" style={{ marginBottom: '2rem' }}>
            <textarea 
              placeholder="What are your thoughts?" 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)} 
              required 
              rows="3"
            />
            <button type="submit" style={{ marginTop: '1rem' }}>Post Comment</button>
          </form>
        ) : (
          <div className="card" style={{ backgroundColor: '#f8fafc', textAlign: 'center' }}>
            <p style={{ margin: 0 }}>Log in to leave a comment.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {comments.length === 0 ? <p className="text-muted">No comments yet.</p> : (
            comments.map((comment) => (
              <div key={comment.id} className="card" style={{ padding: '1rem', marginBottom: 0 }}>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', fontSize: '0.9rem', color: 'var(--primary)' }}>u/{comment.username}</p>
                <p style={{ margin: 0, color: 'var(--text-main)' }}>{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
