import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        // Add registration logic here
        navigate('/Home');
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
        }}>
            <div style={{
                background: 'rgba(0, 0, 0, 0.56)',
                padding: '40px 32px',
                borderRadius: '16px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                textAlign: 'center',
                minWidth: '340px',
                maxWidth: '400px',
                width: '100%',
                border: '8px solid #f8f8f8'
            }}>
                <header style={{ color: '#f8f8d8', fontSize: '2rem', marginBottom: '24px' }}>Register</header>
                <form onSubmit={handleRegister}>
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        style={{ marginBottom: '20px', width: '100%' }}
                    />
                    <br />
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        style={{ marginBottom: '20px', width: '100%' }}
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        style={{ marginBottom: '20px', width: '100%' }}
                    />
                    <br />
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            background: '#1976d2',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 0',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            marginBottom: '10px'
                        }}
                    >
                        Register
                    </button>
                </form>
                <div style={{ marginTop: '24px', color: 'white', fontSize: '1.2rem' }}>
                    Already registered?{' '}
                    <NavLink to="/" style={{ color: '#90caf9', textDecoration: 'underline' }}>
                        Sign in here!
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default Register;