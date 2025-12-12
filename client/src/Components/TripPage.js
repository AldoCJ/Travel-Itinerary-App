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
    const [days, setDays] = useState([]);
    const [daysLoading, setDaysLoading] = useState(true);

    // Delete modal & state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (stateTrip) return; // we already have the trip from navigation state

        const fetchTripDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/trips/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                });
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
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/trips/${id}/days`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                });
                if (response.status === 404) {
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

    useEffect(() => {
        if (days.length === 0) return;
        const fetchEventsForDays = async () => {
            const token = localStorage.getItem('token');
            const updatedDays = await Promise.all(
                days.map(async (day) => {
                    try {
                        const res = await fetch(`/api/trips/${id}/days/${day.id}/events`, {
                            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                        });
                        if (res.status === 404) {
                            return { ...day, events: [] };
                        }
                        if (!res.ok) {
                            console.error("Failed fetching events for day:", await res.text());
                            return { ...day, events: [] };
                        }
                        const events = await res.json();
                        return { ...day, events };
                    } catch (error) {
                        console.error("Error fetching events for day:", day.id, error);
                        return { ...day, events: [] };
                    }
                })
            );
            setDays(updatedDays);
        };
        fetchEventsForDays();
    }, [days.length, id]);

    // Close modal helper
    const closeDeleteModal = () => {
        if (deleting) return;
        setShowDeleteConfirm(false);
    };

    // handle Escape key to close modal
    useEffect(() => {
        if (!showDeleteConfirm) return;
        const onKey = (e) => {
            if (e.key === 'Escape') closeDeleteModal();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [showDeleteConfirm, deleting]);

    const handleDelete = async () => {
        if (!trip) return;
        setDeleting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/trips/${id}`, {
                method: 'DELETE',
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || 'Failed to delete trip');
            }
            navigate('/Profile');
        } catch (error) {
            console.error('Delete trip error:', error);
            alert('Failed to delete trip. See console for details.');
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

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

                {/* Edit + Delete actions — visible only to owner */}
                {stateIsOwn && (
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <button
                            className="create-post-btn-small"
                            onClick={() => navigate(`/edit-itinerary/${id}`, { state: { trip } })}
                        >
                            Edit Trip
                        </button>

                        <button
                            className="btn danger"
                            onClick={() => setShowDeleteConfirm(true)}
                            title="Delete trip"
                        >
                            Delete
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

                        {daysLoading && <p>Loading itinerary...</p>}

                        {!daysLoading && days.length === 0 && (
                            <p>No days available for this trip.</p>
                        )}

                        {!daysLoading && days.length > 0 && (
                            <>
                                {days.map((day, index) => (
                                    <div key={day.id} className="day-item">
                                        <h4>Day {index + 1}</h4>

                                        {/* Events */}
                                        {!day.events || day.events.length === 0 ? (
                                            <p>No events for this day.</p>
                                        ) : (
                                            <ul>
                                                {day.events.map((event, actIndex) => (
                                                    <li key={event.id || actIndex}>
                                                        <strong>{event.time || "No time"}</strong>
                                                        {" – "}
                                                        {event.title || event.description || "Untitled Event"}
                                                        {event.location && (
                                                            <span className="location"> 📍 {event.location}</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </>
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

            {/* Delete confirmation modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div
                        className="confirm-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="confirm-delete-title"
                        aria-describedby="confirm-delete-desc"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 id="confirm-delete-title">Delete trip?</h2>
                        <p id="confirm-delete-desc" className="confirm-message">
                            This will permanently delete the trip and cannot be undone.
                            <br />
                            Are you sure you want to delete "<strong>{trip.title}</strong>"?
                        </p>

                        <div className="confirm-actions">
                            <button className="btn" onClick={closeDeleteModal} disabled={deleting}>Cancel</button>
                            <button className="btn danger" onClick={handleDelete} disabled={deleting}>
                                {deleting ? 'Deleting...' : 'Delete Trip'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TripPage;