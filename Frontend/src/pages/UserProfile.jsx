import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function UserProfile() {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/user/${username}`);
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (err) {
        console.error('Error fetching user posts', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [username]);

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Posts by u/{username}</h2>
      
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map(n => (
            <div key={n} className="card skeleton" style={{ height: '120px' }}></div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-muted">This user hasn't posted anything yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {posts.map((post) => (
            <div key={post.id} className="card post-layout">
              <div className="vote-container">
                <span className="vote-score">{post.score}</span>
                <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Votes</span>
              </div>
              <div className="post-body">
                <Link to={`/post/${post.id}`}>
                  <h3 className="post-title">{post.title}</h3>
                </Link>
                <p className="post-meta">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
