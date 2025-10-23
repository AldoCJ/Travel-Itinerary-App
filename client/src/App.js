import './App.css';
import axios from 'axios';
import React, {useState, useEffect} from 'react';


function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    axios
    .get('/api/trips')
    .then(res => res.data)
    .then(data => setData(data));
  }, []);

  return (
    <>
      <h1>Below is the data from the API</h1>
      <h3>DATA: {data}</h3>
    </>
  )};

export default App;