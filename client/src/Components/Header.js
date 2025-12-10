import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../App.css';

function Header({ onSearch }) {
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(value);
        }
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <h1 className="app-title">Travel Itinerary</h1>
            </div>

            <div className="header-center">
                <input
                    type="search"
                    placeholder="Search trips by name..."
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="search-input"
                    aria-label="Search trips"
                />
            </div>

            <div className="header-right">
                <NavLink to="/Profile" className="profile-button" title="Your profile">
                    <img
                        src="/public-imgs/DefaultPfp.jpg"
                        alt="Your profile"
                        className="profile-image"
                        width="40"
                        height="40"
                    />
                </NavLink>
            </div>
        </header>
    );
}

export default Header;