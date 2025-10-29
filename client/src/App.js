import './App.css';
import Login from './Components/Login';
import Profile from './Profile';
import Home from './Home';
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
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
  );
} 

export default App;