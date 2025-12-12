import './App.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from './api/axiosInstance';
import TripGrid from './Components/TripGrid';

function Profile() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const fetchUserAndTrips = async () => {
            try {
                const storedToken = localStorage.getItem('token');
                const storedUserJson = localStorage.getItem('user');

                if (!storedToken || !storedUserJson) {
                    throw new Error('Not authenticated. Please sign in.');
                }

                const currentUser = JSON.parse(storedUserJson);
                const userId = currentUser?.id;
                if (!userId) {
                    throw new Error('Invalid user data. Please sign in again.');
                }

                // Fetch user data by ID
                const userRes = await api.get(`/users/${userId}`);
                const userData = userRes.data;

                // Fetch only this user's trips using /trips?userId=...
                const tripsRes = await api.get('/trips', { params: { userId } });

                const formattedPosts = (Array.isArray(tripsRes.data) ? tripsRes.data : []).map(trip => ({
                    id: trip.id,
                    title: trip.title ?? 'Untitled',
                    destination: trip.summary ?? '',
                    duration: `${String(trip.start_date ?? '').slice(0, 10)} → ${String(trip.end_date ?? '').slice(0, 10)}`,
                    thumbnail: trip.photo_url || '/public-imgs/tokyopic.png',
                    likes: trip.number_of_people ?? 0,
                    total_price: trip.total_price ?? 0,
                    date: String(trip.start_date ?? '').slice(0, 10),
                    endDate: String(trip.end_date ?? '').slice(0, 10)
                }));

                if (!isMounted) return;

                setUser({
                    username: userData.username || userData.email || userData.name || 'user',
                    fullName: userData.name || '',
                    bio: userData.about_me ?? '',
                    profileImage: userData.profile_pic_url ?? '/public-imgs/defaultPfp copy.jpg',
                    postCount: formattedPosts.length,   
                    isOwnProfile: true
                });

                setPosts(formattedPosts);
                setLoading(false);
            } catch (err) {
                if (!isMounted) return;
                setError(err.response?.data?.error || err.message);
                setLoading(false);
            }
        };

        fetchUserAndTrips();
        return () => { isMounted = false; };
    }, []);

    if (loading) return <h3>Loading trips...</h3>;
    if (error) return <h3>Error: {error}</h3>;
    if (!user) return <h3>No user found.</h3>;

    return (
        <div className="Profile">
            <NavLink to="/Home" className="back-button-clean">← Home</NavLink>
            
            <div className="profile-container">
                {/* Profile Info Section */}
                <div className="profile-info">
                    <div className="profile-image-section">
                        <img 
                            src={user.profileImage} 
                            alt={user.fullName || user.username}
                            className="profile-image"
                        />
                    </div>
                    
                    <div className="profile-details">
                        <div className="profile-names">
                            <h3 className="username">{user.username}</h3>
                        </div>

                        <div className="profile-stats">
                            <span className="stat">
                                <strong>{user.postCount}</strong> itineraries
                            </span>
                        </div>

                        {user.bio && <p className="bio-text">{user.bio}</p>}

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