/**
 * Discussion Forum Component
 * 
 * Community discussion forums for course topics.
 */

import React, { useState } from 'react';
import './DiscussionForum.css';

interface User {
    id: string;
    name: string;
    avatar?: string;
    belt?: string;
}

interface Reply {
    id: string;
    author: User;
    content: string;
    createdAt: Date;
    likes: number;
    isAnswer?: boolean;
}

interface Post {
    id: string;
    title: string;
    content: string;
    author: User;
    category: string;
    tags: string[];
    createdAt: Date;
    replies: Reply[];
    views: number;
    isPinned?: boolean;
    isResolved?: boolean;
}

interface DiscussionForumProps {
    posts?: Post[];
    categories?: string[];
    currentUser?: User;
    onNewPost?: (post: Partial<Post>) => void;
    onReply?: (postId: string, reply: Partial<Reply>) => void;
}

const DEMO_POSTS: Post[] = [
    {
        id: '1',
        title: 'How to interpret R-squared in regression analysis?',
        content: 'I\'m working on a regression model and my R-squared is 0.65. Is this considered good? How do I know if it\'s acceptable for my analysis?',
        author: { id: '2', name: 'Mike Johnson', belt: 'green' },
        category: 'Statistics',
        tags: ['regression', 'r-squared'],
        createdAt: new Date('2026-02-13'),
        replies: [
            {
                id: 'r1',
                author: { id: '3', name: 'Sarah Chen', belt: 'black' },
                content: 'R-squared of 0.65 means 65% of the variance is explained by your model. Whether this is "good" depends on your field. In social sciences, 0.65 is often considered good, while in physics you might expect 0.95+.',
                createdAt: new Date('2026-02-13'),
                likes: 12,
                isAnswer: true
            }
        ],
        views: 156,
        isPinned: true,
        isResolved: true
    },
    {
        id: '2',
        title: 'DMAIC vs DMADV - When to use which?',
        content: 'Can someone explain the difference between DMAIC and DMADV, and when should I choose one over the other?',
        author: { id: '4', name: 'Emma Davis', belt: 'yellow' },
        category: 'Methodology',
        tags: ['dmaic', 'dmadv'],
        createdAt: new Date('2026-02-12'),
        replies: [],
        views: 89
    }
];

const CATEGORIES = ['All', 'Statistics', 'Methodology', 'Tools', 'Certification', 'General'];

export const DiscussionForum: React.FC<DiscussionForumProps> = ({
    posts = DEMO_POSTS,
    categories = CATEGORIES,
    currentUser,
    onNewPost,
    onReply
}) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General', tags: '' });
    const [newReply, setNewReply] = useState('');

    const filteredPosts = posts.filter((post) => {
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        return `${days} days ago`;
    };

    const handleNewPost = () => {
        if (newPost.title && newPost.content && currentUser) {
            onNewPost?.({
                ...newPost,
                tags: newPost.tags.split(',').map((t) => t.trim()),
                author: currentUser
            });
            setNewPost({ title: '', content: '', category: 'General', tags: '' });
            setShowNewPostForm(false);
        }
    };

    const handleReply = () => {
        if (newReply && selectedPost && currentUser) {
            onReply?.(selectedPost.id, { content: newReply, author: currentUser });
            setNewReply('');
        }
    };

    const getBeltColor = (belt?: string) => {
        const colors: Record<string, string> = {
            white: '#f5f5f5',
            yellow: '#ffd700',
            green: '#28a745',
            black: '#1a1a1a'
        };
        return belt ? colors[belt] : '#ccc';
    };

    if (selectedPost) {
        return (
            <div className="discussion-forum">
                <button className="back-btn" onClick={() => setSelectedPost(null)}>
                    ← Back to Discussions
                </button>

                <div className="post-detail">
                    <div className="post-header">
                        <h2>{selectedPost.title}</h2>
                        <div className="post-meta">
                            <span className={`category-tag ${selectedPost.category.toLowerCase()}`}>
                                {selectedPost.category}
                            </span>
                            {selectedPost.isResolved && <span className="resolved-badge">✓ Resolved</span>}
                        </div>
                    </div>

                    <div className="post-content">
                        <div className="author-info">
                            <div className="author-avatar">
                                {selectedPost.author.name.charAt(0)}
                                <span
                                    className="belt-indicator"
                                    style={{ backgroundColor: getBeltColor(selectedPost.author.belt) }}
                                />
                            </div>
                            <div>
                                <div className="author-name">{selectedPost.author.name}</div>
                                <div className="post-date">{formatDate(selectedPost.createdAt)}</div>
                            </div>
                        </div>
                        <p>{selectedPost.content}</p>
                        <div className="post-tags">
                            {selectedPost.tags.map((tag) => (
                                <span key={tag} className="tag">#{tag}</span>
                            ))}
                        </div>
                    </div>

                    <div className="replies-section">
                        <h3>{selectedPost.replies.length} Replies</h3>

                        {selectedPost.replies.map((reply) => (
                            <div key={reply.id} className={`reply ${reply.isAnswer ? 'is-answer' : ''}`}>
                                <div className="author-info">
                                    <div className="author-avatar">
                                        {reply.author.name.charAt(0)}
                                        <span
                                            className="belt-indicator"
                                            style={{ backgroundColor: getBeltColor(reply.author.belt) }}
                                        />
                                    </div>
                                    <div>
                                        <div className="author-name">{reply.author.name}</div>
                                        <div className="post-date">{formatDate(reply.createdAt)}</div>
                                    </div>
                                </div>
                                <p>{reply.content}</p>
                                <div className="reply-actions">
                                    <button className="action-btn">👍 {reply.likes}</button>
                                    {reply.isAnswer && <span className="answer-label">✓ Best Answer</span>}
                                </div>
                            </div>
                        ))}

                        {currentUser && (
                            <div className="reply-form">
                                <textarea
                                    placeholder="Write your reply..."
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)}
                                    rows={4}
                                />
                                <button className="submit-btn" onClick={handleReply}>
                                    Post Reply
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="discussion-forum">
            <div className="forum-header">
                <h2>💬 Discussion Forum</h2>
                {currentUser && (
                    <button className="new-post-btn" onClick={() => setShowNewPostForm(true)}>
                        + New Post
                    </button>
                )}
            </div>

            <div className="forum-controls">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="category-tabs">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {showNewPostForm && (
                <div className="new-post-form">
                    <h3>Create New Post</h3>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    />
                    <select
                        value={newPost.category}
                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    >
                        {categories.slice(1).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <textarea
                        placeholder="Your question or discussion topic..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        rows={5}
                    />
                    <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        value={newPost.tags}
                        onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    />
                    <div className="form-actions">
                        <button className="cancel-btn" onClick={() => setShowNewPostForm(false)}>
                            Cancel
                        </button>
                        <button className="submit-btn" onClick={handleNewPost}>
                            Post
                        </button>
                    </div>
                </div>
            )}

            <div className="posts-list">
                {filteredPosts.map((post) => (
                    <div
                        key={post.id}
                        className={`post-card ${post.isPinned ? 'pinned' : ''}`}
                        onClick={() => setSelectedPost(post)}
                    >
                        {post.isPinned && <span className="pinned-badge">📌 Pinned</span>}
                        <div className="post-title-row">
                            <h3>{post.title}</h3>
                            {post.isResolved && <span className="resolved-badge small">✓</span>}
                        </div>
                        <p className="post-excerpt">{post.content.substring(0, 100)}...</p>
                        <div className="post-footer">
                            <div className="post-author">
                                <span className="author-avatar small">
                                    {post.author.name.charAt(0)}
                                    <span
                                        className="belt-indicator"
                                        style={{ backgroundColor: getBeltColor(post.author.belt) }}
                                    />
                                </span>
                                {post.author.name}
                            </div>
                            <div className="post-stats">
                                <span>💬 {post.replies.length}</span>
                                <span>👁 {post.views}</span>
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscussionForum;