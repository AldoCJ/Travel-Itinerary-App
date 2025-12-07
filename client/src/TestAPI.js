import axios from 'axios';
import React, { useState, useEffect } from 'react';

function TestAPI() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/trips')
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <h3>Loading…</h3>;
    if (error) return <h3>Error: {error}</h3>;

    return (
        <>
            <h1>Below is the data from the API</h1>

            <ul>
                {data.map((trip) => (
                    <li key={trip.id}>
                        <strong>{trip.title}</strong> — {trip.summary}<br />
                        <em>{trip.start_date} → {trip.end_date}</em><br />
                        People: {trip.number_of_people} • Price: ${trip.total_price}
                        <hr />
                    </li>
                ))}
            </ul>
        </>
    );
}

export default TestAPI;
