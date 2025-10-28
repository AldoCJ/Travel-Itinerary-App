import './App.css';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Profile() {
    // Mock user data - replace with API call
    const [user, setUser] = useState({
        username: 'wanderlust_traveler',
        fullName: 'Alex Johnson',
        bio: 'Travel enthusiast sharing amazing itineraries from around the world 🌍✈️',
        profileImage: '/public-imgs/tennisbirdpfp.png', 
        postCount: 6,
        followerCount: 1205,
        followingCount: 384,
        isOwnProfile: true
    });

    // Mock travel posts - replace with API call
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: 'Tokyo Adventure',
            destination: 'Tokyo, Japan',
            duration: '7 days',
            thumbnail: '/public-imgs/tokyopic.png',
            likes: 156,
            date: '2024-10-15'
        },
        {
            id: 2,
            title: 'NYC Exploration',
            destination: 'New York, USA',
            duration: '5 days',
            thumbnail: '/public-imgs/nyc.png',
            likes: 203,
            date: '2024-09-10'
        },
        {
            id: 3,
            title: 'Paris Romance',
            destination: 'Paris, France',
            duration: '8 days',
            thumbnail: '/public-imgs/paris.png',
            likes: 187,
            date: '2024-08-20'
        },
        {
            id: 4,
            title: 'Portland Vibes',
            destination: 'Portland, Oregon',
            duration: '4 days',
            thumbnail: '/public-imgs/portland.png',
            likes: 142,
            date: '2024-07-15'
        },
        {
            id: 5,
            title: 'Seoul Discovery',
            destination: 'Seoul, South Korea',
            duration: '10 days',
            thumbnail: '/public-imgs/seoul.png',
            date: '2024-06-10'
        },
        {
            id: 6,
            title: 'Brazil Adventure',
            destination: 'Brazil',
            duration: '14 days',
            thumbnail: '/public-imgs/brazil.png',
            likes: 198,
            date: '2024-05-05'
        }
    ]);

    return (
        <div className="Profile">
            <NavLink to="/" className="back-button-clean">← Home</NavLink>
            
            <div className="profile-container">
                {/* Profile Info Section */}
                <div className="profile-info">
                    <div className="profile-image-section">
                        <img 
                            src={user.profileImage} 
                            alt={user.fullName}
                            className="profile-image"
                        />
                    </div>
                    
                    <div className="profile-details">
                        <div className="profile-names">
                            <h2 className="full-name">{user.fullName}</h2>
                            <h3 className="username">@{user.username}</h3>
                        </div>

                        <div className="profile-stats">
                            <span className="stat">
                                <strong>{user.postCount}</strong> itineraries
                            </span>
                            <span className="stat">
                                <strong>{user.followerCount}</strong> followers
                            </span>
                            <span className="stat">
                                <strong>{user.followingCount}</strong> following
                            </span>
                        </div>

                        <p className="bio-text">{user.bio}</p>

                        {user.isOwnProfile ? (
                            <div className="profile-actions">
                                <button className="edit-profile-btn">Edit Profile</button>
                                <button className="settings-btn"></button>
                            </div>
                        ) : (
                            <div className="profile-actions">
                                <button className="follow-btn">Follow</button>
                                <button className="message-btn">Message</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="posts-section">
                    <div className="posts-header">
                        <h4>Trips</h4>
                        {user.isOwnProfile && (
                            <NavLink to="/create-itinerary" className="create-post-btn-small">
                                + Create
                            </NavLink>
                        )}
                    </div>

                    <div className="posts-grid">
                        {posts.map(post => (
                            <div key={post.id} className="post-card-small">
                                <NavLink to={`/itinerary/${post.id}`} className="post-link">
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;