import './App.css';
import React, { useState } from 'react';
import Header from './Components/Header';
import TripGrid from './Components/TripGrid';

function Home() {
    const [posts] = useState([
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

    const [query, setQuery] = useState('');
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase())
    );

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