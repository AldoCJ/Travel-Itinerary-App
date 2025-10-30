import React from 'react';
import { NavLink } from 'react-router-dom';

function TripCard({ post }) {
    return (
        <div className="post-card-small">
            <NavLink to={`/itinerary/${post.id}`} state={{ trip: post }} className="post-link">
                <div className="post-thumbnail-small">
                    <img src={post.thumbnail} alt={post.title} />
                    <div className="post-overlay">
                        <span className="post-stats">
                            ❤️ {post.likes}
                        </span>
                    </div>
                </div>
                <div className="post-info-small">
                    <h4 className="post-title-small">{post.title}</h4>
                    <p className="post-destination-small">{post.destination}</p>
                    <p className="post-duration-small">{post.duration}</p>
                </div>
            </NavLink>
        </div>
    );
}

export default TripCard;