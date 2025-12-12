import React from 'react';
import { NavLink } from 'react-router-dom';

function TripGrid({ posts, isOwnProfile }) {
    console.log('posts:', posts);
    return (
        <div className="posts-section">
            <div className="posts-header">
                {isOwnProfile && (
                    <NavLink to="/create-itinerary" className="create-post-btn-small">
                        + Create
                    </NavLink>
                )}
            </div>

            <div className="posts-grid">
                {posts.map(post => (
                    <div key={post.id} className="post-card-small">
                        <NavLink
                            to={`/itinerary/${post.id}`}
                            state={{ trip: post, isOwnProfile }} // pass ownership to TripPage
                            className="post-link"
                        >
                            <div className="post-thumbnail-small">
                                <img src={post.thumbnail} alt={post.title} />
                                <div className="post-overlay">
                                    <span className="post-stats">
                                        $ {post.total_price}
                                    </span>
                                </div>
                            </div>
                            <div className="post-info-small">
                                <h4 className="post-title-small">{post.title}</h4>
                                <p className="post-duration-small">{post.duration}</p>
                            </div>
                        </NavLink>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TripGrid;