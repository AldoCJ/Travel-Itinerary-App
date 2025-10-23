import './App.css';
import React from 'react';
import { NavLink } from 'react-router-dom';
import Side from './Components/Side';

function Home() {
    return (
        <>
        <Side />
            <h>Home Page</h>
        <button>
            <nav>
                <NavLink to="/">Back</NavLink>
            </nav>
        </button>
        </>
    );
}
export default Home;