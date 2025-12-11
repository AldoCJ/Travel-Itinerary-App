import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Settings = () => {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    // DELETE POPUP
    const handleDeleteAccount = () => {
        setShowConfirm(true);
    };

    // CONFIRM DELETE → CALL BACKEND
    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.delete(
                `/api/users/me`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("Account deleted!");
            navigate("/");
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete account.");
        }
    };




    const cancelDelete = () => {
        setShowConfirm(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            background: 'rgba(2, 15, 31, 1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 0
        }}>

            {/* Top right "Back to Profile" button */}
            <button
                onClick={() => navigate('/Profile')}
                style={{
                    position: 'absolute',
                    top: '32px',
                    right: '48px',
                    background: '#fff',
                    color: '#3a8dde',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.6rem 1.4rem',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    cursor: 'pointer',
                    zIndex: 2
                }}
            >
                Back to Profile
            </button>

            <div style={{
                background: '#fff',
                padding: '2.5rem',
                borderRadius: '20px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                width: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h2 style={{ color: '#3a8dde', marginBottom: '2rem', fontWeight: 'bold' }}>Settings</h2>

                <button
                    onClick={handleLogout}
                    style={{
                        background: '#3a8dde',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.8rem 2rem',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        marginBottom: '1.5rem',
                        cursor: 'pointer'
                    }}
                >
                    Log Out
                </button>

                <button
                    onClick={handleDeleteAccount}
                    style={{
                        background: '#fff',
                        color: '#d32f2f',
                        border: '2px solid #d32f2f',
                        borderRadius: '8px',
                        padding: '0.8rem 2rem',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    Delete Account
                </button>
            </div>

            {/* Confirm delete modal */}
            {showConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10
                }}>
                    <div style={{
                        background: '#fff',
                        padding: '2rem',
                        borderRadius: '16px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: '320px'
                    }}>
                        <p style={{
                            marginBottom: '1.5rem',
                            fontWeight: 'bold',
                            color: '#d32f2f',
                            fontSize: '1.1rem'
                        }}>
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={confirmDelete}
                                style={{
                                    background: '#d32f2f',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.6rem 1.4rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Yes, Delete
                            </button>

                            <button
                                onClick={cancelDelete}
                                style={{
                                    background: '#eee',
                                    color: '#333',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.6rem 1.4rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;