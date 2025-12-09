import './App.css';
import Login from './Components/Login';
import Profile from './Profile';
import Home from './Home';
import TripPage from './Components/TripPage';
import CreateTrip from './Components/CreateTrip';
import EditTrip from './Components/EditTrip';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestAPI from './TestAPI';

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
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
  );
} 

export default App;