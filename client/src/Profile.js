import './App.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import TripGrid from './Components/TripGrid';

function Profile() {
    // Mock user data - replace with API call
    const [user] = useState({
        username: 'wanderlust_traveler',
        fullName: 'Alex Johnson',
        bio: 'Travel enthusiast sharing amazing itineraries from around the world 🌍✈️',
        profileImage: '/public-imgs/tennisbirdpfp.png', 
        postCount: 6,

        isOwnProfile: true
    });

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/trips')
            .then((res) => {
                // Map API data to match the format your TripGrid expects
                const formattedPosts = res.data.map(trip => ({
                    id: trip.id,
                    title: trip.title,
                    destination: trip.summary, // or wherever you want
                    duration: `${trip.start_date.slice(0, 10)} → ${trip.end_date.slice(0, 10)}`,
                    thumbnail: '/public-imgs/tokyopic.png', // placeholder if API has no image
                    likes: trip.number_of_people, // or another field if you have
                    date: trip.start_date.slice(0, 10)
                }));
                setPosts(formattedPosts);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <h3>Loading trips...</h3>;
    if (error) return <h3>Error: {error}</h3>;


    // Mock travel posts (full trip shape) - replace with API call
    return (
        <div className="Profile">
            <NavLink to="/Home" className="back-button-clean">← Home</NavLink>
            
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
                        </div>

                        <p className="bio-text">{user.bio}</p>

                        {user.isOwnProfile ? (
                            <div className="profile-actions">
                                <NavLink to="/edit-profile" className="edit-profile-btn">
                                    Edit Profile
                                </NavLink>
                                <button
                                    className="settings-btn"
                                    onClick={() => navigate('/settings')}
                                >
                                    Settings
                                </button>
                            </div>
                        ) : (
                            <div className="profile-actions">
                                <button className="follow-btn">Follow</button>
                                <button className="message-btn">Message</button>
                            </div>
                        )}
                    </div>
                </div>

                <TripGrid posts={posts} isOwnProfile={user.isOwnProfile} />
                
            </div>
        </div>
    );
}

export default Profile;