import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import TripGrid from './Components/TripGrid';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');

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

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase())
    );

    if (loading) return <h3>Loading trips...</h3>;
    if (error) return <h3>Error: {error}</h3>;

    return (
        <>
            <Header onSearch={setQuery} />
            <main className="home-main">
                <TripGrid posts={filteredPosts} isOwnProfile={false} />
            </main>
        </>
    );
}

export default Home;