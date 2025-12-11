import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Add authentication logic here
        navigate('/Home');
    };

    return (
        <div
            className="landing"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'none',
                border: 'none'
            }}
        >
            <div
                className="login"
                style={{
                    background: 'rgba(0, 0, 0, 0.73)',
                    padding: '40px 32px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.18)',
                    textAlign: 'center',
                    minWidth: '340px',
                    maxWidth: '400px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: '8px solid #f8f8f8'
                }}
            >
                <header style={{ color: '#f8f8d8', fontSize: '2rem', marginBottom: '24px' }}>Login</header>
                <form onSubmit={handleLogin}>
                    <input
                        className="user form-control"
                        type="text"
                        placeholder="Username"
                        required
                        style={{ marginBottom: '20px', width: '100%' }}
                    />
                    <br />
                    <input
                        className="pwd form-control"
                        type="password"
                        placeholder="Password"
                        required
                        style={{ marginBottom: '20px', width: '100%' }}
                    />
                    <br />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            background: '#1976d2ff',
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
                        Login
                    </button>
                </form>
                <div style={{ marginTop: '24px', color: 'white', fontSize: '1.2rem' }}>
                    Don't have an account?{' '}
                    <NavLink to="/Register" style={{ color: '#90caf9', textDecoration: 'underline' }}>
                        Sign up here!
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default Login;