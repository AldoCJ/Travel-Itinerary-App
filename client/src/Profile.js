import './App.css';
import { NavLink } from 'react-router-dom';

function Profile() {
    return (
        <div className="Profile">
            <h>Profile Page</h>
            <br></br>
            <button>
                <nav>
                    <NavLink to="/">Back</NavLink>
                </nav>
            </button>
        </div>
    );
}

export default Profile;