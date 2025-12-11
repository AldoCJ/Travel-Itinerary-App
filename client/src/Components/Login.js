import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("/api/auth/signin", {
                email,
                password
            });

            if (!response.data?.access_token) {
                setError("Login failed: No token returned.");
                return;
            }

            // Save token + user
            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            navigate("/Home");
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.error || "Login failed.");
            } else {
                setError("Network error. Please try again.");
            }
        }
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
                <header style={{ color: '#f8f8d8', fontSize: '2rem', marginBottom: '24px' }}>
                    Login
                </header>

                {error && (
                    <div style={{ color: 'red', marginBottom: '16px', fontSize: '1rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <input
                        className="user form-control"
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ marginBottom: '20px', width: '100%' }}
                    />
                    <br />
                    <input
                        className="pwd form-control"
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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