import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  const fetchPostAndComments = async () => {
    try {
      const postRes = await fetch(`http://localhost:3000/api/posts/${id}`);
      if (postRes.ok) {
        const postData = await postRes.json();
        setPost(postData);
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
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('You must be logged in to comment');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment, post_id: id, user_id: userId })
      });
      if (response.ok) {
        setNewComment('');
        fetchPostAndComments(); // Refresh comments
      }
    } catch (err) {
      console.error('Error adding comment', err);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 0 5px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h1 style={{ marginTop: 0 }}>{post.title}</h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>Posted by: {post.username}</p>
        <p style={{ fontSize: '1.2rem', marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{post.content}</p>
      </div>

      <h3>Comments</h3>
      <div style={{ marginBottom: '2rem' }}>
        {comments.length === 0 ? <p>No comments yet. Be the first!</p> : (
          comments.map((comment) => (
            <div key={comment.id} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>{comment.username}</p>
              <p style={{ margin: 0 }}>{comment.content}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddComment}>
        <textarea 
          placeholder="Add a comment..." 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)} 
          required 
          rows="3"
        />
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
}

export default PostDetail;
