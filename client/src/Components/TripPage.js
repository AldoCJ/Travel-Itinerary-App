import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function TripPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const stateTrip = location.state?.trip;
    const stateIsOwn = location.state?.isOwnProfile ?? false;

    const [trip, setTrip] = useState(stateTrip ?? null);
    const [loading, setLoading] = useState(stateTrip ? false : true);

    useEffect(() => {
        if (stateTrip) return; // we already have the trip from navigation state

        const fetchTripDetails = async () => {
            try {
                const response = await fetch(`/api/trips/${id}`);
                if (!response.ok) {
                    console.error('Failed fetching trip details:', response.statusText);
                    setTrip(null);
                } else {
                    const data = await response.json();
                    setTrip(data);
                }
            } catch (error) {
                console.error('Error fetching trip details:', error);
                setTrip(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTripDetails();
    }, [id, stateTrip]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!trip) {
        return <div className="error">Trip not found</div>;
    }

    return (
        <div className="trip-page">
            <button className="back-button-clean" onClick={() => navigate(-1)}>← Back</button>

            <div className="trip-header">
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <h1>{trip.title}</h1>
                  <div className="trip-meta">
                      <span className="destination">📍 {trip.destination}</span>
                      <span className="duration">⏱️ {trip.duration}</span>
                      <span className="likes">❤️ {trip.likes}</span>
                  </div>
                </div>

                {/* Edit button visible only when viewer owns the profile/trip */}
                {stateIsOwn && (
                    <div style={{ marginLeft: 20 }}>
                        <button
                            className="create-post-btn-small"
                            onClick={() => navigate(`/edit-itinerary/${id}`, { state: { trip } })}
                        >
                            Edit Trip
                        </button>
                    </div>
                )}
            </div>

            <div className="trip-content">
                <div className="trip-main-image">
                    <img src={trip.thumbnail} alt={trip.title} />
                </div>

                <div className="trip-details">
                    <h2>Trip Details</h2>
                    <p className="trip-description">{trip.description}</p>
                    
                    <div className="itinerary-section">
                        <h3>Itinerary</h3>
                        {trip.itinerary && trip.itinerary.map((day, index) => (
                            <div key={index} className="day-item">
                                <h4>Day {index + 1}</h4>
                                <ul>
                                    {day.activities.map((activity, actIndex) => (
                                        <li key={actIndex}>
                                            <strong>{activity.time}</strong> - {activity.description}
                                            {activity.location && (
                                                <span className="location"> 📍 {activity.location}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="additional-info">
                        <h3>Additional Information</h3>
                        {trip.tips && (
                            <div className="travel-tips">
                                <h4>Travel Tips</h4>
                                <ul>
                                    {trip.tips.map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {trip.budget && (
                            <div className="budget-info">
                                <h4>Estimated Budget</h4>
                                <p>{trip.budget}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TripPage;