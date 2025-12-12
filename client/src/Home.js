import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import TripGrid from './Components/TripGrid';
import api from './api/axiosInstance';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');

    // Helper to map API trips to TripGrid format
    const mapTrips = (trips) => {
        console.log(trips);
        return trips.map(trip => ({
            id: trip.id,
            title: trip.title,
            destination: trip.summary,
            duration: `${trip.start_date} → ${trip.end_date}`,
            thumbnail: trip.photo_url || '/public-imgs/tokyopic.png',
            likes: trip.number_of_people,
            total_price: trip.total_price,
            date: trip.start_date
        }));
    };

    // Initial load: all trips
    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);

        api.get('/trips')
            .then((res) => {
                if (!active) return;
                setPosts(mapTrips(res.data));
                setLoading(false);
            })
            .catch((err) => {
                if (!active) return;
                setError(err.message);
                setLoading(false);
            });

        return () => { active = false; };
    }, []);

    // Server-side search when query changes (triggered by Enter in Header)
    useEffect(() => {
        // If query is empty, reload all trips to restore the list
        if (!query || !query.trim()) {
            let active = true;
            setLoading(true);
            setError(null);

            api.get('/trips')
                .then((res) => {
                    if (!active) return;
                    setPosts(mapTrips(res.data));
                    setLoading(false);
                })
                .catch((err) => {
                    if (!active) return;
                    setError(err.message);
                    setLoading(false);
                });

            return () => { active = false; };
        }

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        axios.get('/api/trips/search', {
            params: { query },
            signal: controller.signal,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`
            }
        })
            .then((res) => {
                setPosts(mapTrips(res.data || []));
                setLoading(false);
            })
            .catch((err) => {
                if (err.name === 'CanceledError') return;
                setError(err.message);
                setLoading(false);
            });

        return () => {
            controller.abort();
        };
    }, [query]);

    /*const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase())
    );*/

    return (
        <>
            <Header onSearch={setQuery} />
            <main className="home-main">
                {loading && <h3>Loading trips...</h3>}
                {!loading && error && <h3>Error: {error}</h3>}
                {!loading && !error && (
                    <TripGrid posts={posts} isOwnProfile={false} />
                )}
            </main>
        </>
    );
}

export default Home;