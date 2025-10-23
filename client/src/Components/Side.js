import '../App.css';
import React from 'react';
import { NavLink } from 'react-router-dom';

function Side() {
    return (
        <>
        <div className="side">
                <button className="btn1">
                    <nav className="link">
                    <NavLink to="/Profile">Back</NavLink>
                </nav>
            </button>
            <button className="btn2">1</button>
            <button className="btn3">2</button>
            <button className="btn4">3</button>
        </div>
        </>
    );
}
export default Side;