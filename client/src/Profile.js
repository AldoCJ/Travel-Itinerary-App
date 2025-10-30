import './App.css';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import TripGrid from './Components/TripGrid';

function Profile() {
    // Mock user data - replace with API call
    const [user] = useState({
        username: 'wanderlust_traveler',
        fullName: 'Alex Johnson',
        bio: 'Travel enthusiast sharing amazing itineraries from around the world 🌍✈️',
        profileImage: '/public-imgs/tennisbirdpfp.png', 
        postCount: 6,
        followerCount: 1205,
        followingCount: 384,
        isOwnProfile: true
    });

    // Mock travel posts (full trip shape) - replace with API call
    const [posts] = useState([
        {
            id: 1,
            title: 'Tokyo Adventure',
            destination: 'Tokyo, Japan',
            duration: '7 days',
            thumbnail: '/public-imgs/tokyopic.png',
            likes: 156,
            date: '2024-10-15',
            description: 'Immersive trip through Tokyo — temples, neon neighborhoods, and world-class sushi.',
            itinerary: [
                {
                    activities: [
                        { time: '09:00', description: 'Arrive Narita; train to Asakusa', location: 'Asakusa' },
                        { time: '13:00', description: 'Lunch at Tsukiji Outer Market', location: 'Tsukiji' },
                        { time: '15:00', description: 'Explore Akihabara' }
                    ]
                },
                {
                    activities: [
                        { time: '10:00', description: 'Meiji Shrine & Harajuku', location: 'Harajuku' },
                        { time: '14:00', description: 'Shibuya crossing & Hachiko statue', location: 'Shibuya' }
                    ]
                }
            ],
            tips: ['Buy a Suica/Pasmo card', 'Carry small bills', 'Reserve top sushi places ahead'],
            budget: 'Approx. $1,500 - $2,200 per person'
        },
        {
            id: 2,
            title: 'NYC Exploration',
            destination: 'New York, USA',
            duration: '5 days',
            thumbnail: '/public-imgs/nyc.png',
            likes: 203,
            date: '2024-09-10',
            description: 'Classic New York — museums, skyline views, and local food spots.',
            itinerary: [
                {
                    activities: [
                        { time: '09:00', description: 'Walk Central Park' },
                        { time: '12:00', description: 'Visit the Met', location: 'Upper East Side' },
                        { time: '19:00', description: 'Times Square at night', location: 'Midtown' }
                    ]
                },
                {
                    activities: [
                        { time: '10:00', description: 'Statue of Liberty ferry', location: 'Battery Park' },
                        { time: '15:00', description: 'Explore SoHo & Little Italy' }
                    ]
                }
            ],
            tips: ['Get a MetroCard', 'Book observatory tickets in advance'],
            budget: 'Approx. $900 - $1,400 per person'
        },
        {
            id: 3,
            title: 'Paris Romance',
            destination: 'Paris, France',
            duration: '8 days',
            thumbnail: '/public-imgs/paris.png',
            likes: 187,
            date: '2024-08-20',
            description: 'A romantic stroll through Parisian streets, museums, and cafés.',
            itinerary: [
                {
                    activities: [
                        { time: '09:30', description: 'Eiffel Tower & Champ de Mars', location: '7th arrondissement' },
                        { time: '14:00', description: 'Louvre visit', location: '1st arrondissement' }
                    ]
                },
                {
                    activities: [
                        { time: '10:00', description: 'Montmartre and Sacré-Cœur', location: 'Montmartre' },
                        { time: '17:00', description: 'Seine river cruise' }
                    ]
                }
            ],
            tips: ['Buy museum timed-entry tickets', 'Learn a few basic French phrases'],
            budget: 'Approx. $1,200 - $1,800 per person'
        },
        {
            id: 4,
            title: 'Portland Vibes',
            destination: 'Portland, Oregon',
            duration: '4 days',
            thumbnail: '/public-imgs/portland.png',
            likes: 142,
            date: '2024-07-15',
            description: 'Coffee, food trucks, and nature close to the city.',
            itinerary: [
                {
                    activities: [
                        { time: '10:00', description: 'Powell’s City of Books', location: 'Downtown' },
                        { time: '13:00', description: 'Lunch at food cart pod' }
                    ]
                },
                {
                    activities: [
                        { time: '09:00', description: 'Day trip to Columbia River Gorge', location: 'Cascade Locks' }
                    ]
                }
            ],
            tips: ['Bring a light rain jacket', 'Rent a bike to explore the Eastside' ],
            budget: 'Approx. $600 - $900 per person'
        },
        {
            id: 5,
            title: 'Seoul Discovery',
            destination: 'Seoul, South Korea',
            duration: '10 days',
            thumbnail: '/public-imgs/seoul.png',
            likes: 0,
            date: '2024-06-10',
            description: 'K-pop culture, traditional palaces, and late-night street food.',
            itinerary: [
                {
                    activities: [
                        { time: '10:00', description: 'Gyeongbokgung Palace & changing of the guard', location: 'Jongno' },
                        { time: '13:00', description: 'Bukchon Hanok Village' }
                    ]
                },
                {
                    activities: [
                        { time: '18:00', description: 'Myeongdong street shopping & food', location: 'Myeongdong' }
                    ]
                }
            ],
            tips: ['Get a T-money card', 'Use Naver/KaKao maps for walking routes'],
            budget: 'Approx. $1,400 - $2,000 per person'
        },
        {
            id: 6,
            title: 'Brazil Adventure',
            destination: 'Brazil',
            duration: '14 days',
            thumbnail: '/public-imgs/brazil.png',
            likes: 198,
            date: '2024-05-05',
            description: 'Coastline, rainforest, and vibrant cities.',
            itinerary: [
                {
                    activities: [
                        { time: '09:00', description: 'Rio de Janeiro — Christ the Redeemer & Copacabana', location: 'Rio' },
                        { time: '16:00', description: 'Lapa neighborhood evening' }
                    ]
                },
                {
                    activities: [
                        { time: '08:00', description: 'Amazon rainforest lodge stay', location: 'Amazon' }
                    ]
                }
            ],
            tips: ['Check vaccination requirements', 'Book domestic flights early'],
            budget: 'Approx. $2,000 - $3,500 per person'
        }
    ]);

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

                <TripGrid posts={posts} isOwnProfile={user.isOwnProfile} />
                
            </div>
        </div>
    );
}

export default Profile;