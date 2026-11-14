import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { mockPosts } from '../../services/mockData.js';
import {
  Heart,
  MessageCircle,
  Send,
  MessageSquareQuote,
  Share2,
  Trash2,
} from 'lucide-react';

export const FeedView = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState(mockPosts);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({ 'post-1': true });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.getPosts();
        if (data?.posts && data.posts.length > 0) {
          setPosts(data.posts);
        }
      } catch (err) {
        // Keeps mock posts if backend server is not active
      }
    };
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const data = await api.createPost({ title, content });
      const newPost = data?.post || {
        id: `post-${Date.now()}`,
        authorId: user?.id,
        title: title || null,
        content,
        createdAt: new Date().toISOString(),
        author: { id: user?.id, name: user?.name, role: user?.role },
        _count: { comments: 0, likes: 0 },
        liked: false,
        comments: [],
      };
      setPosts([newPost, ...posts]);
      setTitle('');
      setContent('');
    } catch (err) {
      // Local fallback
      const newPost = {
        id: `post-${Date.now()}`,
        authorId: user?.id,
        title: title || null,
        content,
        createdAt: new Date().toISOString(),
        author: { id: user?.id, name: user?.name, role: user?.role },
        _count: { comments: 0, likes: 0 },
        liked: false,
        comments: [],
      };
      setPosts([newPost, ...posts]);
      setTitle('');
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      await api.toggleLike(postId);
    } catch (err) {
      // silent
    }
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          const liked = !p.liked;
          const likesCount = (p._count?.likes || 0) + (liked ? 1 : -1);
          return {
            ...p,
            liked,
            _count: { ...p._count, likes: Math.max(0, likesCount) },
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      await api.addComment(postId, text);
    } catch (err) {
      // silent
    }

    const newComment = {
      id: `c-${Date.now()}`,
      author: { name: user?.name || 'Anonymous', role: user?.role || 'STUDENT' },
      content: text,
      createdAt: new Date().toISOString(),
    };

    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), newComment],
            _count: { ...p._count, comments: (p._count?.comments || 0) + 1 },
          };
        }
        return p;
      })
    );

    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const toggleExpand = (postId) => {
    setExpandedComments({
      ...expandedComments,
      [postId]: !expandedComments[postId],
    });
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      {/* Create Post Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <MessageSquareQuote size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>Share an update or question</h3>
        </div>
        <form onSubmit={handleCreatePost}>
          <input
            type="text"
            className="input-field"
            placeholder="Title / Topic (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <textarea
            className="textarea-field"
            rows="3"
            placeholder="Share technical knowledge, career advice, or ask questions to alumni..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ resize: 'vertical', marginBottom: '12px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
              <Send size={14} /> {isSubmitting ? 'Posting...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>

      {/* Feed Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {posts.map((post) => (
          <div key={post.id} className="card">
            {/* Author header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6D4333, #8D5B46)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#FFFFFF',
                  }}
                >
                  {post.author?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
                      {post.author?.name}
                    </span>
                    <span className={`badge badge-${post.author?.role?.toLowerCase() || 'student'}`}>
                      {post.author?.role}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Post Title & Content */}
            {post.title && (
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                {post.title}
              </h4>
            )}
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              {post.content}
            </p>

            {/* Post Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <button
                className="btn btn-sm"
                style={{
                  background: post.liked ? 'var(--danger-bg)' : 'transparent',
                  color: post.liked ? 'var(--danger)' : 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}
                onClick={() => handleToggleLike(post.id)}
              >
                <Heart size={15} fill={post.liked ? 'var(--danger)' : 'none'} />
                <span>{post._count?.likes || 0}</span>
              </button>

              <button
                className="btn btn-sm"
                style={{
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}
                onClick={() => toggleExpand(post.id)}
              >
                <MessageCircle size={15} />
                <span>{post._count?.comments || post.comments?.length || 0} Comments</span>
              </button>
            </div>

            {/* Comments Section */}
            {expandedComments[post.id] && (
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed var(--border-subtle)' }}>
                {/* Existing comments */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                  {post.comments?.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        padding: '10px 14px',
                        background: 'var(--bg-input)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-main)' }}>
                          {c.author?.name}
                        </span>
                        <span className={`badge badge-${c.author?.role?.toLowerCase() || 'student'}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                          {c.author?.role}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{c.content}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment Input */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    style={{ fontSize: '13px', padding: '8px 12px' }}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddComment(post.id)}
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedView;
