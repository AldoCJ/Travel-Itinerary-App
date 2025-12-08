import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function TripPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const stateTrip = location.state?.trip;

    const [trip, setTrip] = useState(stateTrip ?? null);
    const [loading, setLoading] = useState(stateTrip ? false : true);
    const [days, setDays] = useState([]);
    const [daysLoading, setDaysLoading] = useState(true);

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

    useEffect(() => {
        const fetchDays = async () => {
            try {
                const response = await fetch(`/api/trips/${id}/days`);

                if (response.status === 404) {
                    // No days exist for this trip → treat as empty
                    console.warn("No days found for this trip.");
                    setDays([]);
                    return;
                }

                if (!response.ok) {
                    console.error("Failed fetching trip days:", response.statusText);
                    return;
                }

                const data = await response.json();
                setDays(data);

            } catch (error) {
                console.error("Error fetching trip days:", error);
            } finally {
                setDaysLoading(false);
            }
        };

        fetchDays();
    }, [id]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!trip) {
        return <div className="error">Trip not found</div>;
    }

    console.log(days);


    return (
        <div className="trip-page">
            <button className="back-button-clean" onClick={() => navigate(-1)}>← Back</button>

            <div className="trip-header">
                <h1>{trip.title}</h1>
                <div className="trip-meta">
                    <span className="destination">📍 {trip.destination}</span>
                    <span className="duration">⏱️ {trip.duration}</span>
                    <span className="likes">❤️ {trip.likes}</span>
                </div>
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

                        {daysLoading && <p>Loading itinerary...</p>}

                        {!daysLoading && days.length === 0 && (
                            <p>No days available for this trip.</p>
                        )}

                        {!daysLoading && days.length > 0 && (
                            days.map((day, index) => (
                                <div key={day.id} className="day-item">
                                    <h4>Day {index + 1}</h4>

                                    {/* If no activities field exists */}
                                    {!day.activities || day.activities.length === 0 ? (
                                        <p>No activities for this day.</p>
                                    ) : (
                                        <ul>
                                            {day.activities.map((activity, actIndex) => (
                                                <li key={actIndex}>
                                                    <strong>{activity.time}</strong> – {activity.description}
                                                    {activity.location && (
                                                        <span className="location">📍 {activity.location}</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))
                        )}
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