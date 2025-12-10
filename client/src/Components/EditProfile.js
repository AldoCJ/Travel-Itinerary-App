import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import

// Local default profile picture (place your default image in public or src/assets)
import defaultPfp from '../assets/defaultPfp.jpg';

const EditProfile = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [pfp, setPfp] = useState(defaultPfp);
  const [pfpFile, setPfpFile] = useState(null);
  const navigate = useNavigate(); // Add this line

  // Handle profile picture change
  const handlePfpChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      setPfpFile(file);
      setPfp(URL.createObjectURL(file));
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log the data
    console.log({ username, name, bio, pfpFile });
    alert('Profile updated! (Front-end only)');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw', // ensures full width
      background: 'rgba(2, 15, 31, 1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed', // optional: prevents scrolling
      top: 0,
      left: 0,
      zIndex: 0
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          width: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <h2 style={{ color: '#3a8dde', marginBottom: '1rem' }}>Edit Profile</h2>
        <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img
            src={pfp}
            alt="Profile"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #0c1f33ff'
            }}
          />
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handlePfpChange}
            style={{ marginTop: '0.5rem', marginLeft: '164px' }} // adjust this value as needed
          />
        </div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
          required
        />
        <textarea
          placeholder="About Me / Bio"
          value={bio}
          onChange={e => setBio(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            minHeight: '60px'
          }}
        />
        <button
          type="submit"
          style={{
            background: '#3a8dde',
            color: '#fff',
            padding: '0.7rem 2rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => navigate('/Profile')}
          style={{
            background: '#eee',
            color: '#333',
            padding: '0.7rem 2rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%'
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProfile;