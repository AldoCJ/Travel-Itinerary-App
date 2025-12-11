import React, { useState, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

function Register() {
    const navigate = useNavigate();
    const { signUp, signIn } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // 1. Create user
            await signUp(email, password, name);

            // 2. Auto-login
            const loginData = await signIn(email, password);

            // 3. Save token + user
            localStorage.setItem("token", loginData.access_token);
            localStorage.setItem("user", JSON.stringify(loginData.user));

            // 4. Redirect
            navigate('/Home');

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Registration failed");
        }
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ marginBottom: '20px', width: '100%' }}
                    />

                    <input
                        type="text"
                        placeholder="Username"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginBottom: '20px', width: '100%' }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginBottom: '20px', width: '100%' }}
                    />

                    {error && (
                        <p style={{ color: 'red', marginBottom: "10px" }}>
                            {error}
                        </p>
                    )}

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
