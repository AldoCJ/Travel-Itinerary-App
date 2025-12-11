import './App.css';
import Login from './Components/Login';
import Profile from './Profile';
import Home from './Home';
import TripPage from './Components/TripPage';
import CreateTrip from './Components/CreateTrip';
import EditTrip from './Components/EditTrip';
import EditProfile from './Components/EditProfile';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestAPI from './TestAPI';
import Settings from './Components/Settings';
import Register from './Components/Register';

function App() {
  return (
        <div className="App">
            <div className="land">
                <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Login />} />
                      <Route path="/Home" element={<Home />} />
                      <Route path="/Profile" element={<Profile />} />
                      <Route path="/TestAPI" element={<TestAPI />} />
                      <Route path="/itinerary/:id" element={<TripPage />} />
                      <Route path="/create-itinerary" element={<CreateTrip />} />
                      <Route path="/edit-itinerary/:id" element={<EditTrip />} />
                      <Route path="/edit-profile/" element={<EditProfile />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/Register" element={<Register />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
  );
} 

export default App;